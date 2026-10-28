import React from 'react';
import {AbsoluteFill,OffthreadVideo,staticFile,useCurrentFrame,interpolate} from 'remotion';
const accent='#9ce5c9';
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
 return <div style={{position:'absolute',left:64,right:152,top:851,display:'flex',justifyContent:'center',transform:`translateY(${(1-enter)*10}px)`,opacity:enter}}><div style={{background:'rgba(9,17,24,.94)',border:'1px solid rgba(255,255,255,.18)',padding:'19px 22px',borderRadius:18,textAlign:'center',fontSize:44,fontWeight:700,lineHeight:1.3,boxShadow:'0 8px 25px #0004'}}>{b.map((w,i)=>{
 const active=t>=w.start&&t<w.end;
 return <span key={i} style={{color:active?accent:'#fff',textShadow:active?'0 0 18px #80f2d02a':'none'}}>{i?' ':''}{w.text}</span>
 })}</div></div>
};
export const TikTok:React.FC=()=> <AbsoluteFill style={{fontFamily:'DejaVu Sans, Arial, sans-serif',background:'#162d36',color:'white'}}>
 <div style={{position:'absolute',top:0,left:0,width:1080,height:960,overflow:'hidden'}}>
  <OffthreadVideo src={staticFile('story-top.mp4')} muted style={{width:1080,height:960}}/>
 </div>
 <div style={{position:'absolute',top:960,left:0,width:1080,height:960,overflow:'hidden'}}>
  <OffthreadVideo src={staticFile('source.mp4')} style={{position:'absolute',top:-150,left:0,width:1080,height:1080*832/464}}/>
 </div>
 <div style={{position:'absolute',top:957,left:0,width:1080,height:6,background:'#162d36'}}/>
 <Captions/>
</AbsoluteFill>;
