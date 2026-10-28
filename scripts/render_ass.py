"""Export alternativa senza Chromium; legge gli stessi testi e tempi di Remotion."""
import json,math,pathlib,subprocess,textwrap,sys
ROOT=pathlib.Path(__file__).resolve().parents[1]
OUT=ROOT/'out';OUT.mkdir(exist_ok=True)
DATA=json.loads((ROOT/'src/timeline.json').read_text());WORDS=json.loads((ROOT/'src/words.json').read_text())
A='D0F280';WHITE='FFFFFF';MUTED='C9C4AF';BG='211A0F'
events=[]
def ts(s):
 c=round(max(0,s)*100);return f'{c//360000}:{c//6000%60:02}:{c//100%60:02}.{c%100:02}'
def event(start,end,tags,content,layer=2):
 events.append(f'Dialogue: {layer},{ts(start)},{ts(end)},Default,,0,0,0,,{{{tags}}}{content}')
def txt(s,e,x,y,text,size=30,col=WHITE,align=7,bold=True,delay=0):
 s+=delay
 # All entrances share a short, restrained vertical movement.
 tags=f'\\an{align}\\move({x},{y+12},{x},{y},0,180)\\fs{size}\\b{int(bold)}\\c&H{col}&\\bord0\\shad0\\fad(120,120)'
 event(s,e,tags,text)
def shape(s,e,x,y,path,color=A,alpha='00',outline=0,layer=1):
 tags=f'\\an7\\move({x},{y+12},{x},{y},0,180)\\p1\\c&H{color}&\\1a&H{alpha}&\\bord{outline}\\3c&H{color}&\\shad0\\fad(120,120)'
 event(s,e,tags,path,layer)
def rect(s,e,x,y,w,h,col=BG,r=16,alpha='00',outline=0):
 k=.55228475*r
 path=f'm {r} 0 l {w-r} 0 b {w-r+k} 0 {w} {r-k} {w} {r} l {w} {h-r} b {w} {h-r+k} {w-r+k} {h} {w-r} {h} l {r} {h} b {r-k} {h} 0 {h-r+k} 0 {h-r} l 0 {r} b 0 {r-k} {r-k} 0 {r} 0'
 shape(s,e,x,y,path,col,alpha,outline)
def ln(s,e,x,y,w,h=2,col=A):rect(s,e,x,y,w,h,col,r=0)
def arrow(s,e,x,y,w):
 ln(s,e,x,y,w,2);shape(s,e,x+w-8,y-7,'m 0 0 l 10 8 0 16 0 12 6 8 0 4',A)
def circle(s,e,x,y,r,col=A,fill=False):
 k=.55228475*r
 path=f'm {r} 0 b {r+k} 0 {2*r} {r-k} {2*r} {r} b {2*r} {r+k} {r+k} {2*r} {r} {2*r} b {r-k} {2*r} 0 {r+k} 0 {r} b 0 {r-k} {r-k} 0 {r} 0'
 shape(s,e,x,y,path,col,'00' if fill else 'FF',0 if fill else 2)
def icon(s,e,x,y,k):
 if k=='person':
  circle(s,e,x+22,y,14);shape(s,e,x,y+31,'m 0 37 b 0 0 73 0 73 37 l 69 37 b 69 6 4 6 4 37',A)
 elif k=='brain':
  shape(s,e,x,y,'m 45 6 b 25 -3 9 11 15 25 b -2 31 -1 48 10 55 b 4 73 28 83 44 70 b 50 80 64 72 64 62 l 64 17 b 64 6 53 1 45 6 m 78 6 b 98 -3 114 11 108 25 b 125 31 124 48 113 55 b 119 73 95 83 79 70 b 73 80 64 72 64 62',A,'FF',2)
  ln(s,e,x+27,y+33,18);ln(s,e,x+78,y+33,18);circle(s,e,x+32,y+52,4,fill=True);circle(s,e,x+85,y+52,4,fill=True)
 elif k=='monitor':
  rect(s,e,x,y,126,72,A,10,'FF',2);ln(s,e,x+20,y+20,86,3);ln(s,e,x+20,y+37,60,3);ln(s,e,x+20,y+53,76,3);ln(s,e,x+44,y+84,38,2)
 elif k=='trophy':
  shape(s,e,x,y,'m 24 0 l 80 0 80 26 b 80 57 53 76 53 76 b 53 76 24 57 24 26 l 24 0 m 24 11 l 7 11 7 26 b 7 42 27 43 29 43 m 80 11 l 97 11 97 26 b 97 42 77 43 75 43 m 53 76 l 53 90 m 34 91 l 72 91',A,'FF',2)
 elif k=='list':
  rect(s,e,x,y,174,86,A,12,'FF',2)
  for j in range(3):rect(s,e,x+16,y+16+j*21,11,11,A,2,'FF',1);ln(s,e,x+40,y+20+j*21,111,2)
