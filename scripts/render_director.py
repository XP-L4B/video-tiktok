"""Montaggio narrativo dinamico: layout, grafica, sottotitoli, audio e master MP4.
Rendering deterministico per fotogramma. Nessun browser o servizio esterno richiesto.
"""
from PIL import Image,ImageDraw,ImageFont,ImageFilter
import numpy as np
import json,math,pathlib,subprocess,functools,wave,sys,time
R=pathlib.Path(__file__).resolve().parents[1];O=R/'out';O.mkdir(exist_ok=True)
SC=json.loads((R/'storyboard/director.json').read_text());WORDS=json.loads((R/'src/words.json').read_text())
W,H,FPS,N=1080,1920,30,3594
BG='#09131f';PANEL='#142535';LINE='#304556';WHITE='#edf4f8';MUTED='#88a0ae';MINT='#70e0be';BLUE='#7aaeff';GOLD='#eac087';RED='#e89898'
FP='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';FB='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
@functools.lru_cache(None)
def font(s,b=True):return ImageFont.truetype(FB if b else FP,round(s))
def clamp(x):return max(0,min(1,x))
def ease(x):x=clamp(x);return x*x*x*(x*(6*x-15)+10)
def lerp(a,b,p):return a+(b-a)*p
def txt(im,x,y,s,size=40,col=WHITE,anchor='mm',bold=True):ImageDraw.Draw(im).text((x,y),s,fill=col,font=font(size,bold),anchor=anchor)
def rr(d,box,r=24,fill=PANEL,outline=None,width=2):d.rounded_rectangle(tuple(round(v) for v in box),r,fill,outline,width)
def circle(d,x,y,r,fill=None,outline=MINT,width=3):d.ellipse((x-r,y-r,x+r,y+r),fill,outline,width)
def ln(d,pts,color=MINT,width=4):d.line(pts,fill=color,width=width,joint='curve')
def route(im,pts,p=1,col=MINT,width=5):
 d=ImageDraw.Draw(im);n=len(pts)-1
 for i in range(n):
  q=clamp(p*n-i)
  if q:ln(d,[pts[i],(lerp(pts[i][0],pts[i+1][0],q),lerp(pts[i][1],pts[i+1][1],q))],col,width)
def arrow(im,a,b,p=1,col=MINT):
 route(im,[a,b],p,col);q=clamp(p);x,y=lerp(a[0],b[0],q),lerp(a[1],b[1],q)
 if q>.98:
  ang=math.atan2(b[1]-a[1],b[0]-a[0]);d=ImageDraw.Draw(im);d.polygon([(x,y),(x-18*math.cos(ang-.5),y-18*math.sin(ang-.5)),(x-18*math.cos(ang+.5),y-18*math.sin(ang+.5))],fill=col)
def card(im,x,y,w,h,label=None,color=MINT):
 d=ImageDraw.Draw(im);rr(d,(x+4,y+12,x+w+4,y+h+12),26,'#050c15');rr(d,(x,y,x+w,y+h),26,PANEL,LINE)
 rr(d,(x+24,y+25,x+30,y+61),3,color)
 if label:txt(im,x+52,y+43,label,29,anchor='lm')
def chip(im,x,y,size=190,label='IA'):
 d=ImageDraw.Draw(im);r=size/2;rr(d,(x-r,y-r,x+r,y+r),30,PANEL,BLUE,3)
 for j in range(5):
  q=x-r+25+j*(size-50)/4;ln(d,[(q,y-r-17),(q,y-r)],BLUE,3);ln(d,[(q,y+r),(q,y+r+17)],BLUE,3)
  q=y-r+25+j*(size-50)/4;ln(d,[(x-r-17,q),(x-r,q)],BLUE,3);ln(d,[(x+r,q),(x+r+17,q)],BLUE,3)
 txt(im,x,y,label,int(size*.24),BLUE)
