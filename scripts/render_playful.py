"""Illustrated editorial cut. Reuses decoding, face framing and audio mastering only.
Run from the repository: python3 scripts/render_playful.py [--stills].
"""
import render_director as core
from render_director import Image,ImageDraw,ImageFilter,math,np,json,subprocess,sys
from render_director import ease,clamp,lerp,font,rr,circle,ln,route,arrow
INK='#152645';BLUE='#3758ee';ORANGE='#ef7e4b';MINT='#51bfa3';PAPER='#f4f0e7';LINE='#d8dbe3';WHITE='#ffffff'
ROOT=core.R
SC=json.loads((ROOT/'storyboard/playful.json').read_text())
core.SC=SC

def text(im,x,y,s,size=36,c=INK,anchor='mm'):
 ImageDraw.Draw(im).text((x,y),s,font=font(size),fill=c,anchor=anchor)
def box(im,b,fill=WHITE,r=26,outline=None):
 d=ImageDraw.Draw(im);x,y,X,Y=b;rr(d,(x+3,y+10,X+3,Y+10),r,'#e0dfdc');rr(d,b,r,fill,outline)
def star(im,x,y,r=30,c=ORANGE):
 pts=[(x+math.sin(i*math.pi/5)*(r if i%2==0 else r*.46),y-math.cos(i*math.pi/5)*(r if i%2==0 else r*.46)) for i in range(10)]
 ImageDraw.Draw(im).polygon(pts,fill=c)
def brain(im,x,y,s=1,t=0,tired=False):
 d=ImageDraw.Draw(im);col='#b9b7ce' if tired else '#c6b7f3'
 # Lobed, intentionally schematic brain; animated expression is a visual metaphor.
 for xx,yy,r in [(-62,-40,64),(0,-63,66),(63,-38,61),(-70,28,62),(0,44,72),(70,26,59)]:circle(d,x+xx*s,y+yy*s,r*s,col,None)
 for side in [-1,1]:
  xx=x+side*48*s;d.arc((xx-30*s,y-57*s,xx+30*s,y+35*s),-80,120,fill='#8c78bd',width=max(2,round(s*5)))
 blink=(t%3.7)>.0 and (t%3.7)<.11
 for xx in [x-28*s,x+28*s]:
  if tired or blink:ln(d,[(xx-9*s,y+15*s),(xx+9*s,y+15*s)],INK,max(2,round(5*s)))
  else:circle(d,xx,y+14*s,7*s,INK,None)
 d.arc((x-20*s,y+20*s,x+20*s,y+49*s),0,180,fill=INK,width=max(2,round(s*4)))
 ln(d,[(x,y-80*s),(x,y-15*s)],'#8c78bd',max(2,round(4*s)))
def task(im,x,y,s=1,done=False):
 box(im,(x-70*s,y-88*s,x+70*s,y+88*s),r=16)
 d=ImageDraw.Draw(im)
 for j in range(3):
  yy=y-48*s+j*46*s;rr(d,(x-46*s,yy-8*s,x-28*s,yy+10*s),3,MINT if done else LINE)
  ln(d,[(x-12*s,yy),(x+45*s,yy)],INK,max(2,round(4*s)))
 if done:text(im,x,y,'✓',int(74*s),MINT)
def phone(im,x,y,s=1,t=0,chosen=False):
 box(im,(x-135*s,y-235*s,x+135*s,y+235*s),INK,38*s)
 d=ImageDraw.Draw(im);rr(d,(x-119*s,y-199*s,x+119*s,y+208*s),26*s,'#e8edff')
 rr(d,(x-43*s,y-222*s,x+43*s,y-210*s),5*s,'#71809c')
 for j in range(3):
  yy=y-138*s+j*112*s;rr(d,(x-100*s,yy,x+100*s,yy+93*s),12*s,[BLUE,MINT,ORANGE][j])
  if j==0:d.polygon([(x-14*s,yy+24*s),(x-14*s,yy+70*s),(x+28*s,yy+47*s)],fill=WHITE)
  elif j==1:star(im,x,yy+46*s,25*s,WHITE)
  else:
   for k in range(3):circle(d,x+(k-1)*32*s,yy+46*s,8*s,WHITE,None)
 if chosen:
  circle(d,x+125*s,y-205*s,38*s,ORANGE,None);text(im,x+125*s,y-205*s,'✓',int(40*s),WHITE)
