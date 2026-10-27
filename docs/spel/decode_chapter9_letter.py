"""Extract inspectable chapter-nine story sources without overwriting older files."""
from pathlib import Path
import gzip
import hashlib
import json

root = Path(__file__).resolve().parent
raw = b''.join((root / f'chapter9-letter-pack-{i}.bin').read_bytes() for i in range(1, 4))
expected = '2f95dd26b2de95b1f10208b3293ca00fa7eefd10858257db9d6b59f134a0464e'
if hashlib.sha256(raw).hexdigest() != expected:
    raise ValueError('Chapter 9 letter pack checksum mismatch')
pack = json.loads(gzip.decompress(raw))
if pack.get('version') != '1.7.0':
    raise ValueError('Unexpected source version')
out = root / '_chapter9_letter'
out.mkdir(exist_ok=True)
for name in ('chapter9-letter-build.js', 'chapter9-letter-world.js'):
    (out / name).write_text(pack['scripts'][name], encoding='utf-8')
print(f'Wrote two readable source files to {out}')
