import React from 'react';
import {interpolate,useCurrentFrame} from 'remotion';
const a='#80f2d0', ink='#cee4e7';
export const Illustration:React.FC<{kind:string}>=({kind})=>{
 const f=useCurrentFrame();const p=interpolate(f,[10,50],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const pulse=.65+.35*Math.sin(f/9);
 return <svg width="100%" height="126" viewBox="0 0 740 126" fill="none" aria-hidden="true">
 {kind==='notifications'&&<>
 {[0,1,2].map(i=><g key={i} transform={`translate(${70+i*210},${12+(1-p)*i*10})`} opacity={Math.min(1,p*3-i*.3)}><rect width="180" height="96" rx="15" fill="#80f2d010" stroke="#80f2d050"/><rect x="17" y="18" width="32" height="32" rx="9" stroke={a} strokeWidth="2"/>{i===0?<path d="M25 27H41M25 34H37M25 40H33" stroke={a} strokeWidth="2"/>:i===1?<path d="M28 25L41 34L28 43Z" fill={a}/>:<><path d="M25 39H42L39 35V28Q33 19 28 28V35Z" stroke={a}/><circle cx="34" cy="44" r="2" fill={a}/></>}<path d="M62 25H153M62 36H130M17 68H150M17 80H115" stroke={ink} opacity=".4" strokeWidth="4" strokeLinecap="round"/><circle cx="169" cy="9" r="10" fill={a}/></g>)}
 </>}
 {kind==='brain'&&<>
 <g stroke={a} strokeWidth="2.5" transform="translate(75 7)"><path d="M75 15C48 -3 25 15 29 35C6 39 5 66 22 77C12 99 45 116 64 102C72 112 87 103 87 89V27C87 17 82 13 75 15ZM99 15C126 -3 149 15 145 35C168 39 169 66 152 77C162 99 129 116 110 102C102 112 87 103 87 89"/><path d="M30 36Q57 30 55 55M23 76Q42 66 53 82M65 18Q47 36 68 42M145 35Q118 30 120 55M151 77Q133 66 121 82" opacity=".5"/><circle cx="62" cy="68" r="4" fill={a}/><circle cx="115" cy="68" r="4" fill={a}/></g>
 <path d="M290 63H438" stroke="#80f2d045" strokeWidth="2" strokeDasharray="6 8"/><circle cx={290+p*148} cy="63" r="6" fill={a}/><path d="M430 55L440 63L430 71" stroke={a} strokeWidth="2"/>
 <rect x="475" y="24" width="140" height="80" rx="15" stroke={a} strokeWidth="2"/><path d="M495 43H595M495 62H570M495 81H585" stroke={ink} strokeWidth="4" opacity=".6"/><path d="M527 116H561" stroke={a} strokeWidth="2"/>
 </>}
 {kind==='feed'&&<>
 <circle cx="115" cy="63" r="42" stroke={a} strokeWidth="2"/><circle cx="115" cy="49" r="13" stroke={a} strokeWidth="2"/><path d="M90 85Q115 52 140 85" stroke={a} strokeWidth="2"/>
 {[0,1,2].map(i=><g key={i}><path d={`M163 63Q260 ${i*50+10} 350 ${i*40+15}`} stroke="#80f2d050" strokeWidth="2"/><circle cx={190+p*140} cy={63+(i-1)*p*37} r="4" fill={a}/></g>)}
 <rect x="365" y="5" width="280" height="116" rx="15" stroke={a} strokeWidth="2"/>
 {[0,1,2].map(i=><g key={i}><rect x="380" y={17+i*33} width="38" height="25" rx="5" fill={i===1?a:'#80f2d035'}/><path d={`M432 ${24+i*33}H620M432 ${34+i*33}H${560+i*15}`} stroke={ink} opacity={i===1?1:.45} strokeWidth="3"/></g>)}
 </>}
 {kind==='energy'&&<>
 <path d="M92 12L45 70H86L76 115L128 53H88Z" fill={a}/><path d="M171 63H285" stroke="#80f2d060" strokeWidth="2" strokeDasharray="6 8"/>
 <rect x="329" y="31" width="280" height="66" rx="12" stroke={a} strokeWidth="3"/><rect x="610" y="48" width="12" height="31" rx="4" fill={a}/>
 {[0,1,2,3,4].map(i=><rect key={i} x={341+i*52} y="42" width="42" height="44" rx="5" fill={a} opacity={f>30+i*9?.1:.7}/>)}
 </>}
 {kind==='quest'&&<>
 <rect x="45" y="14" width="200" height="98" rx="14" stroke="#cee4e770" strokeWidth="2"/>
 {[0,1,2].map(i=><g key={i}><rect x="63" y={32+i*24} width="13" height="13" rx="3" stroke={ink}/><path d={`M88 ${38+i*24}H222`} stroke="#cee4e770" strokeWidth="3"/></g>)}
 <path d="M274 63H350M338 53L351 63L338 73" stroke={a} strokeWidth="3"/>
 <path d="M440 17H493V40C493 80 467 98 467 98C467 98 440 80 440 40Z" stroke={a} strokeWidth="3" fill="#80f2d01a"/><path d="M440 30H424V45Q424 63 445 63M493 30H509V45Q509 63 490 63M467 98V112M448 112H486" stroke={a} strokeWidth="3"/>
 <path d="M451 53L462 64L482 40" stroke={a} strokeWidth="4" strokeDasharray="50" strokeDashoffset={50*(1-p)}/>
 <rect x="552" y="38" width="132" height="50" rx="25" fill="#80f2d01a" stroke="#80f2d060"/><text x="618" y="71" textAnchor="middle" fill={a} fontSize="28" fontFamily="Arial" fontWeight="700">QUEST</text>
 </>}
 {kind==='focus'&&<>
 {[66,142,218].map((x,i)=><g key={i} opacity={.3+i*.2}><rect x={x} y={25+i*8} width="57" height="67" rx="9" stroke={ink} strokeWidth="2"/><path d={`M${x+10} ${43+i*8}H${x+45}M${x+10} ${56+i*8}H${x+37}`} stroke={ink} strokeWidth="3"/></g>)}
 <path d="M320 63H410" stroke={a} strokeWidth="2"/><circle cx="525" cy="63" r="47" stroke="#80f2d045" strokeWidth="2"/><circle cx="525" cy="63" r="31" stroke={a} strokeWidth="2" opacity={pulse}/><circle cx="525" cy="63" r="8" fill={a}/><path d="M525 8V32M525 94V118M470 63H494M556 63H580" stroke={a} strokeWidth="2"/>
 </>}
 </svg>
};
