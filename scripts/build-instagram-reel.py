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
model=Image.open(OUT/'model-candidate-32280799.jpg').convert('RGB')
model_after=Image.open(OUT/'model-30797188.jpg').convert('RGB')
scenes=[
 dict(start=0,end=2.5,photo=0,eyebrow='K-BEAUTY PROMO',title=['Ingin tampil','lebih percaya diri?'],body=['Mulai dengan konsultasi.'],small='Model ilustrasi · Bukan hasil perawatan'),
 dict(start=2.5,end=5,photo=1,eyebrow='PROMO SEDANG BERLANGSUNG',title=['Beauty care','di Korea'],body=['Tanya promo yang tersedia.'],small='Syarat dan ketersediaan dikonfirmasi saat konsultasi.'),
 dict(start=5,end=8.5,photo=2,eyebrow='PROMO BEAUTIRO',title=['Tanya saja,','dapatkan benefitnya.'],body=['Ride gratis · Penerjemah gratis','Untuk konsultasi selama promo'],small='Syarat & ketersediaan dikonfirmasi saat konsultasi.'),
 dict(start=8.5,end=12,photo=0,eyebrow='LET’S PLAN YOUR VISIT',title=['Tanya biaya.','Rencanakan kunjungan.'],body=['Chat kami di WhatsApp.'],small='Link di bio · www.beautiro.com')
]
def text(draw,xy,value,font,fill):
 draw.text(xy,value,font=font,fill=fill,stroke_width=0)
def render(t):
 scene=next((s for s in scenes if s['start']<=t<s['end']),scenes[-1]); p=(t-scene['start'])/(scene['end']-scene['start'])
 if scene is scenes[0]:
  source=model if p < 0.48 else model_after
  # Fast editorial cut: the first model changes into a second real East Asian beauty model.
  if 0.42 <= p <= 0.58:
   a=ImageOps.fit(model,(W,H),method=Image.Resampling.LANCZOS).convert('RGBA')
   b=ImageOps.fit(model_after,(W,H),method=Image.Resampling.LANCZOS).convert('RGBA')
   source=Image.blend(a,b,(p-0.42)/0.16).convert('RGB')
  zoom=1+0.035*p
  expanded=ImageOps.fit(source,(int(W*zoom),int(H*zoom)),method=Image.Resampling.LANCZOS)
  x=(expanded.width-W)//2; y=(expanded.height-H)//2
  frame=expanded.crop((x,y,x+W,y+H)).convert('RGBA')
  overlay=Image.new('RGBA',(W,H),(0,0,0,0)); d=ImageDraw.Draw(overlay)
  d.rectangle((66,278,934,568),fill=(12,42,39,220))
  d.rectangle((66,1090,934,1245),fill=(12,42,39,235))
  frame=Image.alpha_composite(frame,overlay).convert('RGB'); draw=ImageDraw.Draw(frame)
  text(draw,(88,292),'Beautiro',serif(64),'white')
  text(draw,(90,373),'YOUR KOREAN BEAUTY JOURNEY',bold(20),'#D5BC8E')
  text(draw,(88,412),'Ingin tampil lebih percaya diri?',bold(54),'white')
  text(draw,(90,510),'Tanya Beautiro.',regular(32),'white')
  text(draw,(90,1110),'Promo sedang berlangsung',bold(38),'white')
  text(draw,(90,1172),'Model ilustrasi · Bukan hasil perawatan',regular(26),'white')
  return frame
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
video=OUT/'beautiro-indonesia-reel-12s.mp4'
command=[imageio_ffmpeg.get_ffmpeg_exe(),'-y','-f','rawvideo','-vcodec','rawvideo','-s',f'{W}x{H}','-pix_fmt','rgb24','-r',str(FPS),'-i','pipe:0','-an','-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',str(video)]
process=subprocess.Popen(command,stdin=subprocess.PIPE,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
for number in range(12*FPS): process.stdin.write(render(number/FPS).tobytes())
process.stdin.close(); errors=process.stderr.read().decode(errors='replace'); code=process.wait()
if code: raise RuntimeError(errors[-2000:])
render(1.0).save(OUT/'beautiro-reel-cover.jpg',quality=95)
thumbs=Image.new('RGB',(1080,960),PAPER)
for i,t in enumerate([1.0,3.5,6.5,10.0]): thumbs.paste(render(t).resize((270,480)),(i*270,240))
thumbs.save(OUT/'beautiro-reel-storyboard.jpg',quality=95)
(OUT/'reel-scenes.json').write_text(json.dumps(scenes,ensure_ascii=False,indent=2),encoding='utf-8')
print(f'Rendered: {video}\n1080x1920 · 30 fps · 12 seconds · H.264 · silent master')
