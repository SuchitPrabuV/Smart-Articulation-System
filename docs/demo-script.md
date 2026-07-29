# Demo Script — 5-Minute Pitch

## 0:00–0:30 · PROBLEM
Articulation therapy depends on a clinician's verbal cue and a mirror. Between sessions the learner practises alone, with no feedback and nothing to look at. Progress stalls in the gap between appointments.

## 0:30–1:00 · WHAT WE BUILT
A therapy tool that shows the learner what the mouth should do, listens to what they actually said, and tells them what to change — at sound, word and sentence level.

## 1:00–3:15 · LIVE DEMO (Shivani drives)
1. **Home**: Pick the `S` sound.
2. **Sound level**: Big `S` glyph, IPA beside it, the clinical cue text. Play the animation — the avatar produces S. Point at the tongue position.
3. **Record**: Say a clean `S`. Score comes back high, teal.
4. **Record again**: Say `SH` deliberately. Score drops, and the tip names the error: *"Your tongue is too far back — it came out as SH. Pull the tip forward, just behind your top teeth."*
   *** This is the moment. Pause here. ***
5. **Word level**: Move to "sun". Per-phoneme breakdown appears: `S` red, `AH` and `N` teal. Say the word right, all three go teal.
6. **Sentence level**: Move to "The sun is hot." Show the same breakdown at scale.
7. **Progress**: Attempts over the session.

## 3:15–4:15 · WHY IT IS CLINICALLY REAL (Suchit)
* Structured on the standard sound → word → sentence hierarchy, and words are tagged initial / medial / final position, which is how therapy is actually sequenced.
* We handle the thing visual-only tools get wrong: `P`, `B` and `M` are visually identical from outside the mouth, as are `S`/`Z` and `K`/`G`. We label those explicitly instead of pretending the animation distinguishes them.
* Feedback is targeted at the confusion the learner actually made, not a generic score.

## 4:15–4:45 · HOW (Sukirthan 20s, Tanisha 20s)
Phoneme-level recognition, aligned against the expected sequence, scored per phoneme. Rigged avatar driven by an ARPAbet → viseme map.

## 4:45–5:00 · WHAT IS NEXT
Clinician dashboard, more languages, per-learner progression over weeks.

---

### Judges Q&A Cheat Sheet

| Question | Answer |
|---|---|
| **How accurate is your scoring?** | Give the real number from your own testing. Do not inflate it. Say what it is good at (detecting substitutions on the target sound) and what it is not (fine-grained distortion). Judges trust honest limits. |
| **Did you train a model?** | No — we used an existing phoneme recogniser and built the clinical layer on top. That is the correct engineering decision in four days, say it confidently. |
| **Is this validated with real clinicians?** | No. Say so. Then say what validation would look like: N clinicians, pre/post accuracy on a target sound over 4 weeks. |
| **Why should a therapist use this?** | Between-session practice with objective feedback, and a structured hierarchy they already use. |
