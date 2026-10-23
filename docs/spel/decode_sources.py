"""Decode the frozen integration inputs for local inspection. Python 3 only.
Run in a checkout: python docs/spel/decode_sources.py
Output is diagnostic source, not an alternative finished distribution.
"""
from pathlib import Path
import gzip
import hashlib
import json

root = Path(__file__).resolve().parent
packed = b''.join((root / f'delta-{i}.bin').read_bytes() for i in range(1, 5))
assert hashlib.sha256(packed).hexdigest() == 'ad272c757bf30bd6b8abc9b6f4270deb162d99ddf22bf55c5a0c611b5f0761c9', 'Delta checksum mismatch'
data = json.loads(gzip.decompress(packed))
out = root / '_decoded'
out.mkdir(exist_ok=True)
for path in (root / 'base').iterdir():
    if not path.is_file() or path.suffix not in ('.js', '.mjs', '.html', '.css'):
        continue
    text = path.read_text(encoding='utf-8')
    patch = data['patches'].get(path.name)
    if patch:
        assert hashlib.sha256(text.encode()).hexdigest() == patch['before'], path.name
        for start, end, replacement in reversed(patch['edits']):
            text = text[:start] + replacement + text[end:]
        assert hashlib.sha256(text.encode()).hexdigest() == patch['after'], path.name
    (out / path.name).write_text(text, encoding='utf-8')
for name, text in data['extra'].items():
    assert Path(name).name == name
    (out / name).write_text(text, encoding='utf-8')
questions = json.loads(gzip.decompress((root / 'questions/snapshot.json.gz').read_bytes()))
for name, text in questions['scripts'].items():
    assert Path(name).name == name
    (out / name).write_text(text, encoding='utf-8')
print(f'Wrote inspectable sources to {out}. See integration.js for final load order and scope fixes.')
