"""Genera el informe PDF sin dependencias externas desde integracion-sentry.md."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent
W, H = 595.28, 841.89
MARGIN = 48
WIDTH = W - 2 * MARGIN
pages = []
commands = []
y = 0

# Anchos de Helvetica en milésimas de em; suficientes para composición y ajuste.
widths = dict(zip('abcdefghijklmnopqrstuvwxyz', [556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,556,556,333,500,278,556,500,722,500,500,500]))
widths.update(dict(zip('ABCDEFGHIJKLMNOPQRSTUVWXYZ', [667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611])))
widths.update({c:556 for c in '0123456789'})
widths.update({' ':278,'.':278,',':278,':':278,';':278,'/':278,'-':333,'(':333,')':333,'[':278,']':278,'=':584,'_':556,'?':556,'!':278,'"':355,"'":191})
for a,b in zip('áéíóúüñÁÉÍÓÚÜÑ', 'aeiouunAEIOUUN'): widths[a]=widths[b]

def width(text, size, bold=False):
    return sum(widths.get(c, 556) for c in text) * size / 1000 * (1.06 if bold else 1)

def literal(s):
    return s.replace('\\','\\\\').replace('(','\\(').replace(')','\\)')

def draw(text, x, top, size=10, font='F1', color='0.16 0.20 0.27'):
    commands.append(f'BT /{font} {size} Tf {color} rg 1 0 0 1 {x:.2f} {top:.2f} Tm ({literal(text)}) Tj ET')

def page():
    global commands,y
    if commands: pages.append(commands)
    commands=[]
    commands.append('0.36 0.24 0.72 rg 48 790 34 4 re f')
    draw('PROJECTFLOW  /  DOCUMENTACIÓN TÉCNICA', 94, 789, 8, 'F2', '0.36 0.24 0.72')
    y=750

def wrap(text,size,bold=False):
    words=text.split(); result=[]; line=''
    for word in words:
        if width((line+' '+word).strip(),size,bold)>WIDTH:
            if line: result.append(line); line=''
            while width(word,size,bold)>WIDTH:
                cut=len(word)-1
                while width(word[:cut],size,bold)>WIDTH: cut-=1
                result.append(word[:cut]);word=word[cut:]
        line=(line+' '+word).strip()
    if line: result.append(line)
    return result

page()
source=(ROOT/'integracion-sentry.md').read_text()
source = re.sub(r'(^##? [^\n]+)\n', r'\1\n\n', source, flags=re.M)
source = source.replace('---PAGE---', '\n\n---PAGE---\n\n')
for block in source.split('\n\n'):
    block=block.strip()
    if not block: continue
    if block=='---PAGE---': page();continue
    # La portada contiene dos títulos consecutivos sin párrafo entre ellos.
    blocks=block.split('\n') if block.startswith('#') else [block]
    for part in blocks:
        if part.startswith('# '): size,font,gap,color=22,'F2',16,'0.16 0.12 0.32';text=part[2:]
        elif part.startswith('## '): size,font,gap,color=12,'F2',8,'0.36 0.24 0.72';text=part[3:]
        else: size,font,gap,color=10,'F1',10,'0.16 0.20 0.27';text=part
        lines=wrap(text,size,font=='F2');leading=size*1.45
        if y-len(lines)*leading < 65: page()
        for line in lines:
            draw(line,MARGIN,y,size,font,color);y-=leading
        y-=gap
if commands:pages.append(commands)

objects=[]
def obj(data):
    objects.append(data if isinstance(data,bytes) else data.encode('cp1252',errors='replace'))
    return len(objects)
obj('<< /Type /Catalog /Pages 2 0 R >>')
obj('')
f1=obj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>')
f2=obj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>')
refs=[]
for i,cmd in enumerate(pages,1):
    commands=cmd
    commands.append('0.85 0.86 0.90 RG 0.5 w 48 46 m 547 46 l S')
    draw('Integración de Sentry · 02/10/2026',48,31,8,color='0.40 0.44 0.50')
    draw(f'{i} / {len(pages)}',506,31,8,color='0.40 0.44 0.50')
    data='\n'.join(commands).encode('cp1252',errors='replace')
    stream=obj(f'<< /Length {len(data)} >>\nstream\n'.encode()+data+b'\nendstream')
    refs.append(obj(f'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {W} {H}] /Resources << /Font << /F1 {f1} 0 R /F2 {f2} 0 R >> >> /Contents {stream} 0 R >>'))
objects[1]=f'<< /Type /Pages /Count {len(refs)} /Kids [{" ".join(f"{r} 0 R" for r in refs)}] >>'.encode()
info=obj('<< /Title (Integración de Sentry - ProjectFlow) /Author (Documentación del proyecto) /Subject (Arquitectura, errores, payloads, privacidad y verificación) >>')
data=bytearray(b'%PDF-1.4\n%\xe2\xe3\xcf\xd3\n');offsets=[0]
for i,content in enumerate(objects,1):
    offsets.append(len(data)); data.extend(f'{i} 0 obj\n'.encode()+content+b'\nendobj\n')
xref=len(data);data.extend(f'xref\n0 {len(objects)+1}\n0000000000 65535 f \n'.encode())
for offset in offsets[1:]:data.extend(f'{offset:010d} 00000 n \n'.encode())
data.extend(f'trailer\n<< /Size {len(objects)+1} /Root 1 0 R /Info {info} 0 R >>\nstartxref\n{xref}\n%%EOF\n'.encode())
path=ROOT/'integracion-sentry.pdf';path.write_bytes(data)
print(f'PDF: {path}\nPáginas: {len(pages)}\nBytes: {len(data)}')
