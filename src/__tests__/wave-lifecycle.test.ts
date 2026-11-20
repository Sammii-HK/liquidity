import {afterEach,it,expect,vi} from 'vitest';
import type {gsap} from 'gsap';
import {createWaveController} from '../lib/wave-controller';
function animationFixture(){
 const timelines:Array<{kill:ReturnType<typeof vi.fn>;to:ReturnType<typeof vi.fn>;timeScale:ReturnType<typeof vi.fn>}>=[];
 const tweens:Array<{kill:ReturnType<typeof vi.fn>}>=[];
 const api={timeline:vi.fn(()=>{const timeline={kill:vi.fn(),to:vi.fn(),timeScale:vi.fn()};timeline.to.mockReturnValue(timeline);timelines.push(timeline);return timeline;}),to:vi.fn(()=>{const tween={kill:vi.fn()};tweens.push(tween);return tween;})};
 return {api:api as unknown as Pick<typeof gsap,'timeline'|'to'>,timelines,tweens};
}
afterEach(()=>vi.useRealTimers());
it('replaces pointer tweens and one resume timer, then clears them at pause and disposal',()=>{
 vi.useFakeTimers();const fixture=animationFixture(),path=document.createElementNS('http://www.w3.org/2000/svg','path');
 const controller=createWaveController(path,fixture.api,{amplitude:12,speed:1,paused:false});
 controller.interact(100);controller.interact(200);controller.interact(300);
 expect(vi.getTimerCount()).toBe(1);expect(fixture.timelines[0].kill).toHaveBeenCalledOnce();expect(fixture.tweens[0].kill).toHaveBeenCalledOnce();
 controller.setPaused(true);expect(vi.getTimerCount()).toBe(0);expect(fixture.tweens.at(-1)!.kill).toHaveBeenCalledOnce();
 controller.interact(20);const manual=path.getAttribute('d');controller.shift(40);expect(path.getAttribute('d')).not.toBe(manual);expect(vi.getTimerCount()).toBe(0);
 controller.setPaused(false);controller.interact(100);controller.dispose();vi.runAllTimers();expect(vi.getTimerCount()).toBe(0);
 const creations=fixture.timelines.length;controller.interact(100);controller.leave();expect(fixture.timelines).toHaveLength(creations);
});
it('starts static for reduced motion and updates manual shape without creating an animation',()=>{
 const fixture=animationFixture(),path=document.createElementNS('http://www.w3.org/2000/svg','path');
 const controller=createWaveController(path,fixture.api,{amplitude:12,speed:1,paused:true});
 expect(fixture.timelines).toHaveLength(0);const initial=path.getAttribute('d');controller.configure(24,2);expect(path.getAttribute('d')).not.toBe(initial);
 controller.reset();controller.dispose();expect(fixture.timelines).toHaveLength(0);
});
