import io
import json

from fastapi.testclient import TestClient

import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import app  # noqa: E402

client = TestClient(app)

STATUSES = {"correct", "close", "incorrect"}
FAKE = io.BytesIO(b"\x00" * 20000)


def post(text="sun", phoneme="S", level="word"):
    FAKE.seek(0)
    return client.post(
        "/api/score",
        files={"audio": ("a.webm", FAKE, "audio/webm")},
        data={"target_phoneme": phoneme, "target_text": text, "level": level},
    )


def test_health():
    r = client.get("/api/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"
    assert r.json()["engine"] in {"stub", "whisper", "wav2vec2"}


def test_score_shape():
    r = post()
    assert r.status_code == 200
    d = r.json()

    assert isinstance(d["overall_score"], int) and 0 <= d["overall_score"] <= 100
    assert d["verdict"] in STATUSES
    assert d["target_phoneme"] == "S"
    assert d["target_text"] == "sun"
    assert isinstance(d["expected"], list) and len(d["expected"]) > 0
    assert isinstance(d["heard"], list)
    assert isinstance(d["tip"], str) and 0 < len(d["tip"]) <= 140
    assert d["engine"] in {"stub", "whisper", "wav2vec2"}

    # one phoneme entry per expected symbol, same order
    assert len(d["phonemes"]) == len(d["expected"])
    for p, sym in zip(d["phonemes"], d["expected"]):
        assert p["symbol"] == sym
        assert isinstance(p["score"], int) and 0 <= p["score"] <= 100
        assert p["status"] in STATUSES
        assert p["start_ms"] is None or isinstance(p["start_ms"], int)
        assert p["end_ms"] is None or isinstance(p["end_ms"], int)


def test_sound_level_single_phoneme():
    d = post(text="S", phoneme="S", level="sound").json()
    assert d["expected"] == ["S"]
    assert len(d["phonemes"]) == 1


def test_no_audio():
    r = client.post(
        "/api/score",
        files={"audio": ("a.webm", io.BytesIO(b""), "audio/webm")},
        data={"target_phoneme": "S", "target_text": "sun", "level": "word"},
    )
    assert r.status_code == 400


def test_bad_phoneme():
    assert post(phoneme="XQ").status_code == 422


def test_bad_level():
    assert post(level="paragraph").status_code == 422
