from pathlib import Path
import gzip,json
root=Path(__file__).resolve().parent
pack=json.loads(gzip.decompress(b''.join((root/f'finale-pack-{i}.bin').read_bytes() for i in (1,2,3,4,5))))
out=root/'_finale';out.mkdir(exist_ok=True)
for name,text in pack['scripts'].items():
    if Path(name).name != name: raise ValueError('Invalid source path')
    (out/name).write_text(text,encoding='utf-8')
(out/'finale-data.json').write_text(json.dumps(pack['data'],ensure_ascii=False,indent=2),encoding='utf-8')
print('Decoded readable final-chapter sources to',out)
