import type {gsap} from 'gsap';
import {wavePath} from './motion';
export function createWaveController(path:SVGPathElement,animate:Pick<typeof gsap,'timeline'|'to'>,initial:{amplitude:number;speed:number;paused:boolean}) {
  let amplitude=initial.amplitude,speed=initial.speed,paused=initial.paused,disposed=false,phase=200;
  let idle:gsap.core.Timeline|null=null,tween:gsap.core.Tween|null=null,timer:ReturnType<typeof setTimeout>|null=null;
  const clear=()=>{if(timer!==null)clearTimeout(timer);timer=null;idle?.kill();idle=null;tween?.kill();tween=null;};
  const start=()=>{
    clear();if(disposed||paused)return;
    idle=animate.timeline({repeat:-1,yoyo:true});
    idle.to(path,{duration:1.5,ease:'sine.inOut',attr:{d:wavePath(50,amplitude)}}).to(path,{duration:1.5,ease:'sine.inOut',attr:{d:wavePath(350,amplitude)}});idle.timeScale(speed);
  };
  const interact=(value:number)=>{if(disposed)return;clear();phase=Math.max(0,Math.min(400,value));if(paused)path.setAttribute('d',wavePath(phase,amplitude));else{tween=animate.to(path,{duration:0.25,ease:'power3.out',overwrite:true,attr:{d:wavePath(phase,amplitude)}});timer=setTimeout(start,300);}};
  path.setAttribute('d',wavePath(phase,amplitude));start();
  return {
    setPaused(value:boolean){if(disposed)return;paused=value;if(paused)clear();else start();},
    configure(nextAmplitude:number,nextSpeed:number){if(disposed)return;amplitude=nextAmplitude;speed=nextSpeed;if(paused)path.setAttribute('d',wavePath(phase,amplitude));else start();},
    interact,
    shift(delta:number){interact((phase+delta+400)%400);},
    leave(){if(!disposed&&!paused)start();},
    reset(){if(disposed)return;phase=200;clear();path.setAttribute('d',wavePath(phase,amplitude));if(!paused)start();},
    dispose(){if(disposed)return;disposed=true;clear();},
  };
}
export type WaveController=ReturnType<typeof createWaveController>;
