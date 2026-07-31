"""Expected ARPAbet sequence for a prompt. Day 1: lookup + fallback.
Day 2: g2p_en."""

import re

VALID_PHONEMES = {
    "AA","AE","AH","AO","AW","AY","B","CH","D","DH","EH","ER","EY","F","G",
    "HH","IH","IY","JH","K","L","M","N","NG","OW","OY","P","R","S","SH","T",
    "TH","UH","UW","V","W","Y","Z","ZH",
}

# Day 1 lookup so the stub returns realistic sequences without any deps.
# Must match contracts/content.json exactly. Extend as content grows.
_LOOKUP = {
    "sun": ["S", "AH", "N"],
    "sock": ["S", "AA", "K"],
    "bus": ["B", "AH", "S"],
    "pencil": ["P", "EH", "N", "S", "AH", "L"],
    "rain": ["R", "EY", "N"],
    "red": ["R", "EH", "D"],
    "car": ["K", "AA", "R"],
    "carrot": ["K", "EH", "R", "AH", "T"],
    "thumb": ["TH", "AH", "M"],
    "think": ["TH", "IH", "NG", "K"],
    "bath": ["B", "AE", "TH"],
    "birthday": ["B", "ER", "TH", "D", "EY"],
    "the sun is hot.": ["DH","AH","S","AH","N","IH","Z","HH","AA","T"],
    "i see a bus.": ["AY","S","IY","AH","B","AH","S"],
    "the red car is fast.": ["DH","AH","R","EH","D","K","AA","R","IH","Z","F","AE","S","T"],
    "rain is coming.": ["R","EY","N","IH","Z","K","AH","M","IH","NG"],
    "i think it is thick.": ["AY","TH","IH","NG","K","IH","T","IH","Z","TH","IH","K"],
    "thank you for the bath.": ["TH","AE","NG","K","Y","UW","F","AO","R","DH","AH","B","AE","TH"],
}

_G2P = None


def _g2p_sequence(text: str):
    """Day 2 path. Imported lazily so Day 1 has no heavy deps."""
    global _G2P
    if _G2P is None:
        from g2p_en import G2p
        _G2P = G2p()
    out = []
    for p in _G2P(text):
        p = re.sub(r"\d", "", p).strip().upper()
        if p and p in VALID_PHONEMES:
            out.append(p)
    return out


def expected_phonemes(target_text: str, target_phoneme: str, level: str):
    if level == "sound":
        return [target_phoneme]

    key = target_text.strip().lower()
    if key in _LOOKUP:
        return _LOOKUP[key]

    try:
        seq = _g2p_sequence(target_text)
        if seq:
            return seq
    except Exception:
        pass

    return [target_phoneme]
