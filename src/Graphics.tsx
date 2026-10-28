import React from 'react';
import {Illustration} from './Illustrations';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
export const accent='#80f2d0';
export type Graphic = {start:number;end:number;eyebrow:string;title:string;kind:'flow'|'bars'|'cards'|'metric'|'check'|'search'|'warning';labels:string[];detail?:string;art?:string};
const line:React.CSSProperties={background:'rgba(255,255,255,.15)',height:2,flex:1};
export const GraphicCard:React.FC<{scene:Graphic}>=({scene})=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 const enter=spring({frame:f,fps,config:{damping:22,stiffness:160}});
 const out=interpolate(f,[(scene.end-scene.start)*fps-9,(scene.end-scene.start)*fps],[1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const item=(i:number):React.CSSProperties=>({opacity:interpolate(f,[6+i*7,16+i*7],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}),transform:`translateY(${interpolate(f,[6+i*7,20+i*7],[16,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}px)`});
 const pill:React.CSSProperties={padding:'20px 15px',border:'1px solid rgba(128,242,208,.25)',borderRadius:16,background:'rgba(128,242,208,.06)',textAlign:'center',fontSize:30,fontWeight:650,lineHeight:1.15};
 return <div style={{position:'absolute',left:62,right:156,top:1000,borderRadius:28,padding:'27px 30px 30px',background:'linear-gradient(130deg,rgba(15,26,33,.97),rgba(22,39,47,.96))',border:'1px solid rgba(255,255,255,.22)',boxShadow:'0 18px 60px rgba(0,0,0,.23)',opacity:enter*out,transform:`translateY(${(1-enter)*32}px)`,color:'white'}}>
  <div style={{display:'flex',alignItems:'center',gap:10,color:accent,fontSize:19,fontWeight:750,letterSpacing:2,textTransform:'uppercase'}}><div style={{width:7,height:7,borderRadius:9,background:accent}}/>{scene.eyebrow}<div style={line}/></div>
  <div style={{fontSize:43,fontWeight:750,letterSpacing:-1.3,lineHeight:1.08,margin:'17px 0 18px'}}>{scene.title}</div>
  {scene.art&&<div style={{marginBottom:15}}><Illustration kind={scene.art}/></div>}
  {scene.kind==='flow'&&<div style={{display:'flex',alignItems:'center',gap:10}}>{scene.labels.map((s,i)=><React.Fragment key={i}>{i>0&&<div style={{fontSize:30,color:accent,...item(i)}}>→</div>}<div style={{...pill,...item(i),flex:1}}>{s}</div></React.Fragment>)}</div>}
  {scene.kind==='cards'&&<div style={{display:'flex',gap:14}}>{scene.labels.map((s,i)=><div key={i} style={{...pill,...item(i),flex:1,textAlign:'left'}}><div style={{color:accent,fontSize:19,marginBottom:12}}>0{i+1}</div>{s}</div>)}</div>}
  {scene.kind==='bars'&&<div style={{display:'flex',gap:16,alignItems:'flex-end',height:150}}>{scene.labels.map((s,i)=><div key={i} style={{flex:1,textAlign:'center',...item(i)}}><div style={{height:(40+i*27)*interpolate(f,[14+i*6,38+i*6],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}),borderRadius:'8px 8px 0 0',background:i===scene.labels.length-1?accent:'rgba(128,242,208,.25)',marginBottom:12}}/><div style={{fontSize:23}}>{s}</div></div>)}</div>}
  {scene.kind==='metric'&&<div style={{display:'flex',alignItems:'center',gap:24}}><div style={{fontSize:80,fontWeight:800,color:accent,letterSpacing:-4,...item(0)}}>{scene.labels[0]}</div><div style={{fontSize:29,lineHeight:1.2,...item(1)}}>{scene.labels.slice(1).join(' · ')}</div></div>}
  {scene.kind==='check'&&<div style={{display:'flex',flexDirection:'column',gap:14}}>{scene.labels.map((s,i)=><div key={i} style={{display:'flex',alignItems:'center',gap:15,fontSize:30,...item(i)}}><span style={{color:accent,fontSize:24,border:`1px solid ${accent}`,borderRadius:8,width:32,height:32,textAlign:'center'}}>✓</span>{s}</div>)}</div>}
  {scene.kind==='search'&&<div style={{...pill,textAlign:'left',display:'flex',alignItems:'center',gap:20,...item(0)}}><svg width="30" height="30" viewBox="0 0 40 40" fill="none" stroke={accent} strokeWidth="3"><circle cx="16" cy="16" r="11"/><path d="M24 24L35 35"/></svg><span>{scene.labels[0]}</span><span style={{height:32,width:2,background:accent,opacity:Math.floor(f/15)%2}}/></div>}
  {scene.kind==='warning'&&<div style={{display:'flex',gap:18,alignItems:'center',...item(0)}}><div style={{color:'#f9d48b',fontSize:48}}>!</div><div style={{fontSize:31,lineHeight:1.2}}>{scene.labels.join(' · ')}</div></div>}
  {scene.detail&&<div style={{fontSize:20,color:'#afc4c9',marginTop:18,lineHeight:1.2}}>{scene.detail}</div>}
 </div>
};
