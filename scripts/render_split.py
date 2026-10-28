"""Compone animazione sopra + originale sotto + sottotitoli parola per parola."""
import json,pathlib,subprocess,sys
R=pathlib.Path(__file__).resolve().parents[1];O=R/'out';O.mkdir(exist_ok=True)
words=json.loads((R/'src/words.json').read_text());blocks=[];b=[]
for w in words:
 if b and (len(' '.join(x['text'] for x in b+[w]))>31 or w['start']-b[0]['start']>2.4 or w['start']-b[-1]['end']>.65):blocks.append(b);b=[]
 b.append(w)
 if w['text'].endswith(('.','!','?',';',':')):blocks.append(b);b=[]
if b:blocks.append(b)
def ts(t):
 c=round(t*100);return f'{c//360000}:{c//6000%60:02}:{c//100%60:02}.{c%100:02}'
def st(t):
 m=round(t*1000);return f'{m//3600000:02}:{m//60000%60:02}:{m//1000%60:02},{m%1000:03}'
ev=[];srt=[]
def event(s,e,tags,content,layer=1):ev.append(f'Dialogue: {layer},{ts(s)},{ts(e)},Default,,0,0,0,,{{{tags}}}{content}')
for i,b in enumerate(blocks):
 end=min(b[-1]['end']+.1,blocks[i+1][0]['start'] if i+1<len(blocks) else 119.8)
 text=' '.join(w['text'] for w in b);width=min(884,max(170,len(text)*25+48));x=496-width/2;y=851;h=90;r=16
 path=f'm {r} 0 l {width-r} 0 b {width} 0 {width} 0 {width} {r} l {width} {h-r} b {width} {h} {width} {h} {width-r} {h} l {r} {h} b 0 {h} 0 {h} 0 {h-r} l 0 {r} b 0 0 0 0 {r} 0'
 event(b[0]['start'],end,f'\\an7\\pos({x},{y})\\p1\\c&H211A0F&\\1a&H12&\\bord0\\fad(80,60)',path)
 for j,w in enumerate(b):
  e=b[j+1]['start'] if j+1<len(b) else end
  if e<=w['start']:continue
  s=' '.join('{\\c&H'+('C9E59C' if q==j else 'FFFFFF')+'&}'+z['text'] for q,z in enumerate(b))
  event(w['start'],e,'\\an5\\pos(496,896)\\fs44\\b1\\bord0',s,2)
 srt.append(f'{i+1}\n{st(b[0]["start"])} --> {st(end)}\n{text}\n')
header='''[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 2
ScaledBorderAndShadow: yes
[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,DejaVu Sans,44,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0,0,5,0,0,0,1
[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
'''
(O/'split-captions.ass').write_text(header+'\n'.join(ev));(O/'captions.srt').write_text('\n'.join(srt))
if '--prepare' in sys.argv:sys.exit()
source=R/'public/source.mp4';story=R/'public/story-top.mp4'
if not story.exists():subprocess.run([sys.executable,str(R/'scripts/render_story.py')],check=True)
fc=f'[0:v]scale=1080:-2,crop=1080:960:0:150,setsar=1[talk];[1:v]setsar=1[story];[story][talk]vstack=inputs=2,drawbox=x=0:y=957:w=1080:h=6:color=0x162d36:t=fill,ass={O}/split-captions.ass[out]'
cmd=['ffmpeg','-y','-hide_banner','-loglevel','error','-i',str(source),'-i',str(story),'-filter_complex',fc,'-map','[out]','-map','0:a:0','-c:v','libx264','-preset','fast','-crf','22','-maxrate','2500k','-bufsize','5000k','-c:a','aac','-b:a','128k','-pix_fmt','yuv420p','-t','119.8','-movflags','+faststart',str(O/'tiktok-storytelling.mp4')]
subprocess.run(cmd,check=True)
print(O/'tiktok-storytelling.mp4',flush=True)
