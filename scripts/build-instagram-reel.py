from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps
import imageio_ffmpeg, subprocess, math, json
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'output'/'marketing'/'reels'; OUT.mkdir(parents=True,exist_ok=True)
W,H,FPS=1080,1920,30
FONT=Path('C:/Windows/Fonts')
regular=lambda n: ImageFont.truetype(str(FONT/'segoeui.ttf'),n)
bold=lambda n: ImageFont.truetype(str(FONT/'segoeuib.ttf'),n)
serif=lambda n: ImageFont.truetype(str(FONT/'georgia.ttf'),n)
TEAL='#174C48'; INK='#172D2B'; PAPER='#F7F7F2'; GOLD='#AE9161'
photos=[Image.open(ROOT/'public/hospitals/seran-plus'/p).convert('RGB') for p in ['lobby.jpg','consultation-rooms.jpg','corridor.jpg']]
scenes=[
 dict(start=0,end=4,photo=0,eyebrow='K-MEDICAL, WITH BEAUTIRO',title=['Perawatan kecantikan','di Korea?'],body=['Mulai dengan konsultasi.'],small='Kami bantu merencanakan perjalanan Anda.'),
 dict(start=4,end=9,photo=1,eyebrow='SERAN PLUS · INCHEON',title=['Klinik nyata.','Pendampingan nyata.'],body=['Koordinasi langsung dengan klinik.'],small='Seran Plus Plastic Surgery · Guwol-dong, Incheon'),
 dict(start=9,end=14,photo=2,eyebrow='YOUR MEDICAL CONCIERGE',title=['Dari kedatangan','hingga konsultasi.'],body=['Pickup bandara · Penerjemah','Penawaran khusus klinik'],small='Syarat & ketersediaan dikonfirmasi saat konsultasi.'),
 dict(start=14,end=20,photo=0,eyebrow='LET’S PLAN YOUR VISIT',title=['Tanya biaya.','Rencanakan kunjungan.'],body=['Chat kami di WhatsApp.'],small='Link di bio · www.beautiro.com')
]
def text(draw,xy,value,font,fill):
 draw.text(xy,value,font=font,fill=fill,stroke_width=0)
def render(t):
 scene=next((s for s in scenes if s['start']<=t<s['end']),scenes[-1]); p=(t-scene['start'])/(scene['end']-scene['start'])
 frame=Image.new('RGB',(W,H),PAPER); draw=ImageDraw.Draw(frame)
 # Original clinic photograph, fitted without stretching; a restrained pan gives motion.
 photo=photos[scene['photo']]; scale=1+0.035*p
 panel=ImageOps.fit(photo,(int(1000*scale),int(751*scale)),method=Image.Resampling.LANCZOS)
 left=(panel.width-1000)//2; top=(panel.height-751)//2
 frame.paste(panel.crop((left,top,left+1000,top+751)),(40,840))
 draw=ImageDraw.Draw(frame)
 draw.rectangle((40,840,1040,1591),outline='#DDDCD6',width=1)
 text(draw,(88,292),'Beautiro',serif(66),TEAL)
 text(draw,(91,375),scene['eyebrow'],bold(22),GOLD)
 draw.line((88,427,910,427),fill='#D8DDD8',width=2)
 for i,line in enumerate(scene['title']):
  font_size=68 if len(line)>22 else 76
  text(draw,(88,470+i*98),line,bold(font_size),INK)
 for i,line in enumerate(scene['body']): text(draw,(90,691+i*46),line,regular(34),TEAL)
 # Safety band keeps the key CTA above the Reels controls.
 if scene is scenes[-1]:
  draw.rounded_rectangle((82,1012,918,1152),radius=6,fill=TEAL)
  text(draw,(120,1045),'WhatsApp · Link di bio',bold(42),'white')
  draw.rectangle((40,1170,1040,1252),fill=PAPER)
  text(draw,(90,1185),'@beautiro.official',bold(32),TEAL)
 else:
  draw.rectangle((40,1144,1040,1252),fill=PAPER)
  text(draw,(88,1172),scene['small'],regular(25),TEAL)
 text(draw,(88,1680),'KOREAN MEDICAL CONCIERGE',regular(21),GOLD)
 text(draw,(88,1720),'www.beautiro.com',regular(27),TEAL)
 # Short fades only at the start and end of each scene.
 fade=min(1,p*18,(1-p)*18)
 if fade<1: frame=Image.blend(Image.new('RGB',(W,H),PAPER),frame,max(0,fade))
 return frame
video=OUT/'beautiro-indonesia-reel-20s.mp4'
command=[imageio_ffmpeg.get_ffmpeg_exe(),'-y','-f','rawvideo','-vcodec','rawvideo','-s',f'{W}x{H}','-pix_fmt','rgb24','-r',str(FPS),'-i','pipe:0','-an','-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',str(video)]
process=subprocess.Popen(command,stdin=subprocess.PIPE,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
for number in range(20*FPS): process.stdin.write(render(number/FPS).tobytes())
process.stdin.close(); errors=process.stderr.read().decode(errors='replace'); code=process.wait()
if code: raise RuntimeError(errors[-2000:])
render(1.5).save(OUT/'beautiro-reel-cover.jpg',quality=95)
thumbs=Image.new('RGB',(1080,960),PAPER)
for i,t in enumerate([1.5,6.5,11.5,17]): thumbs.paste(render(t).resize((270,480)),(i*270,240))
thumbs.save(OUT/'beautiro-reel-storyboard.jpg',quality=95)
(OUT/'reel-scenes.json').write_text(json.dumps(scenes,ensure_ascii=False,indent=2),encoding='utf-8')
print(f'Rendered: {video}\n1080x1920 · 30 fps · 20 seconds · H.264 · silent master')
