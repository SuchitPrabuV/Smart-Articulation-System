"""Calibration harness for the real engine.

Records are NOT measured by the agent — this script exists so a human can run
it on their own recordings before the presentation and get real numbers.

Naming convention (place WAV files in a directory, default ./calib_clips):
    s_correct_01.wav   -> a good, correct production of the target sound
    s_sub_sh_01.wav    -> a deliberate substitution (said SH instead of S)

Filename grammar:  <target>_<correct|sub_<heard>>_<nn>.wav
  - <target>  : ARPAbet target phoneme, lowercased (s, sh, th, r, ...)
  - correct   : a correct production
  - sub_<x>   : a deliberate substitution, <x> is the phoneme actually said

For each clip we score at SOUND level against the target phoneme, then print:
  - the overall score of every clip, grouped correct vs substitution
  - the mean of each group
  - the min correct / max substitution -> the OVERLAP between the two groups

A clean separation (max-substitution < min-correct) is what lets you tell the
judges "correct productions averaged X, substitutions averaged Y, no overlap".

Usage:
    REAL_ENGINE is not needed here; this imports the engine directly.
    python calibrate.py [clips_dir]
"""

import os
import re
import sys
import statistics

from scoring import engine

_NAME = re.compile(r"^(?P<target>[a-z]+)_(?P<kind>correct|sub_[a-z]+)_\d+\.wav$", re.I)


def _parse(fname: str):
    m = _NAME.match(fname)
    if not m:
        return None
    target = m.group("target").upper()
    kind = m.group("kind").lower()
    group = "correct" if kind == "correct" else "substitution"
    heard = None if group == "correct" else kind.split("_", 1)[1].upper()
    return target, group, heard


def main(clips_dir: str):
    if not os.path.isdir(clips_dir):
        print(f"No clips directory at {clips_dir!r}.")
        print("Create it and drop WAVs named like s_correct_01.wav, "
              "s_sub_sh_01.wav, then re-run.")
        print("\n*** HARNESS IS READY — NO NUMBERS MEASURED YET. ***")
        return

    wavs = sorted(f for f in os.listdir(clips_dir) if f.lower().endswith(".wav"))
    if not wavs:
        print(f"{clips_dir} has no .wav files. Nothing to calibrate.")
        print("\n*** HARNESS IS READY — NO NUMBERS MEASURED YET. ***")
        return

    print("Loading model (first time may take a while)...")
    engine.load()

    rows = []
    for fname in wavs:
        parsed = _parse(fname)
        if not parsed:
            print(f"  skip (bad name): {fname}")
            continue
        target, group, heard = parsed
        with open(os.path.join(clips_dir, fname), "rb") as fh:
            raw = fh.read()
        try:
            result = engine.score(raw, target, target, "sound", [target])
            score = result["overall_score"]
            got = result["heard"][0] if result["heard"] else "-"
        except Exception as e:
            print(f"  error scoring {fname}: {e}")
            continue
        rows.append((fname, target, group, heard, score, got))

    if not rows:
        print("No scoreable clips.")
        return

    print("\n{:<24} {:<7} {:<12} {:>6} {:>7}".format(
        "file", "target", "group", "score", "heard"))
    print("-" * 60)
    for fname, target, group, heard, score, got in rows:
        print("{:<24} {:<7} {:<12} {:>6} {:>7}".format(
            fname, target, group, score, got))

    correct = [r[4] for r in rows if r[2] == "correct"]
    subs = [r[4] for r in rows if r[2] == "substitution"]

    print("\n=== SUMMARY ===")
    print(f"  correct clips      : n={len(correct)}")
    if correct:
        print(f"    mean score       : {statistics.mean(correct):.1f}")
        print(f"    min score        : {min(correct)}")
    print(f"  substitution clips : n={len(subs)}")
    if subs:
        print(f"    mean score       : {statistics.mean(subs):.1f}")
        print(f"    max score        : {max(subs)}")

    if correct and subs:
        overlap = max(subs) - min(correct)
        if overlap < 0:
            print(f"\n  CLEAN SEPARATION: max substitution ({max(subs)}) "
                  f"< min correct ({min(correct)}).")
        else:
            print(f"\n  OVERLAP of {overlap} points: some substitutions scored "
                  f"as high as correct productions.")
            print("  Adjust the constants in engine.score() (60+40*conf, 35, 15) "
                  "to widen the gap.")

    print("\nWrite these two means into the build log and the slide deck.")


if __name__ == "__main__":
    clips = sys.argv[1] if len(sys.argv) > 1 else os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "calib_clips")
    main(clips)
