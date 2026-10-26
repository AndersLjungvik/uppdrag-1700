from pathlib import Path
import gzip, json, hashlib
root=Path(__file__).resolve().parent
data=json.loads(gzip.decompress((root/"chapter8-sourcepack.json.gz").read_bytes()))
out=root/"_chapter8_sources";out.mkdir(exist_ok=True)
for name,source in data["scripts"].items():
 path=out/name;path.parent.mkdir(parents=True,exist_ok=True);path.write_text(source)
print("Extracted",len(data["scripts"]),"files")