def person(im,x,y,r=48,color=MINT):
 d=ImageDraw.Draw(im);circle(d,x,y-r*.35,r*.34,None,color,5);d.arc((x-r*.7,y+r*.12,x+r*.7,y+r*1.25),180,360,fill=color,width=5)
def sheet(im,x,y,s=1,done=False):
 d=ImageDraw.Draw(im);w=115*s;h=150*s;rr(d,(x-w/2,y-h/2,x+w/2,y+h/2),12*s,PANEL,MINT if done else LINE,3)
 for j in range(3):
  yy=y-h/2+35*s+j*37*s;rr(d,(x-w/2+15*s,yy,x-w/2+30*s,yy+15*s),3*s,MINT if done else LINE)
  ln(d,[(x-w/2+43*s,yy+6*s),(x+w/2-13*s,yy+6*s)],MINT if done else MUTED,3)
def neural(im,x,y,s,t,dim=False):
 d=ImageDraw.Draw(im);pts=[]
 for j in range(14):
  a=j*math.tau/14;rad=s*(.70+.13*math.sin(j*2.7));pts.append((x+math.cos(a)*rad,y+math.sin(a)*rad))
 for j in range(14):
  col=LINE if dim else '#476476';ln(d,[pts[j],pts[(j+3)%14]],col,2)
  if not dim:
   q=(t*.35+j*.17)%1;aa,bb=pts[j],pts[(j+3)%14];circle(d,lerp(aa[0],bb[0],q),lerp(aa[1],bb[1],q),4,MINT,None)
 for j,(xx,yy) in enumerate(pts):circle(d,xx,yy,7 if dim else 7+2*math.sin(t*2+j),MUTED if dim else MINT,None)
 circle(d,x,y,s*.27,PANEL,BLUE,2);txt(im,x,y,'PENSIERO',int(s*.10),BLUE)
def ring(im,x,y,r,p=1,col=MINT):
 d=ImageDraw.Draw(im);d.arc((x-r,y-r,x+r,y+r),-90,-90+max(.01,p)*359,fill=col,width=9)
def pulse(im,x,y,t,r=80):
 d=ImageDraw.Draw(im)
 for j in range(2):q=(t*.5+j*.5)%1;circle(d,x,y,r+q*35,None,LINE,2)
def notification(im,x,y,label,index=0,scale=1):
 w=310*scale;h=110*scale;d=ImageDraw.Draw(im);rr(d,(x-w/2,y-h/2,x+w/2,y+h/2),18*scale,PANEL,LINE,2)
 circle(d,x-w/2+42*scale,y,20*scale,[MINT,BLUE,GOLD][index%3],None)
 if index%3==1:d.polygon([(x-w/2+36*scale,y-9*scale),(x-w/2+36*scale,y+9*scale),(x-w/2+51*scale,y)],fill=BG)
 txt(im,x-w/2+80*scale,y,label,round(26*scale),anchor='lm')
 circle(d,x+w/2-12,y-h/2+8,9*scale,RED,None)
def move_token(im,a,b,t,kind='task',size=1):
 if t<0 or t>1:return
 q=ease(t);x=lerp(a[0],b[0],q);y=lerp(a[1],b[1],q)-55*math.sin(q*math.pi)
 if kind=='task':sheet(im,x,y,size)
 else:circle(ImageDraw.Draw(im),x,y,12*size,MINT,None)

