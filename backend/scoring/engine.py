import io
import json
import time

import numpy as np
import librosa
import torch
from transformers import AutoProcessor, AutoModelForCTC, Wav2Vec2FeatureExtractor

from .ipa_arpabet import ipa_to_arpabet
from .feedback import tip_for

MODEL_ID = "facebook/wav2vec2-lv-60-espeak-cv-ft"
SR = 16000

_feature_extractor = None
_id2tok = None
_model = None


def _load_vocab():
    """id -> token map, read straight from the model's vocab.json. Avoids the
    phoneme tokenizer, which requires the espeak-ng system binary."""
    from huggingface_hub import hf_hub_download
    with open(hf_hub_download(MODEL_ID, "vocab.json"), encoding="utf-8") as f:
        vocab = json.load(f)
    return {idx: tok for tok, idx in vocab.items()}


def load():
    """Call once at startup — never on the first request, or your demo has a
    30-second first click.

    NOTE: this model's HF tokenizer (Wav2Vec2PhonemeCTCTokenizer) initialises an
    espeak backend and will not construct unless the espeak-ng SYSTEM binary is
    installed. We only need id->token to decode, so we prefer the full processor
    when espeak-ng is present and fall back to the feature-extractor + vocab.json
    otherwise. Either way the acoustic model and decode path are identical."""
    global _feature_extractor, _id2tok, _model
    if _model is None:
        _model = AutoModelForCTC.from_pretrained(MODEL_ID).eval()
        try:
            proc = AutoProcessor.from_pretrained(MODEL_ID)   # needs espeak-ng
            _feature_extractor = proc.feature_extractor
        except Exception as e:
            print(f"[engine] phoneme tokenizer unavailable ({e.__class__.__name__}: "
                  f"espeak-ng system binary missing) — using espeak-free decode "
                  f"(feature-extractor + vocab.json)")
            _feature_extractor = Wav2Vec2FeatureExtractor.from_pretrained(MODEL_ID)
        _id2tok = _load_vocab()
        _warmup()
    return _feature_extractor, _model


def _warmup():
    """Run the full decode+inference path once on silence so the FIRST real
    request is not the one that pays librosa/numba JIT and torch graph warmup
    (measured >30s cold vs ~2s warm). Loading the model at startup is not enough
    on its own — the audio and inference paths JIT-compile lazily too."""
    try:
        import soundfile as sf
        buf = io.BytesIO()
        sf.write(buf, np.zeros(int(SR * 0.3), dtype=np.float32), SR, format="WAV")
        _decode_audio(buf.getvalue())                       # warms librosa/numba
        _recognise(np.zeros(int(SR * 0.3), dtype=np.float32))  # warms torch graph
        print("[engine] warmup complete (decode + inference paths JIT-compiled)")
    except Exception as e:
        print(f"[engine] warmup skipped ({e.__class__.__name__}: {e})")


def _decode_audio(raw: bytes):
    y, _ = librosa.load(io.BytesIO(raw), sr=SR, mono=True)
    return y


def _status(s: int) -> str:
    return "correct" if s >= 75 else "close" if s >= 50 else "incorrect"


def _recognise(y):
    """Returns (arpabet_sequence, per_symbol_confidence, frame_ms)."""
    fe, model = load()
    inputs = fe(y, sampling_rate=SR, return_tensors="pt", padding=True)
    with torch.no_grad():
        logits = model(inputs.input_values).logits[0]      # (T, V)
    probs = torch.softmax(logits, dim=-1)
    ids = torch.argmax(probs, dim=-1)

    blank = model.config.pad_token_id

    seq, confs, prev = [], [], None
    for t, tid in enumerate(ids.tolist()):
        if tid != blank and tid != prev:
            tok = _id2tok.get(tid, "")
            arpa = ipa_to_arpabet(tok)
            for a in arpa:
                seq.append(a)
                confs.append(float(probs[t, tid]))
        prev = tid

    frame_ms = (len(y) / SR * 1000) / max(1, probs.shape[0])
    return seq, confs, frame_ms


def _align(expected, heard):
    """Levenshtein alignment. Returns list of (exp_sym, heard_sym_or_None)."""
    n, m = len(expected), len(heard)
    d = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(n + 1):
        d[i][0] = i
    for j in range(m + 1):
        d[0][j] = j
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            cost = 0 if expected[i - 1] == heard[j - 1] else 1
            d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)

    pairs, i, j = [], n, m
    while i > 0:
        if j > 0 and d[i][j] == d[i - 1][j - 1] + (0 if expected[i - 1] == heard[j - 1] else 1):
            pairs.append((expected[i - 1], heard[j - 1]))
            i, j = i - 1, j - 1
        elif d[i][j] == d[i - 1][j] + 1:
            pairs.append((expected[i - 1], None))
            i -= 1
        else:
            j -= 1
    pairs.reverse()
    return pairs


def score(raw: bytes, target_phoneme: str, target_text: str,
          level: str, expected: list) -> dict:
    y = _decode_audio(raw)
    duration_ms = int(len(y) / SR * 1000)

    if duration_ms < 200:
        raise ValueError("clip too short")

    heard_seq, confs, frame_ms = _recognise(y)
    pairs = _align(expected, heard_seq)

    phonemes, heard_out = [], []
    step = max(1, duration_ms // max(1, len(expected)))
    t = 0
    ci = 0
    for exp_sym, got in pairs:
        if got is None:
            s = 15                                  # not detected at all
        elif got == exp_sym:
            conf = confs[ci] if ci < len(confs) else 0.7
            s = int(60 + 40 * min(1.0, conf))       # 60..100
        else:
            s = 35                                  # substituted
        s = max(0, min(100, s))
        phonemes.append({
            "symbol": exp_sym,
            "score": s,
            "status": _status(s),
            "start_ms": t,
            "end_ms": t + step,
        })
        heard_out.append(got if got else "-")
        t += step
        if got is not None:
            ci += 1

    overall = round(sum(p["score"] for p in phonemes) / len(phonemes))

    return {
        "overall_score": overall,
        "verdict": _status(overall),
        "target_phoneme": target_phoneme,
        "target_text": target_text,
        "expected": list(expected),
        "heard": heard_out,
        "phonemes": phonemes,
        "tip": tip_for(target_phoneme, phonemes, heard_out, expected),
        "duration_ms": duration_ms,
    }