def tile(im,x,y,label,j=0,s=1):
 box(im,(x-155*s,y-48*s,x+155*s,y+48*s),r=19*s)
 d=ImageDraw.Draw(im);circle(d,x-110*s,y,24*s,[BLUE,ORANGE,MINT][j%3],None)
 if j%3==1:d.polygon([(x-118*s,y-11*s),(x-118*s,y+11*s),(x-100*s,y)],fill=WHITE)
 else:ln(d,[(x-122*s,y),(x-99*s,y)],WHITE,3)
 text(im,x-65*s,y,label,int(27*s),anchor='lm')
def token(im,a,b,q,col=BLUE):
 q=clamp(q);x=lerp(a[0],b[0],q);y=lerp(a[1],b[1],q)-40*math.sin(math.pi*q);circle(ImageDraw.Draw(im),x,y,13,col,None)
def bust(im,x,y,s=1,c=BLUE):
 d=ImageDraw.Draw(im);circle(d,x,y-48*s,42*s,'#edbf9b',None);rr(d,(x-72*s,y,x+72*s,y+100*s),36*s,c)
 ln(d,[(x-17*s,y-48*s),(x-10*s,y-48*s)],INK,4);ln(d,[(x+10*s,y-48*s),(x+17*s,y-48*s)],INK,4)
