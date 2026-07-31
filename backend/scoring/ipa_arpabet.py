"""IPA (espeak-style) -> ARPAbet. Longest match first."""

IPA_TO_ARPA = [
    ("tʃ", "CH"), ("dʒ", "JH"), ("aʊ", "AW"), ("aɪ", "AY"), ("eɪ", "EY"),
    ("oʊ", "OW"), ("ɔɪ", "OY"), ("əʊ", "OW"), ("ɪə", "IH"), ("eə", "EH"),
    ("ʃ", "SH"), ("ʒ", "ZH"), ("θ", "TH"), ("ð", "DH"), ("ŋ", "NG"),
    ("ɹ", "R"), ("ɻ", "R"), ("r", "R"), ("ɾ", "T"),
    ("j", "Y"), ("w", "W"), ("h", "HH"),
    ("ɑ", "AA"), ("ɒ", "AA"), ("æ", "AE"), ("ʌ", "AH"), ("ə", "AH"),
    ("ɐ", "AH"),                                          # near-open central
    ("ɔ", "AO"), ("ɛ", "EH"), ("ɜ", "ER"), ("ɝ", "ER"), ("ɚ", "ER"),
    ("ɪ", "IH"), ("ᵻ", "IH"),                            # reduced barred-i
    ("i", "IY"), ("ʊ", "UH"), ("u", "UW"), ("o", "OW"),
    ("e", "EH"), ("a", "AA"),
    ("p", "P"), ("b", "B"), ("t", "T"), ("d", "D"), ("k", "K"), ("g", "G"),
    ("ɡ", "G"), ("f", "F"), ("v", "V"), ("s", "S"), ("z", "Z"),
    ("m", "M"), ("n", "N"), ("l", "L"), ("ɫ", "L"),      # ɫ = dark/velarized L
]

# Deliberately NOT mapped (reported, not silently dropped): the model is
# multilingual, so its vocabulary carries ~70 non-English phonemes — tones
# (i5, a2, ...), retroflexes (ʈ ɖ ʂ ʐ ɳ ɽ), uvulars (ʁ χ ʕ), front-rounded
# vowels (y ø œ), nasalized vowels (ɐ̃ ã õ), and espeak markers (S N X ??).
# These will not occur in an English speaker's production of the target words;
# if one ever appears it is skipped, which is the correct behaviour. The glottal
# stop ʔ and palatal ç are also left unmapped: they are ambiguous in English
# (ʔ is usually a T allophone) and mapping them risks phantom phonemes.

_IGNORE = set("ˈˌːː'ˑ ")


def ipa_to_arpabet(ipa: str):
    out, i = [], 0
    while i < len(ipa):
        ch = ipa[i]
        if ch in _IGNORE:
            i += 1
            continue
        for pat, arpa in IPA_TO_ARPA:
            if ipa.startswith(pat, i):
                out.append(arpa)
                i += len(pat)
                break
        else:
            i += 1
    return out
