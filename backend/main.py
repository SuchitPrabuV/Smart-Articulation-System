import os
import time

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from scoring import stub
from scoring.expected import expected_phonemes, VALID_PHONEMES

app = FastAPI(title="Articulation Scoring API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Engine selection -------------------------------------------------------
# The stub is the default and the permanent demo safety net. The real engine
# is opt-in behind REAL_ENGINE=1 and every failure path falls back to the stub.
ENGINE = "stub"
_real = None

if os.environ.get("REAL_ENGINE", "0") == "1":
    try:
        from scoring import engine
        engine.load()          # warm the model at startup, not on first click
        _real = engine
        ENGINE = "wav2vec2"
        print("[engine] wav2vec2 loaded")
    except Exception as e:
        print(f"[engine] real engine unavailable ({e}) — staying on stub")

MAX_SECONDS = 4.0


@app.get("/api/health")
def health():
    return {"status": "ok", "engine": ENGINE}


def _run_scoring(raw: bytes, target_phoneme: str, target_text: str,
                 level: str, expected: list) -> dict:
    """Run the real engine if enabled, fall back to the stub on any failure
    or if it breaches the latency budget. Guarantees a contract-shaped result:
    both scorers build phonemes[] from `expected`, so len(phonemes) ==
    len(expected) holds on every return path."""
    started = time.time()
    result = None

    if _real is not None:
        try:
            result = _real.score(raw, target_phoneme, target_text, level, expected)
            elapsed = time.time() - started
            if elapsed > MAX_SECONDS:
                print(f"[engine] too slow ({elapsed:.2f}s) — using stub this time")
                result = None
        except Exception as e:
            print(f"[engine] failed: {e} — using stub")
            result = None

    if result is None:
        result = stub.score(raw, target_phoneme, target_text, level, expected)
        result["engine"] = "stub"
    else:
        result["engine"] = ENGINE

    print(f"[score] {level} '{target_text}' -> {result['overall_score']} "
          f"({result['engine']}) in {(time.time() - started) * 1000:.0f}ms")
    return result


@app.post("/api/score")
async def score(
    audio: UploadFile = File(...),
    target_phoneme: str = Form(...),
    target_text: str = Form(...),
    level: str = Form(...),
):
    raw = await audio.read()
    if not raw:
        raise HTTPException(status_code=400, detail="no audio received")

    target_phoneme = target_phoneme.strip().upper()
    if target_phoneme not in VALID_PHONEMES:
        raise HTTPException(status_code=422, detail=f"unknown phoneme: {target_phoneme}")

    if level not in ("sound", "word", "sentence"):
        raise HTTPException(status_code=422, detail=f"unknown level: {level}")

    expected = expected_phonemes(target_text, target_phoneme, level)

    try:
        result = _run_scoring(raw, target_phoneme, target_text, level, expected)
    except Exception:
        # _run_scoring already falls back to the stub internally; this is the
        # last-ditch guard so a user action can never produce a 500.
        raise HTTPException(status_code=500, detail="scoring failed")

    return result


@app.post("/api/score-file")
async def score_file(
    audio: UploadFile = File(...),
    target_phoneme: str = Form(...),
    target_text: str = Form(...),
    level: str = Form(...),
):
    """Backup path for the demo if the laptop microphone fails: same scoring,
    fed by an uploaded WAV instead of a live MediaRecorder blob."""
    return await score(audio, target_phoneme, target_text, level)
