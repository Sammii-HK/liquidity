import type {RigidBody,World} from '@dimforge/rapier2d-compat';
import {impulseAt,SCENE} from './motion';
type Engine=typeof import('@dimforge/rapier2d-compat').default;
let enginePromise:Promise<Engine>|undefined;
export function loadPhysics() {
  if(!enginePromise)enginePromise=import('@dimforge/rapier2d-compat').then(async module=>{await module.default.init();return module.default;}).catch(error=>{enginePromise=undefined;throw error;});
  return enginePromise;
}
interface Options {count:number;paused:boolean;onStatus:(status:'loading'|'ready'|'error')=>void}
interface Runtime {load?:()=>Promise<Engine>;frame?:(callback:FrameRequestCallback)=>number;cancel?:(id:number)=>void}
export function mountParticleScene(canvas:HTMLCanvasElement,options:Options,runtime:Runtime={}) {
  const frame=runtime.frame||((callback:FrameRequestCallback)=>window.requestAnimationFrame(callback)),cancel=runtime.cancel||((id:number)=>window.cancelAnimationFrame(id));
  let disposed=false,paused=options.paused,hidden=document.hidden,raf:number|null=null;
  let world:World|null=null,engine:Engine|null=null,particles:RigidBody[]=[];
  let last:number|null=null,accumulator=0;
  const ctx=canvas.getContext('2d');
  const mask=document.createElement('canvas');mask.width=300;mask.height=100;
  const maskCtx=mask.getContext('2d');
  let pixels:Uint8ClampedArray|null=null;
  const spawn=(particle:RigidBody)=>{particle.setTranslation({x:60+Math.random()*180,y:40+Math.random()*25},true);particle.setLinvel({x:0,y:0},true);particle.resetForces(true);};
  const render=()=>{
    if(!ctx||!world||!pixels||disposed)return;
    ctx.clearRect(0,0,300,100);ctx.fillStyle='#10252e';ctx.fillRect(0,0,300,100);
    ctx.font='700 64px Arial';ctx.textAlign='center';ctx.strokeStyle='#365762';ctx.lineWidth=0.4;ctx.strokeText('LIQUID',150,70);
    ctx.fillStyle='#98dddc';ctx.globalAlpha=0.88;ctx.beginPath();
    for(const particle of particles){const p=particle.translation(),x=Math.floor(p.x),y=Math.floor(p.y);if(x>=0&&x<300&&y>=0&&y<100&&pixels[(y*300+x)*4+3]>128){ctx.moveTo(p.x+1.2,p.y);ctx.arc(p.x,p.y,1.2,0,Math.PI*2);}}
    ctx.fill();ctx.globalAlpha=1;
  };
  const advance=()=>{
    if(!world||!engine)return;
    for(const particle of particles){
      const p=particle.translation(),dx=150-p.x,dy=50-p.y,squared=dx*dx+dy*dy;
      if(!Number.isFinite(squared)||p.x<60||p.x>240||p.y<35||p.y>70){spawn(particle);continue;}
      if(squared>2500){const d=Math.sqrt(squared),strength=Math.min(5,d*0.15)+(squared>4900?10:0);particle.applyImpulse({x:dx/d*strength,y:dy/d*strength},true);}
    }
    world.timestep=1/60;world.step();
  };
  const tick=(time:number)=>{
    raf=null;if(disposed||paused||hidden||!world)return;
    if(last!==null)accumulator+=Math.min(Math.max(0,(time-last)/1000),1/15);
    last=time;
    let steps=0;while(accumulator>=1/60&&steps<4){advance();accumulator-=1/60;steps++;}
    render();raf=frame(tick);
  };
  const stop=()=>{if(raf!==null)cancel(raf);raf=null;last=null;accumulator=0;};
  const schedule=()=>{if(!disposed&&!paused&&!hidden&&world&&raf===null)raf=frame(tick);};
  const resize=()=>{
    if(!ctx||disposed)return;
    const rect=canvas.getBoundingClientRect(),ratio=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.max(300,Math.round((rect.width||300)*ratio));canvas.height=Math.max(100,Math.round((rect.height||100)*ratio));
    ctx.setTransform(canvas.width/SCENE.width,0,0,canvas.height/SCENE.height,0,0);render();
  };
  const visibility=()=>{hidden=document.hidden;stop();schedule();};
  const observer=typeof ResizeObserver==='undefined'?null:new ResizeObserver(resize);
  if(ctx&&maskCtx){observer?.observe(canvas);window.addEventListener('resize',resize);document.addEventListener('visibilitychange',visibility);resize();}
  const ready=(async()=>{
    if(!ctx||!maskCtx){options.onStatus('error');return;}
    options.onStatus('loading');
    const loaded=await(runtime.load||loadPhysics)();
    if(disposed)return;
    engine=loaded;maskCtx.fillStyle='white';maskCtx.font='700 64px Arial';maskCtx.textAlign='center';maskCtx.fillText('LIQUID',150,70);pixels=maskCtx.getImageData(0,0,300,100).data;
    world=new loaded.World({x:0,y:2500});
    world.createCollider(loaded.ColliderDesc.cuboid(100,2).setTranslation(150,72));world.createCollider(loaded.ColliderDesc.cuboid(2,20).setTranslation(50,50));world.createCollider(loaded.ColliderDesc.cuboid(2,20).setTranslation(250,50));world.createCollider(loaded.ColliderDesc.cuboid(100,2).setTranslation(150,30));
    for(let i=0;i<options.count;i++){const particle=world.createRigidBody(loaded.RigidBodyDesc.dynamic().setTranslation(60+Math.random()*180,40+Math.random()*25).setLinearDamping(8));world.createCollider(loaded.ColliderDesc.ball(1.2).setDensity(0.5).setRestitution(0.001).setFriction(0.02),particle);particles.push(particle);}
    render();options.onStatus('ready');schedule();
  })().catch(()=>{stop();world?.free();world=null;particles=[];if(!disposed)options.onStatus('error');});
  return {
    ready,
    setPaused(value:boolean){paused=value;stop();schedule();},
    interact(origin:{x:number;y:number},kind:'move'|'splash'){
      if(!world||disposed||(kind==='move'&&paused))return;
      for(const particle of particles){const force=impulseAt(particle.translation(),origin,kind);if(force)particle.applyImpulse(force,true);}
      if(paused&&kind==='splash')advance();render();
    },
    reset(){if(disposed)return;particles.forEach(spawn);last=null;accumulator=0;render();},
    dispose(){if(disposed)return;disposed=true;stop();observer?.disconnect();window.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',visibility);world?.free();world=null;particles=[];},
  };
}
export type ParticleScene=ReturnType<typeof mountParticleScene>;