def art(s,e,y,kind):
 if kind=='notifications':
  for i,label in enumerate(['Messaggi','Video','Notifiche']):
   d=i*.15;xx=123+i*240;rect(s+d,e,xx,y,210,96,'30291B',14)
   rect(s+d,e,xx+15,y+16,30,30,A,7,'FF',2);ln(s+d,e,xx+60,y+22,125,3,WHITE);ln(s+d,e,xx+60,y+38,87,3,MUTED);ln(s+d,e,xx+18,y+66,166,3,MUTED);circle(s+d,e,xx+192,y-4,9,fill=True)
 elif kind=='feed':
  icon(s,e,140,y+12,'person');arrow(s,e,250,y+50,150);rect(s,e,440,y,340,108,A,14,'FF',2)
  for j in range(3):rect(s+.15*j,e,456,y+11+j*30,38,24,A,5,'00' if j==1 else '99');ln(s+.15*j,e,510,y+19+j*30,240,3,WHITE);ln(s+.15*j,e,510,y+29+j*30,150,2,MUTED)
 elif kind=='brain':icon(s,e,144,y+10,'brain');arrow(s,e,330,y+48,150);icon(s,e,575,y+5,'monitor')
 elif kind=='energy':
  shape(s,e,155,y,'m 55 0 l 0 60 43 60 30 105 92 39 52 39 55 0',A)
  arrow(s,e,305,y+52,90);rect(s,e,452,y+20,290,65,A,10,'FF',2);rect(s,e,744,y+37,10,30,A,3)
  for j in range(5):rect(s,e,465+j*53,y+31,40,43,A,4,'00' if j<2 else 'CC')
 elif kind=='quest':icon(s,e,115,y+10,'list');arrow(s,e,335,y+53,90);icon(s,e,485,y+2,'trophy');rect(s,e,650,y+29,145,49,'30291B',22);txt(s,e,722,y+53,'QUEST',26,A,5)
 elif kind=='focus':
  for j in range(3):rect(s+.1*j,e,122+j*86,y+15+j*5,63,76,MUTED,9,'FF',2)
  arrow(s,e,435,y+56,80);circle(s,e,612,y+6,50);circle(s,e,630,y+24,32);circle(s,e,653,y+47,9,fill=True)
for c in DATA['chapters']:
 idx=DATA['chapters'].index(c);end=DATA['chapters'][idx+1]['start'] if idx+1<len(DATA['chapters']) else 119.79
 rect(c['start'],end,64,104,5,36,A,2);txt(c['start'],end,84,110,c['label'],23)
