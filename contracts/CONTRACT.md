# CONTRACT v1 — do not change without Suchit

## 3.1 Phoneme naming — ARPAbet, uppercase, no stress digits

The ONLY accepted phoneme representation across the whole system is
**uppercase ARPAbet**: `S`, `Z`, `SH`, `CH`, `JH`, `TH`, `DH`, `R`, `L`,
`K`, `G`, `F`, `V`, `AA`, `AE`, `AH`, `EH`, `IH`, `IY`, `OW`, `UW`, `N`, `M`,
`P`, `B`, `T`, `D`, `W`, `Y`, `NG`, `HH`, `ER`, `AO`, `AY`, `EY`, `OY`, `AW`,
`UH`, `ZH`.

- No stress digits. `AH0` is invalid, `AH` is valid.
- No IPA anywhere in code or JSON payloads. IPA appears **only** in the
  `ipa` display field of `phonemes.json`, for showing to the user.
- The backend converts its model's IPA output to ARPAbet before responding.
  The frontend never sees IPA from the API.

## 3.2 Backend base URL

Dev: `http://localhost:8000`
Frontend reads it from `import.meta.env.VITE_API_URL`, defaulting to that.

## 3.3 `GET /api/health`

Response 200:
```json
{ "status": "ok", "engine": "stub" }
```
`engine` is one of: `"stub"`, `"whisper"`, `"wav2vec2"`.

## 3.4 `POST /api/score`

Request — `multipart/form-data`:

| field | type | required | notes |
|---|---|---|---|
| `audio` | file | yes | webm/opus from MediaRecorder, or wav |
| `target_phoneme` | string | yes | ARPAbet, e.g. `"S"` |
| `target_text` | string | yes | what they were asked to say: `"S"`, `"sun"`, `"The sun is hot."` |
| `level` | string | yes | one of `"sound"`, `"word"`, `"sentence"` |

Response 200 — **this shape is frozen**:

```json
{
  "overall_score": 78,
  "verdict": "close",
  "target_phoneme": "S",
  "target_text": "sun",
  "expected": ["S", "AH", "N"],
  "heard": ["SH", "AH", "N"],
  "phonemes": [
    { "symbol": "S",  "score": 41, "status": "incorrect", "start_ms": 100, "end_ms": 290 },
    { "symbol": "AH", "score": 88, "status": "correct",   "start_ms": 290, "end_ms": 430 },
    { "symbol": "N",  "score": 91, "status": "correct",   "start_ms": 430, "end_ms": 610 }
  ],
  "tip": "Your tongue is too far back — it came out as SH. Pull the tip forward, just behind your top teeth.",
  "duration_ms": 780,
  "engine": "stub"
}
```

Field rules:
- `overall_score`: integer `0–100`.
- `verdict` and every `phonemes[].status`: exactly one of
  `"correct"` (score >= 75) · `"close"` (50–74) · `"incorrect"` (< 50).
- `expected` / `heard`: arrays of ARPAbet strings. `heard` may be empty if the
  engine could not decode; the frontend must handle `[]`.
- `phonemes[]`: always contains one entry per item in `expected`, in the same
  order. Never fewer, never more. `start_ms`/`end_ms` may be `null` if the
  engine has no timing — the frontend must handle `null`.
- `tip`: plain sentence, max 140 chars, never empty.
- Sound level: `expected` has exactly one entry.

Error responses:
```json
{ "detail": "no audio received" }        // 400
{ "detail": "unknown phoneme: XQ" }      // 422
{ "detail": "scoring failed" }           // 500
```
The frontend must show a retry state for any non-200. It must never crash.

## 3.5 Timing rule

The backend must respond in **under 4 seconds** for a 3-second clip. If the
real engine cannot, it falls back to the stub and returns `"engine": "stub"`.
A slow demo is a failed demo.

## 3.6 Contract test

`backend/tests/test_contract.py` must pass before any backend merge.
Shivani may run it too. It is the only arbiter of "is the API correct".
