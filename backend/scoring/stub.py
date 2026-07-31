import random

from .feedback import tip_for


def _status(score: int) -> str:
    if score >= 75:
        return "correct"
    if score >= 50:
        return "close"
    return "incorrect"


def score(raw_audio: bytes, target_phoneme: str, target_text: str,
          level: str, expected: list) -> dict:
    """Deterministic-ish fake scoring. Longer audio scores slightly better,
    so the UI behaves plausibly during development."""
    rng = random.Random(len(raw_audio) ^ hash(target_text))

    # crude proxy for "did they actually say something"
    length_bonus = min(20, len(raw_audio) // 4000)

    phonemes = []
    t = 0
    for sym in expected:
        base = rng.randint(45, 92)
        # the target sound is the one that varies most — makes demos readable
        s = base if sym != target_phoneme else max(20, min(99, base + rng.randint(-25, 8)))
        s = max(0, min(100, s + length_bonus - 10))
        dur = 90 + rng.randint(40, 160)
        phonemes.append({
            "symbol": sym,
            "score": s,
            "status": _status(s),
            "start_ms": t,
            "end_ms": t + dur,
        })
        t += dur

    overall = round(sum(p["score"] for p in phonemes) / len(phonemes))

    heard = []
    for p in phonemes:
        heard.append(p["symbol"] if p["status"] != "incorrect"
                     else _substitute(p["symbol"]))

    return {
        "overall_score": overall,
        "verdict": _status(overall),
        "target_phoneme": target_phoneme,
        "target_text": target_text,
        "expected": list(expected),
        "heard": heard,
        "phonemes": phonemes,
        "tip": tip_for(target_phoneme, phonemes, heard, expected),
        "duration_ms": t,
    }


_SUBS = {"S": "SH", "SH": "S", "TH": "F", "R": "W", "L": "W",
         "K": "T", "G": "D", "F": "TH", "CH": "SH", "JH": "D",
         "Z": "S", "DH": "D"}


def _substitute(sym: str) -> str:
    return _SUBS.get(sym, sym)
