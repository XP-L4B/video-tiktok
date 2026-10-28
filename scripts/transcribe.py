"""Rigenera localmente i timestamp dal video originale."""
import json,pathlib,subprocess,wave
import numpy as np
from faster_whisper import WhisperModel
r=pathlib.Path(__file__).resolve().parents[1];o=r/'out';o.mkdir(exist_ok=True)
subprocess.run(['ffmpeg','-y','-v','error','-i',str(r/'public/source.mp4'),'-vn','-ar','16000','-ac','1',str(o/'speech.wav')],check=True)
with wave.open(str(o/'speech.wav')) as w:audio=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
model=WhisperModel('medium',device='cpu',compute_type='int8',cpu_threads=6)
segments,_=model.transcribe(audio,language='it',word_timestamps=True,vad_filter=True,beam_size=5,initial_prompt='Achivia, achivia.org, gamification, cognitive offloading, task, quest, feedback')
words=[]
for s in segments:
 for w in s.words:
  text=w.word.strip()
  if text=='Acivia':text='Achivia'
  if text=='acivia':text='achivia'
  if 'aggamification' in text:text='gamification,'
  if text=='L' and 85<w.start<87:text='La'
  if text.startswith('.org') and words and words[-1]['text']=='achivia':words[-1]['text']='achivia.org.';words[-1]['end']=w.end
  else:words.append(dict(start=w.start,end=w.end,text=text,probability=w.probability))
(r/'src/words.json').write_text(json.dumps(words,ensure_ascii=False,indent=2))
print('Trascrizione generata: rileggere prima di pubblicare.')