for scene in DATA['scenes']:
 s,e=scene['start'],scene['end'];kind=scene['kind'];labels=scene['labels'];y=1000;x=62;w=862
 title=scene['title'];title_lines=textwrap.wrap(title,34)
 title_h=52*len(title_lines);art_h=145 if scene.get('art') else 0
 content_h=95 if kind in ['flow','cards'] else 96 if kind=='metric' else 104 if kind=='check' else 65
 detail_h=36 if scene.get('detail') else 0
 h=28+25+16+title_h+15+art_h+content_h+detail_h+24
 rect(s,e,x,y,w,h,BG,28);rect(s,e,x,y,w,h,'5D6A65',28,'FF',1)
 circle(s,e,x+30,y+35,4,fill=True);txt(s,e,x+47,y+26,scene['eyebrow'].upper(),19,A)
 ty=y+68
 for i,l in enumerate(title_lines):txt(s,e,x+30,ty+i*52,l,43)
 cy=ty+title_h+15
 if scene.get('art'):art(s,e,cy,scene['art']);cy+=145
 if kind in ['flow','cards']:
  count=len(labels);gap=34 if kind=='flow' else 16;bw=(w-60-gap*(count-1))/count
  for i,l in enumerate(labels):
   xx=x+30+i*(bw+gap);delay=.12*i;rect(s+delay,e,xx,cy,bw,95,'30291B',15);rect(s+delay,e,xx,cy,bw,95,'567466',15,'FF',1)
   ll=textwrap.wrap(l,max(10,int(bw/16)))
   if kind=='cards':txt(s,e,xx+15,cy+10,f'0{i+1}',16,A,delay=delay)
   yy=cy+(29 if kind=='cards' else 47)
   if kind=='cards':
    for j,t in enumerate(ll):txt(s,e,xx+15,yy+j*31,t,27,delay=delay)
   else:
    for j,t in enumerate(ll):txt(s,e,xx+bw/2,yy+(j-(len(ll)-1)/2)*32,t,29,align=5,delay=delay)
   if kind=='flow' and i<count-1:arrow(s+delay,e,xx+bw+6,cy+47,22)
 elif kind=='check':
  for i,l in enumerate(labels):
   rect(s+.12*i,e,x+32,cy+i*49,30,30,A,7,'FF',1);txt(s,e,x+47,cy+i*49+15,'✓',23,A,5,delay=.12*i);txt(s,e,x+80,cy+i*49,l,30,delay=.12*i)
 elif kind=='metric':txt(s,e,x+32,cy-8,labels[0],82,A);txt(s,e,x+142,cy+24,' · '.join(labels[1:]),29)
 elif kind=='warning':txt(s,e,x+31,cy,'!',51,'8BD4F9');txt(s,e,x+83,cy+12,' · '.join(labels),28)
 if scene.get('detail'):txt(s,e,x+32,y+h-38,scene['detail'],20,MUTED,bold=False)
# Caption groups and per-word active states: short, stable phrases.
blocks=[];block=[]
for word in WORDS:
 if block and (len(' '.join(w['text'] for w in block+[word]))>31 or word['start']-block[0]['start']>2.4 or word['start']-block[-1]['end']>.65):blocks.append(block);block=[]
 block.append(word)
 if word['text'].endswith(('.','!','?', ';',':')):blocks.append(block);block=[]
if block:blocks.append(block)
srt=[]
def srtts(t):
 ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
for bi,b in enumerate(blocks):
 end=min(b[-1]['end']+.1,blocks[bi+1][0]['start'] if bi+1<len(blocks) else 119.79)
 text=' '.join(w['text'] for w in b);bw=min(852,max(160,len(text)*24+46));xx=494-bw/2
 rect(b[0]['start'],end,xx,1510,bw,96,'181109',18)
 for wi,word in enumerate(b):
  we=b[wi+1]['start'] if wi+1<len(b) else end
  if we<=word['start']:continue
  content=' '.join(('{\\c&H'+(A if j==wi else WHITE)+'&}'+w['text']) for j,w in enumerate(b))
  event(word['start'],we,'\\an5\\pos(494,1558)\\fs44\\b1\\bord0\\shad0',content,4)
 srt.append(f'{bi+1}\n{srtts(b[0]["start"])} --> {srtts(end)}\n{text}\n')
(OUT/'captions.srt').write_text('\n'.join(srt))
header='''[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,DejaVu Sans,30,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0,0,7,0,0,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
'''
(OUT/'graphics.ass').write_text(header+'\n'.join(events))
print(f'Generated {len(events)} events, {len(blocks)} caption blocks',flush=True)
if '--prepare' not in sys.argv:
 cmd=['ffmpeg','-y','-hide_banner','-loglevel','warning','-i',str(ROOT/'public/source.mp4'),'-vf','scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,ass='+str(OUT/'graphics.ass'),'-c:v','libx264','-preset','fast','-crf','19','-pix_fmt','yuv420p','-c:a','aac','-b:a','160k','-movflags','+faststart',str(OUT/'tiktok.mp4')]
 subprocess.run(cmd,check=True)
