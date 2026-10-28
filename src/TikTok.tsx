import React from 'react';
import {AbsoluteFill,OffthreadVideo,Sequence,staticFile,useCurrentFrame,interpolate} from 'remotion';
import {accent,GraphicCard} from './Graphics';
import {scenes,chapters} from './timeline';
import words from './words.json';
type Word={start:number;end:number;text:string};
const blocks:Word[][]=[];
let current:Word[]=[];
for(const w of words as Word[]){
 const chars=[...current,w].map(x=>x.text).join(' ').length;
 if(current.length&&(chars>31||w.start-current[0].start>2.4||w.start-current[current.length-1].end>.65)){blocks.push(current);current=[];}
 current.push(w);
 if(/[.!?;:]$/.test(w.text)){blocks.push(current);current=[];}
}
if(current.length)blocks.push(current);
const Captions:React.FC=()=>{
 const f=useCurrentFrame();const t=f/30;
 const b=blocks.find((x,i)=>t>=x[0].start&&t<Math.min(x[x.length-1].end+.1,blocks[i+1]?.[0].start??119.79));if(!b)return null;
 const enter=interpolate(f,[Math.floor(b[0].start*30),Math.floor(b[0].start*30)+4],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 return <div style={{position:'absolute',left:64,right:164,top:1510,display:'flex',justifyContent:'center',transform:`translateY(${(1-enter)*10}px)`,opacity:enter}}><div style={{background:'rgba(9,17,24,.94)',border:'1px solid rgba(255,255,255,.18)',padding:'19px 22px',borderRadius:18,textAlign:'center',fontSize:44,fontWeight:700,lineHeight:1.3,boxShadow:'0 8px 25px #0004'}}>{b.map((w,i)=>{
 const active=t>=w.start&&t<w.end;
 return <span key={i} style={{color:active?accent:'#fff',textShadow:active?'0 0 18px #80f2d02a':'none'}}>{i?' ':''}{w.text}</span>
 })}</div></div>
};
export const TikTok:React.FC=()=>{
 const f=useCurrentFrame();const t=f/30;
 const chapter=[...chapters].reverse().find(c=>t>=c.start)||chapters[0];
 const zoom=1+Math.sin(Math.PI*Math.min(1,(t%13)/13))*.025;
 return <AbsoluteFill style={{fontFamily:'Arial, Helvetica, sans-serif',background:'#0c171f',color:'white'}}>
  <AbsoluteFill style={{transform:`scale(${zoom})`,transformOrigin:'50% 35%'}}><OffthreadVideo src={staticFile('source.mp4')} style={{width:'100%',height:'100%',objectFit:'cover'}}/></AbsoluteFill>
  <AbsoluteFill style={{background:'linear-gradient(180deg,rgba(0,0,0,.22) 0%,transparent 20%,transparent 47%,rgba(0,0,0,.12) 65%,rgba(0,0,0,.35) 100%)'}}/>
  <div style={{position:'absolute',top:104,left:64,right:164,display:'flex',alignItems:'center',gap:14}}><div style={{width:5,height:37,background:accent,borderRadius:4}}/><div style={{fontSize:23,letterSpacing:2.5,fontWeight:700,textShadow:'0 2px 12px #000a'}}>{chapter.label}</div></div>
  {scenes.map((scene,i)=><Sequence key={i} from={Math.round(scene.start*30)} durationInFrames={Math.round((scene.end-scene.start)*30)}><GraphicCard scene={scene}/></Sequence>)}
  <Captions/>
  <div style={{position:'absolute',left:64,right:164,top:1714,height:3,background:'rgba(255,255,255,.18)',borderRadius:10}}><div style={{height:'100%',width:`${Math.min(100,t/119.79*100)}%`,background:accent}}/></div>
 </AbsoluteFill>
};