def graphic(kind,u,duration):
 im=Image.new('RGBA',(1000,1000));d=ImageDraw.Draw(im);p=clamp(u/duration)
 if kind in ['distraction','focus','amplify','personalize','feed']:
  if kind=='distraction':
   person(im,500,490,105);ring(im,500,510,145,1-p*.5)
   for j,(x,y,label) in enumerate([(270,220,'Messaggi'),(735,365,'Video'),(270,690,'Notifiche'),(720,825,'Social')]):
    q=ease((u-j*.35)/.7);xx=lerp(500,x,q);yy=lerp(490,y,q)+math.sin(u*1.6+j)*8
    notification(im,xx,yy,label,j)
    route(im,[(xx,yy),(500,510)],1,LINE,2)
  elif kind=='focus':
   txt(im,500,170,'ATTENZIONE',36,MUTED);ring(im,500,485,220,max(.15,1-p*.85));person(im,500,460,125)
   for j in range(8):
    a=j*math.tau/8;rrad=260+p*90;circle(d,500+math.cos(a)*rrad,485+math.sin(a)*rrad,10,BLUE,None)
   txt(im,500,825,'Sempre più frammentata',34)
  elif kind=='amplify':
   chip(im,500,500,230)
   for j in range(7):
    q=clamp((u-.2*j)/1.3);a=j*math.tau/7;rad=300*q
    notification(im,500+math.cos(a)*rad,500+math.sin(a)*rad,'Stimolo',j,.62)
   pulse(im,500,500,u,185)
  elif kind=='personalize':
   card(im,70,100,860,230,'IL TUO PROFILO');person(im,190,220,60)
   for j,label in enumerate(['Interessi','Preferenze','Reazioni']):txt(im,400+j*190,220,label,25)
   chip(im,500,500,190);arrow(im,(500,335),(500,380),ease(u/.8))
   for j in range(3):
    target=(230+j*270,790);arrow(im,(500,620),target,ease((u-.5-j*.15)/1.1),BLUE)
    card(im,target[0]-110,730,220,170,None);circle(d,*target,30,[MINT,BLUE,GOLD][j],None)
   txt(im,500,950,'Contenuti personalizzati',32)
  else:
   card(im,220,75,560,835,'UN FEED SU MISURA')
   for j in range(4):
    y=250+j*155;rr(d,(250,y-45,750,y+75),18,'#20364a');circle(d,305,y+12,25,[MINT,BLUE,GOLD,BLUE][j],None)
    for z in range(2):ln(d,[(360,y+z*22),(690-z*60,y+z*22)],MUTED,6)
    q=(u*.5+j*.3)%1;circle(d,730,y+q*50,5,MINT,None)
   ring(im,500,500,365,1,BLUE)
 elif kind in ['roles','contrast','drain']:
  labels=['CONSUMATORE','LAVORATORE'] if kind=='roles' else ['STIMOLI SU MISURA','ATTIVITÀ QUOTIDIANE']
  for j in range(2):
   y=130+j*410;card(im,90,y,820,330,labels[j],MINT if j==0 else BLUE)
   if kind=='roles':
    person(im,245,y+180,80,MINT if j==0 else BLUE)
    if j==0:
     for z in range(3):notification(im,530+z*65,y+140+z*45+math.sin(u+z)*7,'',z,.5)
    else:ring(im,610,y+190,85,1,BLUE);circle(d,610,y+190,18,BLUE,None)
    txt(im,460,y+270,'Distratto' if j==0 else 'Attento',37,anchor='lm')
   else:
    for z in range(4):rr(d,(180+z*150,y+130,290+z*150,y+220),15,[MINT,BLUE,GOLD,BLUE][z] if j==0 else '#374957')
    if j==0:
     for z in range(4):circle(d,220+z*160,y+260+math.sin(u*2+z)*13,6,MINT,None)
    else:txt(im,500,y+275,'Meno coinvolgimento',29,MUTED)
  if kind=='drain':
   for j in range(5):move_token(im,(790,750),(790,300),(u*.35+j*.2)%1,'dot')
 elif kind in ['offload','delegate','tools','thought','plastic','risk','energy','shortcut']:
  if kind in ['plastic','risk']:
   neural(im,500,490,335,u,dim=kind=='risk');txt(im,500,910,'Adattamento all’uso' if kind=='plastic' else 'Meno esercizio del pensiero',33,MUTED)
  elif kind=='energy':
   neural(im,500,360,220,u);rr(d,(190,720,810,850),28,PANEL,LINE,4);rr(d,(812,755,837,815),8,LINE)
   for j in range(6):rr(d,(212+j*96,740,289+j*96,830),12,MINT if j<max(1,6-int(p*5)) else LINE)
   for j in range(4):move_token(im,(500,720),(500,530),(u*.5+j*.25)%1,'dot',.7)
  elif kind=='shortcut':
   neural(im,200,510,120,u);chip(im,810,510,145)
   route(im,[(320,510),(360,260),(510,260),(510,800),(650,800),(650,260),(740,510)],1,LINE,6)
   arrow(im,(320,510),(710,510),ease((u-.5)/1.2));move_token(im,(330,510),(700,510),(u*.4)%1,'dot')
   txt(im,500,930,'Risparmiare sforzo',34,MUTED)
  elif kind=='tools':
   neural(im,500,480,190,u)
   for j,lab in enumerate(['Memoria','Calcolo','Organizzazione']):
    x=200+j*300;card(im,x-120,780,240,150);txt(im,x,855,lab,24);move_token(im,(500,480),(x,800),(u*.3+j*.25)%1,'task',.55)
  else:
   neural(im,255,430,165,u);chip(im,745,430,190);arrow(im,(430,430),(610,430),ease(u/.6),BLUE)
   for j in range(3):move_token(im,(260,420+j*30),(740,400+j*30),clamp((u-j*.45)/2),'task',.65)
   txt(im,255,690,'NOI',32,MUTED);txt(im,745,690,'STRUMENTO',32,BLUE)
   txt(im,500,850,'Attività cognitive' if kind=='offload' else 'Singoli compiti' if kind=='delegate' else 'Il rischio di delegare il pensiero',32)
 elif kind in ['gamification','journey','feedback','engagement','everyday']:
  if kind=='gamification':
   sheet(im,250,450,2);card(im,610,270,300,380,'QUEST');ring(im,760,460,85,ease(p*2));txt(im,760,460,'✓',70,MINT)
   arrow(im,(400,450),(590,450),ease(u/1.2));txt(im,250,730,'ATTIVITÀ',32,MUTED);txt(im,760,730,'MISSIONE',32,MINT)
  elif kind=='journey':
   pts=[(150,760),(340,650),(520,500),(710,340),(850,210)];route(im,pts,1,LINE,12);route(im,pts,ease(p),MINT,12)
   for j,(x,y) in enumerate(pts):
    circle(d,x,y,35,PANEL,MINT if p*4>=j else LINE,4)
    if p*4>=j:txt(im,x,y,'✓',34,MINT)
    sheet(im,x,y-90,.65,done=p*4>=j)
   txt(im,500,950,'Attività ripetitive → percorso visibile',28,MUTED)
  elif kind=='feedback':
   pts=[(500,200),(810,680),(190,680)];labs=['AZIONE','FEEDBACK','MOTIVAZIONE']
   for j,(x,y) in enumerate(pts):
    arrow(im,pts[j],pts[(j+1)%3],1,LINE);circle(d,x,y,100,PANEL,MINT if j==1 else BLUE,3);txt(im,x,y,labs[j],23)
   q=(u*.3)%1;idx=min(2,int(q*3));move_token(im,pts[idx],pts[(idx+1)%3],q*3-idx,'dot',1.2)
  elif kind=='engagement':
   for j in range(5):
    x=140+j*180;person(im,x,600+math.sin(u*2+j)*8,65,MINT if u>.2*j else MUTED);route(im,[(x,530),(500,300)],ease((u-j*.15)/1),LINE,3)
   circle(d,500,300,90,PANEL,MINT,4);txt(im,500,300,'✓',76,MINT)
  else:
   for j,label in enumerate(['VITA QUOTIDIANA','LAVORO']):
    y=170+j*420;card(im,90,y,820,320,label);sheet(im,270,y+190,1.25,True);arrow(im,(400,y+190),(610,y+190),ease(u/.8));ring(im,730,y+190,65,1);txt(im,730,y+190,'✓',50,MINT)
 return im

