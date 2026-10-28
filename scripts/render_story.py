"""Storytelling vettoriale animato, renderizzabile senza browser.
Ogni scena è in storyboard/scenes.json. Pillow disegna gli oggetti; FFmpeg compone il video.
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math,json,pathlib,subprocess,sys,functools,time
R=pathlib.Path(__file__).resolve().parents[1]; OUT=R/'out';OUT.mkdir(exist_ok=True)
SCENES=json.loads((R/'storyboard/scenes.json').read_text())
W,H,FPS,N=1080,960,30,3594
BG='#101b2b';INK='#294454';TEAL='#31b6a0';MINT='#9ce5c9';PURPLE='#8575da';LAV='#e2dcf5';GOLD='#efba58';SKIN='#edb494';MUTED='#aab6b6';RED='#dc7869';WHITE='#ffffff'
FONT='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';BOLD='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
@functools.lru_cache(None)
def font(n,b=True):return ImageFont.truetype(BOLD if b else FONT,n)
def clamp(x):return max(0,min(1,x))
def ease(x):x=clamp(x);return x*x*(3-2*x)
def mix(a,b,t):return a+(b-a)*t
def pos(a,b,t):return (mix(a[0],b[0],t),mix(a[1],b[1],t))
def rr(d,box,r,fill,outline=None,width=3):d.rounded_rectangle(tuple(map(int,box)),r,fill,outline,width)
def line(d,p,fill=INK,width=5):d.line(p,fill,width,joint='curve')
def circ(d,x,y,r,fill,outline=None,width=3):d.ellipse((x-r,y-r,x+r,y+r),fill,outline,width)
def text(im,x,y,s,size=32,col=INK,anchor='mm',bold=True):
 z=im.info.get('supersample',1);ImageDraw.Draw(im).text((x*z,y*z),s,font=font(round(size*z),bold),fill=col,anchor=anchor)
class HiDraw:
 def __init__(self,im,z):self.d=ImageDraw.Draw(im);self.z=z
 def coords(self,v):
  if isinstance(v,(list,tuple)):return [self.coords(x) for x in v]
  return v*self.z
 def __getattr__(self,name):
  def call(coords,*args,**kw):
   if 'width' in kw:kw['width']=round(kw['width']*self.z)
   if name=='line' and len(args)>=2:args=(args[0],round(args[1]*self.z))+args[2:]
   if name in ['ellipse','rectangle'] and len(args)>=3:args=args[:2]+(round(args[2]*self.z),)+args[3:]
   if name=='rounded_rectangle':
    args=(args[0]*self.z,)+args[1:]
    if len(args)>=4:args=args[:3]+(args[3]*self.z,)+args[4:]
   return getattr(self.d,name)(self.coords(coords),*args,**kw)
  return call
@functools.lru_cache(None)
def sprite(kind,state=0):
 im=Image.new('RGBA',(1080,1080));im.info['supersample']=3;d=HiDraw(im,3)
 if kind=='person':
  col=TEAL if state<10 else PURPLE
  # Adult editorial character, with layered clothing and sculpted features.
  d.ellipse((64,319,299,345),fill='#00000018')
  rr(d,(125,242,164,323),13,INK);rr(d,(198,242,237,323),13,INK)
  rr(d,(108,312,166,332),9,INK);rr(d,(198,312,259,332),9,INK)
  rr(d,(104,161,256,272),38,col)
  d.polygon([(158,161),(180,190),(202,161),(195,258),(164,258)],fill=WHITE)
  d.polygon([(154,160),(178,191),(158,213),(139,169)],fill='#208b80')
  d.polygon([(206,160),(182,191),(202,213),(221,169)],fill='#208b80')
  line(d,[(117,185),(91,229),(63,215)],col,29)
  line(d,[(243,185),(267,228),(295,206)],col,29)
  circ(d,63,215,13,SKIN);circ(d,295,206,13,SKIN)
  rr(d,(162,135,198,176),12,SKIN)
  circ(d,180,105,55,SKIN);circ(d,125,108,9,SKIN);circ(d,235,108,9,SKIN)
  d.pieslice((125,38,235,148),180,350,fill=INK)
  d.polygon([(127,103),(130,66),(158,46),(202,48),(231,69),(232,101),(216,81),(210,66),(178,80),(145,75),(139,105)],fill=INK)
  line(d,[(146,96),(164,93)],INK,3);line(d,[(197,93),(215,96)],INK,3)
  if state%10==1:
   line(d,[(150,108),(162,108)],INK,3);line(d,[(198,108),(210,108)],INK,3)
  else:
   circ(d,156,107,4,INK);circ(d,204,107,4,INK)
  line(d,[(180,107),(176,121),(183,122)],'#c88c75',2)
  d.arc((164,123,199,145),200 if state%10==2 else 15,340 if state%10==2 else 160,fill=INK,width=2)
 elif kind=='phone':
  rr(d,(79,12,282,344),32,INK);rr(d,(88,24,273,332),24,WHITE)
  rr(d,(143,28,219,42),7,INK);rr(d,(150,316,211,322),3,INK)
  # Abstract, recognisable feed tiles rather than written cards.
  rr(d,(103,60,258,181),14,LAV)
  circ(d,225,87,16,GOLD);d.polygon([(103,166),(148,106),(191,146),(212,125),(258,164),(258,181),(103,181)],fill=PURPLE)
  circ(d,115,200,10,TEAL);rr(d,(135,194,238,201),3,INK);rr(d,(135,207,208,212),2,MUTED)
  rr(d,(103,230,258,294),12,MINT)
  line(d,[(120,267),(144,252),(170,276),(194,244),(222,260),(241,247)],TEAL,5)
 elif kind=='notification':
  rr(d,(20,75,340,278),28,WHITE,INK,3)
  rr(d,(43,101,113,170),16,[MINT,LAV,'#f8dfac'][state%3]);cc=[TEAL,PURPLE,'#bc862d'][state%3]
  if state%3==0:
   rr(d,(58,118,97,149),7,cc);d.polygon([(67,146),(67,158),(81,146)],fill=cc)
  elif state%3==1:d.polygon([(70,115),(70,155),(100,135)],fill=cc)
  else:
   d.pieslice((60,116,97,159),180,360,fill=cc);rr(d,(60,135,97,151),4,cc);circ(d,79,157,5,cc)
  rr(d,(135,113,301,125),6,INK);rr(d,(135,141,254,150),4,MUTED);rr(d,(44,199,291,208),4,MUTED);rr(d,(44,227,230,236),4,'#dce4e1')
  circ(d,321,88,21,RED);circ(d,321,88,6,WHITE)
 elif kind=='chip':
  for i in range(5):
   q=91+i*44
   line(d,[(q,35),(q,71)],INK,8);line(d,[(q,289),(q,326)],INK,8);line(d,[(35,q),(71,q)],INK,8);line(d,[(289,q),(326,q)],INK,8)
  rr(d,(62,62,298,298),34,INK);rr(d,(83,83,277,277),24,PURPLE)
  for x,y in [(125,124),(235,124),(125,235),(235,235)]:circ(d,x,y,10,LAV)
  line(d,[(125,124),(179,179),(235,124)],LAV,5);line(d,[(125,235),(179,179),(235,235)],LAV,5)
  circ(d,180,179,28,WHITE);text(im,180,179,'IA',25,PURPLE)
 elif kind=='brain':
  # Lobes + connected nodes; the nodes animate independently in the scene.
  for cx,cy,rad in [(131,94,50),(217,94,50),(94,151,52),(258,151,52),(105,218,50),(246,218,50),(151,252,44),(205,252,44)]:circ(d,cx,cy,rad,LAV,INK,4)
  rr(d,(103,89,248,251),47,LAV)
  line(d,[(178,61),(178,280)],INK,4)
  for a,b in [((119,114),(139,157)),((139,157),(112,217)),((139,157),(150,234)),((225,114),(209,159)),((209,159),(241,218)),((209,159),(204,239))]:line(d,[a,b],PURPLE,5)
  for x,y in [(119,114),(139,157),(112,217),(150,234),(225,114),(209,159),(241,218),(204,239)]:circ(d,x,y,10,TEAL if state==0 else MUTED)
 elif kind=='building':
  rr(d,(70,42,290,318),17,INK);rr(d,(83,56,277,318),9,'#dbe5e0');rr(d,(148,265,211,320),5,TEAL)
  for i in range(3):
   for j in range(4):rr(d,(103+i*56,82+j*43,132+i*56,109+j*43),4,TEAL if (i+j)%2 else WHITE)
  line(d,[(40,321),(321,321)],INK,5)
 elif kind=='monitor':
  rr(d,(20,50,340,269),20,INK);rr(d,(33,64,327,243),10,WHITE)
  rr(d,(147,268,213,300),8,INK);rr(d,(106,300,254,311),6,INK)
  rr(d,(57,86,119,219),9,LAV)
  for j in range(3):rr(d,(141,86+j*45,302,118+j*45),7,'#e5eee9');circ(d,157,102+j*45,6,TEAL)
 elif kind=='book':
  d.polygon([(39,88),(153,69),(180,88),(207,69),(322,88),(322,287),(207,268),(180,287),(153,268),(39,287)],fill=WHITE,outline=INK,width=4)
  line(d,[(180,88),(180,287)],INK,4)
  for j in range(6):line(d,[(62,120+j*23),(143,106+j*23)],MUTED,4);line(d,[(212,106+j*23),(296,120+j*23)],MUTED,4)
 elif kind=='battery':
  rr(d,(30,105,316,249),23,WHITE,INK,6);rr(d,(317,148,337,207),8,INK)
  for i in range(5):rr(d,(49+i*50,125,88+i*50,229),8,TEAL if i<state else '#e1e7e1')
 elif kind=='task':
  rr(d,(65,27,295,334),20,WHITE,INK,4);rr(d,(123,15,236,50),10,TEAL)
  for j in range(4):
   rr(d,(89,88+j*54,117,116+j*54),5,LAV)
   rr(d,(136,92+j*54,265,101+j*54),4,INK);rr(d,(136,109+j*54,221,116+j*54),3,MUTED)
 elif kind=='quest':
  rr(d,(47,42,313,315),28,INK);rr(d,(60,55,300,302),19,LAV)
  circ(d,180,147,58,GOLD);d.polygon(star(180,147,39,18),fill=WHITE)
  rr(d,(95,229,263,248),9,WHITE);rr(d,(95,229,95+int(168*max(.2,state/5)),248),9,TEAL)
  circ(d,279,78,27,TEAL);line(d,[(265,79),(276,90),(293,68)],WHITE,6)
 elif kind=='trophy':
  d.polygon([(112,58),(249,58),(240,153),(224,193),(180,228),(135,193),(120,153)],fill=GOLD,outline=INK,width=4)
  d.arc((56,72,150,188),70,275,fill=INK,width=8);d.arc((210,72,306,188),265,110,fill=INK,width=8)
  rr(d,(166,218,195,279),7,INK);rr(d,(117,276,247,307),12,INK)
  d.polygon(star(180,126,36,17),fill=WHITE)
 elif kind=='coin':
  circ(d,180,180,105,GOLD,INK,7);circ(d,180,180,85,None,'#fff2cc',5);d.polygon(star(180,180,57,26),fill=WHITE)
 elif kind=='check':
  circ(d,180,180,110,TEAL);line(d,[(120,179),(162,220),(244,136)],WHITE,19)
 elif kind=='heart':
  circ(d,140,144,51,RED);circ(d,220,144,51,RED);d.polygon([(90,153),(270,153),(180,280)],fill=RED)
 elif kind=='play':circ(d,180,180,109,PURPLE);d.polygon([(151,114),(151,247),(248,180)],fill=WHITE)
 elif kind=='house':
  d.polygon([(50,150),(180,45),(310,150)],fill=GOLD,outline=INK,width=5);rr(d,(78,143,282,307),7,WHITE,INK,4);rr(d,(153,217,209,308),6,TEAL);rr(d,(101,170,138,209),5,LAV);rr(d,(222,170,259,209),5,LAV)
 elif kind=='puzzle':
  rr(d,(73,73,286,286),20,PURPLE);circ(d,179,73,34,PURPLE);circ(d,73,179,34,LAV);circ(d,286,179,34,PURPLE);circ(d,179,286,34,LAV)
 elif kind=='clock':
  circ(d,180,180,111,WHITE,INK,7);line(d,[(180,97),(180,180),(235,209)],INK,9);circ(d,180,180,10,TEAL)
 return im

def star(cx,cy,r1,r2,n=5):return [(cx+math.cos(-math.pi/2+i*math.pi/n)*(r1 if i%2==0 else r2),cy+math.sin(-math.pi/2+i*math.pi/n)*(r1 if i%2==0 else r2)) for i in range(2*n)]

@functools.lru_cache(maxsize=512)
def scaled(kind,state,size):return sprite(kind,state).resize((size,size),Image.Resampling.LANCZOS)
def put(im,kind,x,y,size=300,state=0,rot=0,alpha=1):
 if size<2 or alpha<=0:return
 p=scaled(kind,state,int(size))
 if rot:p=p.rotate(rot,Image.Resampling.BICUBIC,expand=True)
 if alpha<1:p=p.copy();p.putalpha(p.getchannel('A').point(lambda q:int(q*alpha)))
 shadow=Image.new('RGBA',p.size,(0,0,0,0));shadow.putalpha(p.getchannel('A').point(lambda v:v//5));shadow=shadow.filter(ImageFilter.GaussianBlur(7))
 im.alpha_composite(shadow,(round(x-p.width/2)+3,round(y-p.height/2)+10))
 im.alpha_composite(p,(round(x-p.width/2),round(y-p.height/2)))
def dotline(im,a,b,t,col=TEAL,width=5,dashed=False):
 d=ImageDraw.Draw(im);b=pos(a,b,clamp(t))
 if dashed:
  dist=math.dist(a,b);n=max(1,int(dist/22))
  for i in range(n):line(d,[pos(a,b,i/n),pos(a,b,min(1,(i+.5)/n))],col,width)
 else:line(d,[a,b],col,width)
 circ(d,*b,width/2,col)
def route(im,points,t,col=TEAL,width=7):
 n=len(points)-1
 for i in range(n):
  p=clamp(t*n-i)
  if p>0:dotline(im,points[i],points[i+1],p,col,width)
def token(im,kind,a,b,t,size=70,state=0):
 if 0<=t<=1:
  x,y=pos(a,b,ease(t));y-=55*math.sin(t*math.pi);put(im,kind,x,y,size,state=state)
def sparkle(im,x,y,r=16,col=GOLD):
 d=ImageDraw.Draw(im);d.polygon([(x,y-r),(x+r*.22,y-r*.22),(x+r,y),(x+r*.22,y+r*.22),(x,y+r),(x-r*.22,y+r*.22),(x-r,y),(x-r*.22,y-r*.22)],fill=col)
import numpy as np
_y,_x=np.mgrid[0:H,0:W];_glow=np.exp(-(((_x-540)/600)**2+((_y-510)/430)**2))
_rgb=np.empty((H,W,4),dtype=np.uint8)
for _c,(_lo,_hi) in enumerate([(13,29),(22,49),(36,67)]):_rgb[:,:,_c]=_lo+(_hi-_lo)*_glow
_rgb[:,:,3]=255
base=Image.fromarray(_rgb,'RGBA');d=ImageDraw.Draw(base)
for xx in range(70,1080,60):
 for yy in range(290,820,60):circ(d,xx,yy,1,'#29394b')
d.ellipse((155,780,930,824),fill='#142536')


def frame(t):
 scene=next((s for s in SCENES if s['start']<=t<s['end']),SCENES[-1]);i=SCENES.index(scene);u=t-scene['start'];dur=scene['end']-scene['start'];p=clamp(u/dur);k=scene['kind'];im=base.copy();d=ImageDraw.Draw(im)
 # Chapter marks and very short titles. Everything below is told by moving objects.
 for j in range(5):
  rr(d,(64+j*196,62,232+j*196,68),3,TEAL if j<=scene['chapter'] else '#2a3a4b')
 title_y=151+18*(1-ease(u/.45))
 text(im,540,title_y,scene['title'].capitalize() if k!='end' else scene['title'],39 if len(scene['title'])>25 else 46,'#f4f5f7')
 text(im,540,220,['L’ECONOMIA DELL’ATTENZIONE','IL FEED SU MISURA','IL COSTO DELLA DELEGA','PROGETTARE IL COINVOLGIMENTO','ACHIVIA'][scene['chapter']],16,'#7c9aaa',bold=False)

 bob=math.sin(t*2.5)*5;blink=1 if t%4.6>4.43 else (2 if scene['chapter']<3 else 0)
 enter=ease(u/.6)
 if k in ['notifications','attention','fragment']:
  put(im,'person',530,598+bob,420,state=blink)
  if k=='notifications':
   spots=[(245,415),(825,422),(240,674),(822,672),(540,332)]
   for j,(x,y) in enumerate(spots):
    q=ease((u-j*.38)/.7);put(im,'notification',mix(530,x,q),mix(560,y,q)+math.sin(t*2+j)*9,210+int(25*q),j%3,rot=math.sin(t+j)*4,alpha=q)
   for j in range(5):sparkle(im,150+j*185,340+math.sin(t+j)*17,7)
  elif k=='attention':
   put(im,'phone',830,548,300,rot=-6+math.sin(u)*3)
   for j in range(7):
    phase=(u*.45+j/7)%1;dotline(im,(650,480),(805,450+80*math.sin(j)),1,'#44616e',2);circ(d,mix(650,800,phase),mix(480,450+80*math.sin(j),phase),5,TEAL)
   d.arc((312,378,746,810),205,335,fill=TEAL,width=9)
  else:
   put(im,'phone',817,540,285,rot=-8)
   for j in range(12):
    ang=j*math.pi/6;radius=155+85*ease(p);a=(530+math.cos(ang)*radius,570+math.sin(ang)*radius)
    d.arc((a[0]-24,a[1]-24,a[0]+24,a[1]+24),j*30,j*30+70,fill=PURPLE if j%2 else TEAL,width=7)
    if j%3==0:put(im,'notification',mix(530,180 if j%2 else 870,clamp(p)),340+j*26,150,j%3,alpha=.8)
 elif k=='company':
  put(im,'building',540,460,350)
  put(im,'phone',235,685,230,rot=-8);put(im,'person',835,675,285,state=blink+10)
  route(im,[(440,560),(300,580),(235,620)],ease(u/1.3))
  route(im,[(645,560),(775,580),(835,620)],ease((u-.4)/1.3),PURPLE)
  for j in range(3):token(im,'notification',(420,530),(235,650),(u*.5+j/3)%1,100,j)
  for j in range(3):
   a=u*2+j*math.tau/3;circ(d,835+math.cos(a)*92,660+math.sin(a)*92,6,PURPLE)
  text(im,230,835,'CONSUMATORI',21,TEAL);text(im,835,835,'LAVORATORI',21,PURPLE)
 elif k=='roles':
  rr(d,(65,310,509,830),28,'#e7efe4');rr(d,(531,310,1015,830),28,'#e8e4f1')
  put(im,'person',285,610,400,state=blink);put(im,'person',750,610,400,state=blink)
  put(im,'phone',405,600,180,rot=-8);put(im,'monitor',875,676,220)
  for j in range(3):put(im,'notification',150+25*j,415+j*50+math.sin(t+j)*8,130,j)
  circ(d,875,540,45,None,PURPLE,5);circ(d,875,540,24,None,PURPLE,4)
  text(im,285,343,'DISTRATTI',25,TEAL);text(im,770,343,'ATTENTI',25,PURPLE)
 elif k=='merge':
  q=ease(u/1.4);put(im,'person',mix(260,540,q),610,400,state=blink,alpha=1-q*.7);put(im,'person',mix(820,540,q),610,400,state=blink+10,alpha=1-q*.7)
  put(im,'person',540,610,400,state=blink,alpha=q)
  put(im,'phone',mix(175,250,q),500+bob,240,rot=12*q);put(im,'monitor',mix(900,835,q),550-bob,255)
  if q>.8:circle_pulse(im,540,570,230,u,TEAL)
 elif k=='amplifier':
  put(im,'chip',540,550,330,rot=math.sin(u)*3)
  for j in range(9):
   q=clamp((u-j*.18)/2);a=j*math.tau/9;rad=mix(50,350,q);put(im,'notification',540+math.cos(a)*rad,560+math.sin(a)*rad*.64,100+int(45*q),j%3,rot=math.sin(t+j)*7,alpha=q)
  circle_pulse(im,540,550,200,u,PURPLE)
 elif k=='personalize':
  put(im,'person',180,590,310,state=blink);put(im,'chip',535,555,285);put(im,'phone',895,555,320)
  for j,kind in enumerate(['heart','play','coin']):token(im,kind,(220,530+j*37),(485,550),((u*.5-j*.22)%1),75)
  for j in range(3):token(im,'notification',(610,550),(850,540),(u*.5-j*.3)%1,110,j%3)
  dotline(im,(270,730),(800,730),ease(u/1.5),TEAL,4)
 elif k=='feed':
  put(im,'person',212,630,370,state=blink)
  put(im,'phone',665,545,495,rot=math.sin(u*.8)*2)
  for j,kind in enumerate(['heart','play','coin']):
   q=(u*.32+j/3)%1;x=mix(290,535,q);y=460+j*100-60*math.sin(q*math.pi);put(im,kind,x,y,110*(1-.3*q),alpha=1-.4*q)
  for j in range(4):sparkle(im,880+30*math.sin(t+j),390+j*95,11+3*math.sin(t*3+j),PURPLE if j%2 else GOLD)
 elif k in ['contrast','drain']:
  rr(d,(70,320,510,830),25,LAV);rr(d,(530,320,1010,830),25,'#e5e6dd')
  put(im,'phone',285,565,430,rot=math.sin(t)*3)
  put(im,'book',770,570,365,alpha=1-(.4*p if k=='drain' else .12))
  if k=='contrast':
   for j in range(5):sparkle(im,110+j*80,400+math.sin(t+j)*20,10,GOLD)
   put(im,'clock',880,740,120,rot=math.sin(t)*10)
  else:
   for j in range(8):
    q=(u*.35+j/8)%1;circ(d,mix(800,300,q),580+math.sin(q*math.pi)*-150,8,TEAL)
   circle_pulse(im,285,565,195,u,PURPLE)
 elif k in ['offload','thought']:
  put(im,'brain',260,555,405);put(im,'chip',815,555,360)
  dotline(im,(425,555),(645,555),ease(u/.8),PURPLE,5,True)
  for j in range(5 if k=='thought' else 3):
   q=clamp((u-(max(0,72.56-scene['start']) if k=='thought' else .4)-j*.35)/2.3);token(im,'task' if k=='offload' else 'puzzle',(255+(j%2)*45,490+(j//2)*48),(790+(j%2)*37,495+(j//2)*50),q,85)
  for j in range(4):
   q=clamp((u-j*.3)/2.4);circ(d,230+(j%2)*68,515+(j//2)*83,8,TEAL)
  circle_pulse(im,815,555,180,u,PURPLE)
 elif k=='energy':
  put(im,'brain',540,490,430)
  level=max(1,5-int(p*4));put(im,'battery',540,750,350,state=level)
  for j in range(4):
   q=(u*.65+j/4)%1;circ(d,540+math.sin(q*8)*30,mix(690,550,q),7,GOLD)
  circle_pulse(im,540,480,212,u,PURPLE)
 elif k=='shortcut':
  put(im,'brain',160,555,245);put(im,'chip',900,555,245)
  pts=[(290,550),(365,350),(470,350),(470,735),(630,735),(630,350),(735,350),(790,550)]
  route(im,pts,ease(u/2),MUTED,7)
  if u>1:route(im,[(290,550),(790,550)],ease((u-1)/1.2),TEAL,12)
  q=(u*.4)%1;circ(d,mix(300,780,q),550,13,GOLD)
  circ(d,540,550,14,TEAL)
 elif k=='delegate':
  put(im,'person',230,610,400,state=blink);put(im,'monitor',820,590,385)
  token(im,'task',(270,450),(800,470),clamp(u/2.4),175)
  if u>2:put(im,'check',815,528,120*ease((u-2)/.5))
 elif k=='tools':
  put(im,'brain',540,540,370)
  for j,kind in enumerate(['task','monitor','clock']):
   a=-math.pi/2+j*math.tau/3;x=540+math.cos(a)*330;y=560+math.sin(a)*245
   put(im,kind,x,y,210+int(5*math.sin(t+j)));token(im,'puzzle',(540,540),(x,y),(u*.25+j/3)%1,55)
 elif k=='plastic':
  put(im,'brain',540,550,620,state=1 if p>.6 else 0)
  nodes=[(429,453),(474,530),(410,638),(490,669),(635,453),(604,533),(668,640),(604,675)]
  for j,(x,y) in enumerate(nodes):
   q=1-ease((u-j*.13)/3);circ(d,x,y,11+int(q*7),TEAL if q>.4 else MUTED)
   if j<len(nodes)-1:dotline(im,(x,y),nodes[j+1],q,TEAL if q>.4 else '#b8bdb8',3)
  put(im,'clock',850,745,155,rot=-u*12)
 elif k=='idle':
  put(im,'brain',350,535,420,state=1);put(im,'book',770,620,320,rot=10)
  put(im,'clock',775,410,180,rot=-u*18)
  for j in range(3):
   q=(u*.5+j/3)%1;circ(d,400+j*45,355-q*85,6,('#c4c8c1'))
 elif k in ['flip','gamification']:
  q=ease(u/(2.7 if k=='flip' else 2.2));x=mix(270,780,q)
  put(im,'task',300,560,360*(1-.45*q),rot=-8*q,alpha=1-.65*q)
  put(im,'quest',780,560,390*(.5+.5*q),state=3,rot=5*(1-q),alpha=q)
  route(im,[(440,560),(640,560)],q,TEAL,7)
  put(im,'puzzle',x,560-90*math.sin(q*math.pi),90,rot=q*180)
  if k=='gamification':
   for j in range(4):put(im,'coin',200+j*220,775-30*math.sin(t+j),100,alpha=ease((u-j*.2)/.5))
  if q>.8:
   for j in range(5):sparkle(im,650+j*60,350+math.sin(j*2)*40,12*ease((q-.8)*5))
 elif k=='journey':
  pts=[(140,745),(315,665),(505,700),(695,515),(875,390)];route(im,pts,1,'#496173',14);route(im,pts,ease(p),TEAL,14)
  for j,(x,y) in enumerate(pts):
   circ(d,x,y,29,TEAL if p*4>=j else WHITE,TEAL,4)
   if p*4>=j:line(d,[(x-11,y),(x-2,y+10),(x+14,y-12)],WHITE,5)
   if j<4:put(im,'coin',x,y-78,75,alpha=1 if p*4<j else .18)
  step=min(3,int(p*4));q=p*4-step;loc=pos(pts[step],pts[step+1],q)
  put(im,'person',loc[0],loc[1]-115+math.sin(u*9)*5,260,state=blink)
  put(im,'trophy',900,346,190,rot=math.sin(t)*4)
 elif k=='feedback':
  centers=[(245,550),(540,400),(830,590)];route(im,[(245,550),(540,400),(830,590),(540,785),(245,550)],1,'#496173',6)
  for j,kind in enumerate(['task','check','coin']):put(im,kind,*centers[j],260 if j==0 else 220,rot=math.sin(u*2+j)*3)
  q=(u*.45)%1;points=centers+[(540,785),centers[0]];n=int(q*4);xy=pos(points[n],points[n+1],(q*4)%1);circ(d,*xy,13,TEAL)
  sparkle(im,865,450,18+6*math.sin(u*6))
 elif k=='team':
  put(im,'quest',540,460,345,state=4)
  for j,x in enumerate([230,540,850]):
   put(im,'person',x,720+math.sin(u*4+j)*8,310,state=blink+(10 if j==1 else 0));token(im,'check',(x,650),(540,450),(u*.5+j*.2)%1,60)
 elif k in ['app','dashboard']:
  # A visual model of the app, deliberately not a fabricated screenshot.
  rr(d,(95,305,985,820),32,INK);rr(d,(110,353,970,804),17,WHITE)
  for j in range(3):circ(d,125+j*20,329,4,[RED,GOLD,MINT][j])
  rr(d,(128,376,280,780),15,'#e9eee7')
  for j in range(5):rr(d,(150,405+j*65,255,421+j*65),7,TEAL if j==1 else '#bdc9c1')
  if k=='app':
   for j in range(3):
    q=ease((u-j*.48)/2.0);xx=410+j*215;put(im,'task',xx,560,185,alpha=1-q,rot=-10*q);put(im,'quest',xx,560,185,state=j+2,alpha=q,rot=10*(1-q))
    if q>.7:put(im,'coin',xx,745-50*ease((q-.7)/.3),76,alpha=ease((q-.7)/.3))
  else:
   for j in range(3):
    yy=410+j*110;rr(d,(318,yy,928,yy+80),15,'#edf1e9');put(im,'check',355,yy+40,65,alpha=ease((u-.2-j*.4)/.6))
    rr(d,(410,yy+23,895,yy+37),7,'#d5ded3');rr(d,(410,yy+23,410+int(485*ease((u-j*.4)/2.8)),yy+37),7,TEAL)
    rr(d,(410,yy+50,650,yy+57),3,MUTED)
   put(im,'coin',865,355,95+int(6*math.sin(u*5)))
 elif k=='everyday':
  put(im,'house',230,500,350);put(im,'building',850,500,350)
  pts=[(240,670),(350,760),(540,685),(730,760),(850,670)];route(im,pts,1,'#c5d8c9',9)
  for j in range(5):
   xx,yy=pts[j];put(im,'coin' if j%2 else 'check',xx,yy,85+int(5*math.sin(t*3+j)))
  put(im,'quest',540,470,290,state=4,rot=math.sin(t)*3)
 elif k=='end':
  put(im,'trophy',540,460,365,rot=math.sin(u*1.6)*4)
  for j in range(5):put(im,'person',230+j*155,739+math.sin(u*2+j)*5,200,state=(10 if j%2 else 0)+blink,alpha=ease((t-116.46-j*.08)/.35))
  if t>=117.72:text(im,540,622,'BETA TEST',22,'#9ce5c9')
  for j in range(9):
   a=j*math.tau/9+u*.22;xx=540+math.cos(a)*310;yy=470+math.sin(a)*170;sparkle(im,xx,yy,8+3*math.sin(u*4+j),PURPLE if j%2 else GOLD)

 # Gentle camera drift adds continuity while preserving clear framing.
 q=1+.014*math.sin(math.pi*clamp(p))
 cropw=int(W/q);croph=int(H/q)
 im=im.crop(((W-cropw)//2,(H-croph)//2,(W+cropw)//2,(H+croph)//2)).resize((W,H),Image.Resampling.LANCZOS)
 if u<.32 and i>0:
  previous=frame(scene['start']-.001).convert('RGBA')
  im=Image.blend(previous,im,ease(u/.32))
 return im.convert('RGB')

def circle_pulse(im,x,y,r,t,col):
 d=ImageDraw.Draw(im)
 for j in range(2):
  q=(t*.45+j*.5)%1;rc=r+q*45;fade=clamp(1-q);rgb=ImageColor(col);bg=ImageColor(BG);c=tuple(int(mix(bg[k],rgb[k],fade*.5)) for k in range(3));circ(d,x,y,rc,None,c,2)
def ImageColor(c):return tuple(int(c[k:k+2],16) for k in (1,3,5))

def render():
 target=OUT/'story-top.mp4'
 cmd=['ffmpeg','-y','-hide_banner','-loglevel','error','-f','rawvideo','-vcodec','rawvideo','-pix_fmt','rgb24','-s','1080x960','-r','30','-i','-','-an','-c:v','libx264','-preset','fast','-crf','19','-pix_fmt','yuv420p','-movflags','+faststart',str(target)]
 proc=subprocess.Popen(cmd,stdin=subprocess.PIPE);start=time.monotonic()
 try:
  for n in range(N):
   proc.stdin.write(frame(n/FPS).tobytes())
   if n%300==0:print(f'{n}/{N} frames · {time.monotonic()-start:.0f}s',flush=True)
 finally:proc.stdin.close()
 if proc.wait():raise RuntimeError('FFmpeg non ha completato il render')
 import shutil
 shutil.copyfile(target,R/'public/story-top.mp4')
 print(target,flush=True)
if __name__=='__main__':
 if '--still' in sys.argv:
  ti=float(sys.argv[sys.argv.index('--still')+1]);frame(ti).save(OUT/f'story-{ti:g}.png')
 else:render()
