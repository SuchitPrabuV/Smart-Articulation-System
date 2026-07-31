import json
import os

_HERE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
with open(os.path.join(_HERE, "contracts", "phonemes.json"), encoding="utf-8") as f:
    _P = json.load(f)

CUES = {k: v["cue"] for k, v in _P["phonemes"].items()}
CONFUSIONS = _P.get("confusions", {})

# What to say when a specific substitution happens. Keyed (target, heard).
SUBSTITUTION_TIPS = {
    ("S", "SH"):  "It came out as SH — your tongue is too far back. Pull the tip forward, just behind your top teeth.",
    ("S", "TH"):  "It came out as TH — your tongue is peeking through your teeth. Keep it behind them.",
    ("SH", "S"):  "It came out as S — pull your tongue back a little and round your lips.",
    ("TH", "F"):  "It came out as F — your lip is doing the work. Put your tongue tip between your teeth instead.",
    ("TH", "S"):  "It came out as S — your tongue stayed behind your teeth. Let the tip come through.",
    ("TH", "T"):  "It came out as T — your tongue is pressing too hard. Touch lightly and let the air flow.",
    ("R", "W"):   "It came out as W — your lips are rounding instead of your tongue moving. Keep your lips still and curl the tongue back.",
    ("R", "L"):   "It came out as L — your tongue tip is touching the roof. For R it must stay clear of it.",
    ("L", "W"):   "It came out as W — press your tongue tip to the ridge behind your top teeth.",
    ("L", "R"):   "It came out as R — your tongue needs to touch, not hover.",
    ("K", "T"):   "It came out as T — the front of your tongue moved. Lift the back of your tongue instead.",
    ("G", "D"):   "It came out as D — lift the back of your tongue, not the tip.",
    ("F", "TH"):  "It came out as TH — rest your top teeth on your bottom lip.",
    ("CH", "SH"): "It came out as SH — start with your tongue touching, then release. Make it one quick burst.",
    ("Z", "S"):   "Close — switch your voice on. Put a finger on your throat and feel the buzz.",
    ("DH", "D"):  "It came out as D — let your tongue slide between your teeth instead of tapping.",
}


def tip_for(target: str, phonemes: list, heard: list, expected: list) -> str:
    """Priority: named substitution on the target > target weak > other sound
    weak > success."""
    target_entries = [
        (i, p) for i, p in enumerate(phonemes) if p["symbol"] == target
    ]

    # A deletion (the engine heard nothing at this slot) is marked "-" / "" in
    # `heard`. That is not a substitution, so never name it as the heard sound —
    # fall through to the target's cue ("here is how to make an S").
    _DELETION = {"-", "", None}

    for i, p in target_entries:
        if p["status"] == "incorrect":
            got = heard[i] if i < len(heard) else None
            if got and got not in _DELETION and got != target:
                specific = SUBSTITUTION_TIPS.get((target, got))
                if specific:
                    return specific
                return f"That came out closer to {got} than {target}. {CUES.get(target, '')}".strip()
            return CUES.get(target, f"Try {target} again, more slowly.")

    for i, p in target_entries:
        if p["status"] == "close":
            return f"Nearly there on {target}. {CUES.get(target, '')} Hold it a little longer.".strip()

    weak = [p for p in phonemes if p["status"] == "incorrect" and p["symbol"] != target]
    if weak:
        s = weak[0]["symbol"]
        return f"Your {target} was good. The {s} sound slipped — say the whole word a little slower."

    return f"Clean {target}. Try the next one at normal speed."