LAY={'full':(0,0,1080,1920,0),'app':(0,0,1080,1920,0),'left':(0,430,470,1160,28),'right':(610,430,470,1160,28),'circle':(700,1180,320,320,160),'pip':(690,1150,310,430,28)}
REG={'left':(505,420,510,1090),'right':(50,420,510,1090),'circle':(65,310,950,850),'pip':(65,310,950,825)}
_y,_x=np.mgrid[0:H,0:W];g=np.exp(-(((_x-440)/800)**2+((_y-650)/1000)**2));a=np.zeros((H,W,3),dtype=np.uint8)
for c,(lo,hi) in enumerate([(7,17),(15,36),(25,52)]):a[:,:,c]=lo+(hi-lo)*g
BASE=Image.fromarray(a,'RGB').convert('RGBA')
@functools.lru_cache(maxsize=128)
def mask(w,h,r):
 m=Image.new('L',(w,h));ImageDraw.Draw(m).rounded_rectangle((0,0,w-1,h-1),r,fill=255);return m

def presenter(src,rect,t,isapp,zoom):
 x,y,w,h,r=rect;w=max(2,round(w));h=max(2,round(h));r=min(round(r),w//2,h//2)
 aspect=w/h;sw,sh=src.size
 # For circular/wide masks use the face, not the centre of the entire portrait.
 if sw/sh>aspect:ch=sh/zoom;cw=ch*aspect
 else:cw=sw/zoom;ch=cw/aspect
 cx=sw*.5;cy=sh*.5 if isapp else sh*(.5-.17*ease((aspect-.55)/.45))
 l=min(sw-cw,max(0,cx-cw/2));top=min(sh-ch,max(0,cy-ch/2))
 tile=src.crop((l,top,l+cw,top+ch)).resize((w,h),Image.Resampling.LANCZOS).convert('RGBA');tile.putalpha(mask(w,h,r));return tile,(round(x),round(y))
# Whisper may tokenize Italian elisions separately; join them before grouping.
joined=[]
for word in WORDS:
 w=dict(word)
 if joined and w['text'].startswith(("'",'’')):
  joined[-1]['text']+=w['text'];joined[-1]['end']=w['end']
 else:joined.append(w)
WORDS=joined
blocks=[];b=[]
for w in WORDS:
 if b and (len(' '.join(z['text'] for z in b+[w]))>34 or w['start']-b[0]['start']>2.4 or w['start']-b[-1]['end']>.6):blocks.append(b);b=[]
 b.append(w)
 if w['text'].endswith(('.','!','?',':',';')):blocks.append(b);b=[]
if b:blocks.append(b)
for i in range(len(blocks)-1):
 if len(blocks[i])>1 and blocks[i][-1]['text'].lower() in ['e','di','a','per','che','la','il','un','una','in','su']:
  blocks[i+1].insert(0,blocks[i].pop())

def captions(im,t,y):
 idx=next((i for i,b in enumerate(blocks) if b[0]['start']<=t<min(b[-1]['end']+.08,blocks[i+1][0]['start'] if i+1<len(blocks) else 120)),None)
 if idx is None:return
 b=blocks[idx];rows=[[]];f=font(44);d=ImageDraw.Draw(im)
 for w in b:
  trial=' '.join(z['text'] for z in rows[-1]+[w])
  if d.textlength(trial,font=f)>790 and rows[-1]:rows.append([])
  rows[-1].append(w)
 h=len(rows)*60+32;rr(d,(57,y,963,y+h),22,'#081421')
 rise=7*(1-ease((t-b[0]['start'])/.12))
 for j,row in enumerate(rows):
  widths=[d.textlength(w['text']+' ',font=f) for w in row];x=510-(sum(widths)-d.textlength(' ',font=f))/2
  for w,width in zip(row,widths):
   active=w['start']<=t<w['end'];txt(im,x,y+22+j*60+rise,w['text'],44,MINT if active else WHITE,'lt');x+=width

def render_frame(src,t):
 i=next((i for i,s in enumerate(SC) if s['start']<=t<s['end']),len(SC)-1);s=SC[i];u=t-s['start'];dur=s['end']-s['start'];mode=s['layout'];im=BASE.copy();d=ImageDraw.Draw(im)
 dest=LAY[mode];q=ease(u/.42)
 if i and q<1:rect=tuple(lerp(a,b,q) for a,b in zip(LAY[SC[i-1]['layout']],dest))
 else:rect=dest
 tile,xy=presenter(src,rect,t,mode=='app',1+.025*math.sin(math.pi*clamp(u/dur)))
 im.alpha_composite(tile,xy)
 if mode not in ['full','app']:
  # A stable graphic stage, entering with the spoken concept.
  reg=REG[mode];art=graphic(s['kind'],u,dur);size=min(reg[2],reg[3]);art=art.resize((size,size),Image.Resampling.LANCZOS)
  alpha=ease(u/.28)*ease((s['end']-t)/.2);art.putalpha(art.getchannel('A').point(lambda v:int(v*alpha)))
  im.alpha_composite(art,(reg[0],reg[1]+(reg[3]-size)//2+round(14*(1-q))))
  txt(im,70,135,'ATTENZIONE  /  IA  /  MOTIVAZIONE',19,MUTED,'lm',False)
  title=s['title'];lines=[title]
  if ImageDraw.Draw(im).textlength(title,font=font(49))>920:
   ws=title.split();cut=len(ws)//2;lines=[' '.join(ws[:cut]),' '.join(ws[cut:])]
  for j,title in enumerate(lines):txt(im,70,215+j*61,title,49,anchor='lm')
  rr(d,(70,285+max(0,len(lines)-1)*61,145,291+max(0,len(lines)-1)*61),3,MINT)
 else:
  # Speaker-led emphasis: restrained typography on the lower torso.
  overlay=Image.new('RGBA',(W,H));od=ImageDraw.Draw(overlay)
  for yy in range(1140,H):od.line((0,yy,W,yy),fill=(4,12,21,round(160*(yy-1140)/(H-1140))))
  im=Image.alpha_composite(im,overlay);d=ImageDraw.Draw(im)
  y=1320 if mode=='full' else 1370
  if s['kind']=='hook':
   for j,(x,yy,lab) in enumerate([(195,300,'Messaggi'),(865,450,'Video'),(210,1060,'Notifiche')]):
    if u>j*.3:notification(im,x,yy+14*(1-ease((u-j*.3)/.3)),lab,j,.85)
  elif s['kind']=='same':
   person(im,280,1190,60);person(im,800,1190,60,BLUE);route(im,[(350,1200),(730,1200)],ease(u/.6),MINT,4)
  elif s['kind']=='end':
   if t>=117.1:
    for j in range(5):person(im,300+j*115,1220,35,MINT)
   if t>=117.72:txt(im,540,1440,'BETA TEST',25,MINT)
  elif mode=='app':
   lab=('ACHIVIA' if t<105.2 else 'TASK E OBIETTIVI' if t<106.72 else 'TASK  →  OBIETTIVI  →  QUEST') if s['kind']=='appquest' else ('DATI SULLE PERFORMANCE' if t<109.98 else 'FEEDBACK IMMEDIATI')
   rr(d,(70,190,930,275),18,'#09131f');txt(im,500,232,lab,28,MINT)
  showtitle=s['title']
  if s['kind']=='thoughtfull' and t<73.44:showtitle='Vale a dire…'
  if mode=='app':showtitle='Achivia'
  txt(im,540,y,showtitle,64 if len(showtitle)<19 else 48,WHITE)
 captions(im,t,1570 if mode=='full' else 1640)
 return im.convert('RGB')

def sounds():
 sr=48000;n=round(119.8*sr);arr=np.zeros(n,dtype=np.float32);rng=np.random.default_rng(42)
 for sc in SC[1:]:
  t=sc['start'];dur=.24;l=round(sr*dur);tt=np.arange(l)/sr;noise=rng.standard_normal(l);spectrum=np.fft.rfft(noise);freq=np.fft.rfftfreq(l,1/sr);spectrum*=np.exp(-((freq-1500)/1000)**2);noise=np.fft.irfft(spectrum,n=l);noise/=max(.1,np.max(np.abs(noise)));sig=noise*np.sin(np.pi*tt/dur)**2*.009;start=round(t*sr);arr[start:start+l]+=sig[:min(l,n-start)]
 for t in [29.1,49.38,53.92,72.56,85.92,95.6,101.98,107.26,116.46]:
  l=round(.11*sr);tt=np.arange(l)/sr;sig=np.sin(2*np.pi*(720*tt-600*tt**2))*np.exp(-tt*45)*.005;start=round(t*sr);arr[start:start+l]+=sig
 with wave.open(str(O/'sound-design.wav'),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(sr);w.writeframes((arr*32767).astype('<i2').tobytes())

def render():
 source=R/'public/source.mp4'
 decoder=subprocess.Popen(['ffmpeg','-v','error','-i',str(source),'-an','-vf','fps=30','-f','rawvideo','-pix_fmt','rgb24','-'],stdout=subprocess.PIPE)
 encoder=subprocess.Popen(['ffmpeg','-y','-v','error','-f','rawvideo','-pix_fmt','rgb24','-s','1080x1920','-r','30','-i','-','-an','-c:v','libx264','-preset','fast','-crf','20','-maxrate','3000k','-bufsize','6000k','-pix_fmt','yuv420p',str(O/'director-silent.mp4')],stdin=subprocess.PIPE)
 st=time.monotonic();last=None
 try:
  for f in range(N):
   raw=decoder.stdout.read(464*832*3)
   if len(raw)==464*832*3:last=Image.frombytes('RGB',(464,832),raw)
   if last is None:raise RuntimeError('Video sorgente non decodificabile')
   encoder.stdin.write(render_frame(last,f/30).tobytes())
   if f%300==0:print(f'{f}/{N} · {time.monotonic()-st:.0f}s',flush=True)
 finally:encoder.stdin.close();decoder.stdout.close()
 if encoder.wait()!=0:raise RuntimeError('Encoding failed')
 decoder.wait();sounds()
 filt='[1:a]highpass=f=70,afftdn=nf=-30:nr=6,acompressor=threshold=0.07:ratio=2.5:attack=20:release=150:makeup=5,aresample=48000[voice];[voice][2:a]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.8:level=0:latency=1[a]'
 subprocess.run(['ffmpeg','-y','-v','error','-i',str(O/'director-silent.mp4'),'-i',str(source),'-i',str(O/'sound-design.wav'),'-filter_complex',filt,'-map','0:v:0','-map','[a]','-c:v','copy','-c:a','aac','-b:a','128k','-t','119.8','-movflags','+faststart',str(O/'tiktok-director.mp4')],check=True)
 import shutil
 shutil.copyfile(O/'tiktok-director.mp4',R/'public/edit-master.mp4')
 print(O/'tiktok-director.mp4',flush=True)
if __name__=='__main__':
 if '--still' in sys.argv:
  t=float(sys.argv[sys.argv.index('--still')+1]);raw=subprocess.check_output(['ffmpeg','-v','error','-ss',str(t),'-i',str(R/'public/source.mp4'),'-frames:v','1','-f','rawvideo','-pix_fmt','rgb24','-']);render_frame(Image.frombytes('RGB',(464,832),raw),t).save(O/f'director-{t:g}.png')
 else:render()
