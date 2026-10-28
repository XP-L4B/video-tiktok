import React from 'react';
import {AbsoluteFill,OffthreadVideo,staticFile} from 'remotion';
export const TikTok:React.FC=()=> <AbsoluteFill><OffthreadVideo src={staticFile('edit-master.mp4')} style={{width:'100%',height:'100%'}}/></AbsoluteFill>;
