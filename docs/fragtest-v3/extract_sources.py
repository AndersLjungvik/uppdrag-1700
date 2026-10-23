"""Extract the unmodified 21 October 2026 question sources for review and tests."""
from pathlib import Path
import gzip
import hashlib
import json

root = Path(__file__).resolve().parent
raw = (root / 'snapshot.json.gz').read_bytes()
expected = 'fb3b210dc0a9f6c82160eb85dd27ecb5496bf5f13e7af8d0a9b330a2c1c6ae11'
if hashlib.sha256(raw).hexdigest() != expected:
    raise ValueError('Snapshot checksum mismatch')
data = json.loads(gzip.decompress(raw))
out = root / 'src'
out.mkdir(exist_ok=True)
for name in ('recall-bank.js', 'recall-assessment.js', 'recall-flow.js'):
    (out / name).write_text(data['scripts'][name], encoding='utf-8')
print('Extracted 3 original source files. Run: node tests/regression.cjs')
