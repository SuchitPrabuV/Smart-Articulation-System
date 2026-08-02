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
    # T
    "toy": ["T", "OY"],
    "turtle": ["T", "ER", "T", "AH", "L"],
    "cat": ["K", "AE", "T"],
    "water": ["W", "AO", "T", "ER"],
    "the cat sees a turtle.": ["DH","AH","K","AE","T","S","IY","Z","AH","T","ER","T","AH","L"],
    "take the toy.": ["T","EY","K","DH","AH","T","OY"],
    # D
    "dog": ["D", "AO", "G"],
    "duck": ["D", "AH", "K"],
    "bed": ["B", "EH", "D"],
    "ladder": ["L", "AE", "D", "ER"],
    "the dog and duck play.": ["DH","AH","D","AO","G","AH","N","D","D","AH","K","P","L","EY"],
    "dad is in bed.": ["D","AE","D","IH","Z","IH","N","B","EH","D"],
    # K
    "key": ["K", "IY"],
    "cake": ["K", "EY", "K"],
    "book": ["B", "UH", "K"],
    "monkey": ["M", "AH", "NG", "K", "IY"],
    "i like the cake.": ["AY","L","AY","K","DH","AH","K","EY","K"],
    "the monkey has a key.": ["DH","AH","M","AH","NG","K","IY","HH","AE","Z","AH","K","IY"],
    # G
    "goat": ["G", "OW", "T"],
    "girl": ["G", "ER", "L"],
    "wagon": ["W", "AE", "G", "AH", "N"],
    "the goat is big.": ["DH","AH","G","OW","T","IH","Z","B","IH","G"],
    "the girl has a dog.": ["DH","AH","G","ER","L","HH","AE","Z","AH","D","AO","G"],
    # M
    "mouse": ["M", "AW", "S"],
    "moon": ["M", "UW", "N"],
    "mom": ["M", "AA", "M"],
    "camel": ["K", "AE", "M", "AH", "L"],
    "the mouse is small.": ["DH","AH","M","AW","S","IH","Z","S","M","AO","L"],
    "look at the moon.": ["L","UH","K","AE","T","DH","AH","M","UW","N"],
    # F
    "fish": ["F", "IH", "SH"],
    "foot": ["F", "UH", "T"],
    "leaf": ["L", "IY", "F"],
    "coffee": ["K", "AA", "F", "IY"],
    "i see a fish.": ["AY","S","IY","AH","F","IH","SH"],
    "my foot hurts.": ["M","AY","F","UH","T","HH","ER","T","S"],
    # L
    "lion": ["L", "AY", "AH", "N"],
    "ball": ["B", "AO", "L"],
    "balloon": ["B", "AH", "L", "UW", "N"],
    "the lion roars.": ["DH","AH","L","AY","AH","N","R","AO","R","Z"],
    "throw the ball.": ["TH","R","OW","DH","AH","B","AO","L"],
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
