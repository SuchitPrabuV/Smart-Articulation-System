# Pitch Outline — Slide Deck Structuring

This pitch deck is structured for a 5-minute presentation. It mirrors the timeline in `docs/demo-script.md`.

## Slide 1: The Gap in Speech Therapy
* **Visual**: Side-by-side: A child looking into a mirror in a clinic vs a child practicing alone at home with no guidance.
* **Talking Points**:
  * Clinical articulation training relies heavily on immediate therapist feedback.
  * Between weekly or bi-weekly appointments, learners practice alone without correction.
  * Incorrect home practice reinforces bad habits, stalling progress.

## Slide 2: Smart Articulation Training (SAT) System
* **Visual**: A high-level system diagram showing the React frontend (avatar + recorder) and python backend scoring system.
* **Talking Points**:
  * A digital therapy tool bridging the clinical gap.
  * Combines interactive 3D visual guidance with objective speech recognition.
  * Operates across three critical clinical levels: Sound, Word, and Sentence.

## Slide 3: Live Demonstration
* **Visual**: Live projection of the application interface (Warm paper theme, large monospace phoneme glyphs).
* **Steps**:
  * **Sound level**: Select target `S` (`/s/`). Show the 3D rig animation and alveolar tongue placement.
  * **Happy Path**: Record a clean `S`. Display the high-score (Teal feedback).
  * **Uncorrected Error**: Say `SH` deliberately. System flags substitution: *"tongue too far back, pull tip forward"*.
  * **Word level**: Practice "sun". Display per-phoneme color feedback (`S` -> red, `AH`/`N` -> teal).
  * **Sentence level**: Practice "The sun is hot".

## Slide 4: Clinical Realism & Constraints
* **Visual**: The look-alike confusion groups table from `contracts/phonemes.json` (e.g. `P/B/M`, `S/Z`, `K/G`).
* **Talking Points**:
  * Speech therapy is sequential (Sound -> Word -> Sentence). We respect this flow.
  * Words are categorized by phonetic target position: initial (`sun`), medial (`pencil`), and final (`bus`).
  * We solve the "outer mouth trap": `P`, `B`, and `M` look visually identical externally. Rather than faking 3D rigs, we explicitly label visual look-alikes.

## Slide 5: The Scoring Engine & Visual Rig
* **Visual**: End-to-end flow diagram: User Audio -> Backend FastAPI -> Phoneme alignment -> Viseme mapping.
* **Talking Points**:
  * **Frontend**: Captures audio and animates mouth shapes mapped from ARPAbet to visemes.
  * **Backend**: FastAPI endpoints that run phonemic recognition under 4 seconds or fall back to local stubs.
  * **Alignment**: Aligns expected vs heard phonemes to flag exactly where pronunciation drifted.

## Slide 6: Future Vision
* **Visual**: A mockup of the Clinician Dashboard.
* **Talking Points**:
  * Automated clinician dashboards to monitor weekly home compliance.
  * Multilingual clinical target mappings.
  * Adaptive learning paths matching child progress thresholds.