def graphic(k,u,dur):
 im=Image.new('RGBA',(1000,1000));d=ImageDraw.Draw(im);p=clamp(u/dur)
 if k=='focus':
  brain(im,500,450,2.0,u,True)
  # Segments represent fragmented focus, not a numeric research claim.
  for j in range(8):
   a=j*math.tau/8;rad=290+ease(p)*80
   x=500+math.cos(a)*rad;y=450+math.sin(a)*rad
   circle(d,x,y,22,ORANGE if j%2 else BLUE,None)
   token(im,(500,450),(x,y),(u*.23+j*.13)%1,ORANGE)
  text(im,500,900,'FOCUS DISPERSO',43)
 elif k=='distraction':
  brain(im,500,500,1.25,u)
  positions=[(260,180),(740,310),(240,730),(720,850)]
  for j,((x,y),lab) in enumerate(zip(positions,['Messaggi','Video','Notifiche','Social'])):
   q=ease((u-j*.22)/.55);x=lerp(500,x,q);y=lerp(500,y,q)
   route(im,[(x,y),(500,500)],1,LINE,5);tile(im,x,y,lab,j,.92)
   token(im,(500,500),(x,y),(u*.28+j*.25)%1,ORANGE)
 elif k in ['roles','contrast','drain']:
  for j in range(2):
   if k=='roles' and j==1 and u<1.28:continue
   y=240+j*480;box(im,(70,y-170,930,y+200));text(im,500,y-115,('CONSUMATORE' if j==0 else 'LAVORATORE') if k=='roles' else ('FEED SU MISURA' if j==0 else 'ATTIVITÀ QUOTIDIANE'),31)
   if k=='roles':
    bust(im,285,y+10,.85,BLUE if j==0 else MINT)
    if j==0:phone(im,680,y+25,.5,u)
    else:task(im,680,y+25,.9)
   else:
    if j==0:phone(im,300,y+25,.5,u,True);star(im,660,y+30,70+5*math.sin(u*2))
    else:task(im,300,y+25,.95);brain(im,665,y+30,.65,u,True)
 elif k in ['amplify','personalize','feed']:
  if k=='amplify':
   box(im,(340,310,660,640),BLUE,60);text(im,500,470,'IA',100,WHITE)
   for j in range(6):
    a=j*math.tau/6;rad=300*ease((u-j*.12)/1);x=500+math.cos(a)*rad;y=490+math.sin(a)*rad
    tile(im,x,y,'',j,.65);token(im,(500,490),(x,y),(u*.35+j*.15)%1)
  elif k=='personalize':
   bust(im,210,260,1.1);box(im,(620,145,880,375),BLUE);text(im,750,260,'IA',65,WHITE)
   arrow(im,(330,260),(585,260),ease(u/.8),BLUE)
   for j in range(3):
    x=230+j*270;arrow(im,(750,410),(x,560),ease((u-.55)/1),LINE);phone(im,x,755,.62,u,j==1)
  else:
   phone(im,500,490,1.5,u,True)
   for j in range(3):star(im,190 if j%2==0 else 825,300+j*230,25+5*math.sin(u*2+j),ORANGE)
 elif k in ['offload','energy','shortcut','delegate','tools','thought','plastic','risk']:
  if k=='energy':
   brain(im,500,300,1.6,u);box(im,(175,630,825,820));rr(d,(825,685,850,765),9,INK)
   for j in range(6):rr(d,(200+j*100,660,278+j*100,790),12,ORANGE if j<6-int(p*5) else LINE)
   text(im,500,920,'ENERGIA MENTALE',30)
  elif k=='shortcut':
   brain(im,170,490,.8,u);phone(im,850,490,.65,u)
   pts=[(300,490),(350,180),(530,180),(530,800),(680,800),(720,490)]
   route(im,pts,1,LINE,13);arrow(im,(300,490),(715,490),ease(u/.9),BLUE);token(im,(300,490),(715,490),(u*.28)%1)
   text(im,500,915,'MENO SFORZO',32)
  elif k in ['plastic','risk']:
   brain(im,500,450,2.2,u,k=='risk')
   for j in range(8):
    a=j*math.tau/8;x=500+math.cos(a)*340;y=450+math.sin(a)*320
    route(im,[(500,450),(x,y)],ease((u-j*.1)/.8),LINE if k=='risk' else '#b2a1db',4)
    circle(d,x,y,17,LINE if k=='risk' else BLUE,None)
   text(im,500,920,'SI ADATTA ALL’USO' if k=='plastic' else 'RISCHIO: MENO ESERCIZIO',31)
  elif k=='tools':
   brain(im,500,240,1.35,u)
   for j,lab in enumerate(['Memoria','Calcolo','Compiti']):
    x=210+j*290;arrow(im,(500,390),(x,650),ease((u-j*.2)/.8),LINE);task(im,x,750,1.2);text(im,x,920,lab,28)
  else:
   brain(im,225,420,1.2,u);phone(im,790,430,.85,u);arrow(im,(390,430),(620,430),ease(u/.65),BLUE)
   for j in range(3):
    q=ease((u-j*.6)/1.5);x=lerp(300,735,q);y=580-110*math.sin(q*math.pi)
    if k=='thought':brain(im,x,y,.35,u)
    else:task(im,x,y,.45)
   text(im,225,750,'NOI',32);text(im,790,750,'STRUMENTO',32)
   text(im,500,900,'COMPITI' if k!='thought' else 'IL PENSIERO?',48,ORANGE)
 elif k in ['gamification','journey','feedback','engagement','everyday']:
  if k=='gamification':
   q=ease((u-.35)/1.7)
   if q<.6:task(im,lerp(220,500,q),450,1.5+q)
   else:
    grow=ease((q-.6)/.4);w=220+grow*320;h=350+grow*170
    box(im,(500-w/2,450-h/2,500+w/2,450+h/2),BLUE,35)
    text(im,500,265,'LA TUA MISSIONE',33,WHITE)
    star(im,500,420,85+8*math.sin(u*2),ORANGE)
    rr(d,(300,580,700,605),12,'#7187f2');rr(d,(300,580,300+400*grow,605),12,MINT)
    text(im,500,660,'✓ COMPLETATA',28,WHITE)
    for j in range(8):
     a=j*math.tau/8;star(im,500+math.cos(a)*370,450+math.sin(a)*350,20,BLUE if j%2 else ORANGE)
   text(im,500,900,'ATTIVITÀ → MISSIONE',42)
  elif k=='journey':
   pts=[(180,800),(410,660),(680,540),(450,310),(760,160)];route(im,pts,1,LINE,22);route(im,pts,ease(p),BLUE,22)
   for j,(x,y) in enumerate(pts):
    done=p*4>=j;circle(d,x,y,53,MINT if done else WHITE,LINE,3);text(im,x,y,'✓' if done else str(j+1),44,WHITE if done else INK)
   q=p*4;i=min(3,int(q));x=lerp(pts[i][0],pts[i+1][0],q-i);y=lerp(pts[i][1],pts[i+1][1],q-i);star(im,x,y-90,40,ORANGE)
  elif k=='feedback':
   pts=[(500,180),(790,650),(210,650)];labs=['AZIONE','FEEDBACK','MOTIVAZIONE']
   for j in range(3):arrow(im,pts[j],pts[(j+1)%3],1,LINE)
   for j,((x,y),lab) in enumerate(zip(pts,labs)):
    circle(d,x,y,110,BLUE if j==1 else WHITE,None);text(im,x,y,lab,25,WHITE if j==1 else INK)
   q=(u*.25)%1*3;i=int(q);token(im,pts[i],pts[(i+1)%3],q-i,ORANGE)
   star(im,500,460,50)
  elif k=='engagement':
   for j in range(3):
    x=220+j*280;bust(im,x,570-20*ease((u-j*.2)/.5),1.2,[BLUE,MINT,ORANGE][j]);star(im,x,330,40*ease((u-j*.2)/.5))
   text(im,500,860,'PARTECIPARE',44)
  else:
   for j,lab in enumerate(['OGNI GIORNO','AL LAVORO']):
    y=230+j*470;box(im,(80,y-150,920,y+210));task(im,270,y+20,1.15,True);arrow(im,(410,y+20),(640,y+20),ease(u/.8),BLUE);star(im,755,y+20,65);text(im,500,y-90,lab,30)
 return im

