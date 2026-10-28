"""Unpack the readable chapter-7 sources; no dependencies beyond Python 3.
Run from a checkout: python docs/spel/decode_chapter7_sources.py
Regenerate the package after editing using the same JSON shape and gzip mtime=0.
"""
import gzip
import hashlib
import json
from pathlib import Path

root = Path(__file__).resolve().parent
raw = (root / "chapter7-sourcepack.json.gz").read_bytes()
expected = "678be96d10e0f13292466bb544785757ceb1dbef4e3b3ec308a397e69bbe13c6"
if hashlib.sha256(raw).hexdigest() != expected:
    raise ValueError("Chapter 7 source-pack checksum mismatch")
pack = json.loads(gzip.decompress(raw))
if pack["version"] != "1.3.0":
    raise ValueError("Unexpected chapter version")
for name, contents in pack["scripts"].items():
    destination = (root / name).resolve()
    if not destination.is_relative_to(root) or destination.suffix not in {".js", ".cjs"}:
        raise ValueError("Invalid source path: " + name)
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(contents, encoding="utf-8")
print("Unpacked", len(pack["scripts"]), "editable files in", root)