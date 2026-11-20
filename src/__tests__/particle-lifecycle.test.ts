import {afterEach,beforeEach,it,expect,vi} from 'vitest';
import {loadPhysics,mountParticleScene} from '../lib/particle-scene';
function fixture(){
 const step=vi.fn(),free=vi.fn(),created=vi.fn();
 const descriptor={setTranslation(){return this;},setLinearDamping(){return this;},setDensity(){return this;},setRestitution(){return this;},setFriction(){return this;}};
 const engine={World:class {timestep=0;constructor(){created();}createCollider(){}createRigidBody(){return {translation:()=>({x:150,y:50}),applyImpulse:vi.fn(),setTranslation:vi.fn(),setLinvel:vi.fn(),resetForces:vi.fn()};}step=step;free=free;},ColliderDesc:{cuboid:()=>descriptor,ball:()=>descriptor},RigidBodyDesc:{dynamic:()=>descriptor}} as unknown as Awaited<ReturnType<typeof loadPhysics>>;
 let id=0;const frames=new Map<number,FrameRequestCallback>();
 const runtime={load:vi.fn(async()=>engine),frame:vi.fn((cb:FrameRequestCallback)=>{frames.set(++id,cb);return id;}),cancel:vi.fn((key:number)=>{frames.delete(key);})};
 const flush=(time:number)=>{const [key,cb]=frames.entries().next().value!;frames.delete(key);cb(time);};
 return {engine,step,free,created,frames,runtime,flush};
}
beforeEach(()=>{
 vi.spyOn(document,'hidden','get').mockReturnValue(false);
 const ctx={clearRect:vi.fn(),fillRect:vi.fn(),strokeText:vi.fn(),fillText:vi.fn(),beginPath:vi.fn(),moveTo:vi.fn(),arc:vi.fn(),fill:vi.fn(),setTransform:vi.fn(),getImageData:()=>({data:new Uint8ClampedArray(300*100*4).fill(255)})};
 vi.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue(ctx as unknown as CanvasRenderingContext2D);
});
afterEach(()=>vi.restoreAllMocks());
it('does not construct a world when the canvas context is unavailable',async()=>{
 vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValue(null);
 const f=fixture(),status=vi.fn(),owned=mountParticleScene(document.createElement('canvas'),{count:4,paused:false,onStatus:status},f.runtime);
 await owned.ready;expect(f.runtime.load).not.toHaveBeenCalled();expect(status).toHaveBeenCalledWith('error');owned.dispose();
});
it('cancels late async initialisation before a world can be allocated',async()=>{
 const f=fixture();let resolve!:(value:typeof f.engine)=>void;const pending=new Promise<typeof f.engine>(done=>{resolve=done;});
 const owned=mountParticleScene(document.createElement('canvas'),{count:4,paused:false,onStatus:vi.fn()},{...f.runtime,load:()=>pending});
 owned.dispose();resolve(f.engine);await owned.ready;expect(f.created).not.toHaveBeenCalled();expect(f.frames.size).toBe(0);
});
it('bounds catch-up, pauses without frames and frees one world plus listeners on disposal',async()=>{
 const f=fixture(),remove=vi.spyOn(document,'removeEventListener');
 const owned=mountParticleScene(document.createElement('canvas'),{count:4,paused:false,onStatus:vi.fn()},f.runtime);
 await owned.ready;expect(f.frames.size).toBe(1);f.flush(0);f.flush(1000);expect(f.step).toHaveBeenCalledTimes(4);
 owned.setPaused(true);expect(f.frames.size).toBe(0);const steps=f.step.mock.calls.length;owned.interact({x:150,y:50},'splash');expect(f.step).toHaveBeenCalledTimes(steps+1);expect(f.frames.size).toBe(0);
 owned.setPaused(false);expect(f.frames.size).toBe(1);owned.dispose();owned.dispose();expect(f.frames.size).toBe(0);expect(f.free).toHaveBeenCalledOnce();expect(remove.mock.calls.some(([name])=>name==='visibilitychange')).toBe(true);
});
it('reports an engine failure without scheduling animation',async()=>{
 const f=fixture(),status=vi.fn();const owned=mountParticleScene(document.createElement('canvas'),{count:4,paused:false,onStatus:status},{...f.runtime,load:async()=>{throw Error('WASM failed');}});
 await owned.ready;expect(status).toHaveBeenLastCalledWith('error');expect(f.frames.size).toBe(0);owned.dispose();
});
