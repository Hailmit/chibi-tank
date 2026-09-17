"""Create the reviewable source listing and a self-contained static-site ZIP."""
from pathlib import Path
import hashlib
import json
import zipfile

root = Path(__file__).resolve().parents[1]
top = ['index.html', 'style.css', 'favicon.svg', '.nojekyll', '.gitignore', 'package.json', 'README.md', 'TESTING.md']
files = [root / name for name in top]
for directory in ['src', 'vendor', 'tests', 'tools']:
    files.extend(p for p in sorted((root / directory).rglob('*')) if p.is_file() and '__pycache__' not in p.parts)
language = {'.js':'javascript','.html':'html','.css':'css','.svg':'xml','.json':'json','.py':'python','.md':'markdown'}
listing = ['# Mã nguồn CHIBI TANK CITY: ENDLESS\n', 'Toàn bộ mã nguồn tự viết, theo đường dẫn. Bản Three.js 0.170.0 nguyên gốc và giấy phép nằm tại `vendor/` trong ZIP; không lặp thư viện minify trong tài liệu này.\n']
for p in files:
    if 'vendor' in p.relative_to(root).parts or 'results' in p.relative_to(root).parts:
        continue
    fence = '````' if p.suffix == '.md' else '```'
    listing.append('\n## '+p.relative_to(root).as_posix()+'\n\n'+fence+language.get(p.suffix,'text')+'\n'+p.read_text(encoding='utf-8').rstrip()+'\n'+fence+'\n')
(root / 'SOURCE.md').write_text('\n'.join(listing),encoding='utf-8')
files.append(root / 'SOURCE.md')
manifest = {p.relative_to(root).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in files}
(root / 'MANIFEST.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
files.append(root / 'MANIFEST.json')
destination = root / 'chibi-tank-city-endless.zip'
with zipfile.ZipFile(destination, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
    for p in files:
        archive.write(p, 'chibi-tank-city/'+p.relative_to(root).as_posix())
with zipfile.ZipFile(destination) as archive:
    assert archive.testzip() is None
    assert 'chibi-tank-city/vendor/three.module.min.js' in archive.namelist()
print(json.dumps({'archive':str(destination),'files':len(files),'bytes':destination.stat().st_size,'sha256':hashlib.sha256(destination.read_bytes()).hexdigest()}))
