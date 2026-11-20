'use client';
import {useEffect,useState} from 'react';
export function useMotion(){
 const [paused,setPaused]=useState(false),[reduced,setReduced]=useState(false),[ready,setReady]=useState(false);
 useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)');const update=()=>{setReduced(media.matches);if(media.matches)setPaused(true);};update();setReady(true);media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[]);
 return {paused,setPaused,reduced,ready};
}