LAY={'full':(0,0,1080,1920,0),'app':(0,0,1080,1920,0),'left':(45,490,435,1000,45),'right':(535,490,435,1000,45),'circle':(75,1180,330,330,165),'pip':(650,1140,300,410,38)}
REG={'left':(490,540,485),'right':(35,540,485),'circle':(75,300,885),'pip':(75,300,885)}
BASE=Image.new('RGBA',(1080,1920),PAPER)
def frame(src,t):
 i=next((i for i,s in enumerate(SC) if s['start']<=t<s['end']),len(SC)-1);s=SC[i];u=t-s['start'];dur=s['end']-s['start'];mode=s['layout'];q=ease(u/.4);im=BASE.copy()
 dest=LAY[mode];rect=tuple(lerp(a,b,q) for a,b in zip(LAY[SC[i-1]['layout']],dest)) if i and q<1 else dest
 tileim,xy=core.presenter(src,rect,t,mode=='app',1+.045*ease(u/dur))
 if mode not in ['full','app']:
  d=ImageDraw.Draw(im);phase=0 if t<24.26 else 1 if t<82.06 else 2
  for j in range(3):rr(d,(75+j*292,130,330+j*292,137),3,BLUE if j==phase else LINE)
  text(im,75,185,['01 / ATTENZIONE','02 / INTELLIGENZA ARTIFICIALE','03 / DAL COMPITO AL GIOCO'][phase],21,anchor='lm')
  title=s['title'];size=57
  while d.textlength(title,font=font(size))>885:size-=1
  text(im,75,265,title,size,anchor='lm')
  x,y,size=REG[mode];art=graphic(s['kind'],u,dur).resize((size,size),Image.Resampling.LANCZOS)
  alpha=ease(u/.28)*ease((dur-u)/.20);art.putalpha(art.getchannel('A').point(lambda z:int(z*alpha)));im.alpha_composite(art,(x,y+round(20*(1-q))))
 im.alpha_composite(tileim,xy)
 if mode in ['full','app']:
  shade=Image.new('RGBA',(1080,1920));d=ImageDraw.Draw(shade)
  for yy in range(1100,1920):d.line((0,yy,1080,yy),fill=(10,17,37,round(190*(yy-1100)/820)))
  im=Image.alpha_composite(im,shade);d=ImageDraw.Draw(im)
  title=s['title']
  if s['kind']=='hook':
   for j,(x,y,lab) in enumerate([(235,280,'Messaggi'),(790,390,'Video'),(245,1100,'Notifiche')]):
    if u>j*.2:tile(im,x,y+round(25*(1-ease((u-j*.2)/.25))),lab,j,.9)
  if mode=='app':
   lab='ACHIVIA' if t<105.2 else 'TASK → QUEST' if t<107.26 else 'PERFORMANCE' if t<109.98 else 'FEEDBACK'
   rr(d,(75,185,960,280),25,BLUE);text(im,515,232,lab,36,WHITE);title=''
  if s['kind']=='thoughtfull' and t<73.44:title='Vale a dire…'
  if s['kind']=='end':
   if t>=116.46:
    for j in range(5):circle(d,330+j*100,1210,29,ORANGE,None);text(im,330+j*100,1210,str(j+1),24,WHITE)
   if t>=117.72:text(im,540,1440,'BETA TEST',27,WHITE)
  if title:
   sz=68
   while d.textlength(title,font=font(sz))>900:sz-=1
   text(im,525,1350,title,sz,WHITE)
 # Captions use an ink plate with warm active words, at a protected lower-third position.
 core.captions(im,t,1545 if mode in ['full','app'] else 1585)
 return im.convert('RGB')

core.render_frame=frame
core.MINT='#ffb777'
if __name__=='__main__':
 if '--stills' in sys.argv:
  for t in [1,5,10,20,31,36,51,56,59,71,76,87,93,97,106,117]:
   raw=subprocess.check_output(['ffmpeg','-v','error','-ss',str(t),'-i',str(ROOT/'public/source.mp4'),'-frames:v','1','-f','rawvideo','-pix_fmt','rgb24','-'])
   frame(Image.frombytes('RGB',(464,832),raw),t).save(core.O/f'playful-{t}.jpg')
 else:core.render()
