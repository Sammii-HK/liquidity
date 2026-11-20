import {afterEach,beforeEach,it,expect,vi} from 'vitest';
import {cleanup,render,screen,fireEvent} from '@testing-library/react';
import ParticleStudy from '../app/canvas/page';
import WaveStudy from '../app/gsap/page';
const scene=vi.hoisted(()=>({mount:vi.fn(),dispose:vi.fn(),setPaused:vi.fn(),reset:vi.fn(),interact:vi.fn()}));
vi.mock('gsap',()=>({gsap:{timeline:()=>{const timeline={to:()=>timeline,timeScale:()=>timeline,kill:vi.fn()};return timeline;},to:()=>({kill:vi.fn()})}}));
vi.mock('../lib/particle-scene',()=>({mountParticleScene:scene.mount}));
beforeEach(()=>{
 vi.stubGlobal('matchMedia',vi.fn(()=>({matches:false,addEventListener:vi.fn(),removeEventListener:vi.fn()})));
 scene.mount.mockImplementation((_canvas,options)=>{options.onStatus('ready');return {dispose:scene.dispose,setPaused:scene.setPaused,reset:scene.reset,interact:scene.interact};});
});
afterEach(()=>{cleanup();vi.clearAllMocks();vi.unstubAllGlobals();});
it('provides keyboard-equivalent pulse/reset/playback and recreates a world only for count changes',()=>{
 const view=render(<ParticleStudy/>);expect(scene.mount).toHaveBeenCalledOnce();
 fireEvent.click(screen.getByRole('button',{name:'Pause'}));expect(screen.getByRole('button',{name:'Play'})).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'Pulse from centre'}));expect(scene.interact).toHaveBeenCalledWith({x:150,y:50},'splash');
 fireEvent.click(screen.getByRole('button',{name:'Reset'}));expect(scene.reset).toHaveBeenCalledOnce();expect(scene.mount).toHaveBeenCalledOnce();
 fireEvent.click(screen.getByRole('button',{name:'2,500'}));expect(scene.dispose).toHaveBeenCalledOnce();expect(scene.mount).toHaveBeenCalledTimes(2);expect(scene.mount.mock.calls.at(-1)![1]).toMatchObject({count:2500,paused:true});
 view.unmount();expect(scene.dispose).toHaveBeenCalledTimes(2);
});
it('starts the actual control state paused when reduced motion is requested',()=>{
 vi.stubGlobal('matchMedia',vi.fn(()=>({matches:true,addEventListener:vi.fn(),removeEventListener:vi.fn()})));
 render(<ParticleStudy/>);expect(screen.getByRole('button',{name:'Play'})).toBeTruthy();expect(scene.mount.mock.calls[0][1].paused).toBe(true);expect(scene.setPaused.mock.calls.every(([paused])=>paused===true)).toBe(true);
});

it('connects real wave controls to the paused shape and restores defaults',()=>{
 render(<WaveStudy/>);fireEvent.click(screen.getByRole('button',{name:'Pause'}));
 const path=screen.getByRole('img',{name:'LIQUID, filled with a moving SVG wave'}).querySelector('path')!;
 const before=path.getAttribute('d');fireEvent.click(screen.getByRole('button',{name:'Shift the wave'}));
 expect(path.getAttribute('d')).not.toBe(before);
 fireEvent.change(screen.getByRole('slider',{name:'Wave height'}),{target:{value:'25'}});
 expect((screen.getByRole('slider',{name:'Wave height'}) as HTMLInputElement).value).toBe('25');
 fireEvent.click(screen.getByRole('button',{name:'Reset'}));expect((screen.getByRole('slider',{name:'Wave height'}) as HTMLInputElement).value).toBe('12');
 expect(screen.getByRole('button',{name:'Play'})).toBeTruthy();
});
it('copies the actual current standalone SVG and exposes manual copy on clipboard failure',async()=>{
 const write=vi.fn().mockResolvedValue(undefined);Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:write}});
 render(<WaveStudy/>);fireEvent.click(screen.getByRole('button',{name:'Pause'}));fireEvent.click(screen.getByRole('button',{name:'Shift the wave'}));
 fireEvent.click(screen.getByRole('button',{name:'Copy current SVG'}));
 await screen.findByText('SVG copied. This is the current static shape.');
 const source=write.mock.calls[0][0] as string,parsed=new DOMParser().parseFromString(source,'image/svg+xml');
 expect(parsed.querySelector('parsererror')).toBeNull();expect(parsed.documentElement.getAttribute('width')).toBe('400');expect(parsed.documentElement.getAttribute('font-family')).toContain('Arial');
 expect(parsed.querySelector('path')!.getAttribute('d')).toBe(screen.getByRole('img',{name:'LIQUID, filled with a moving SVG wave'}).querySelector('path')!.getAttribute('d'));
 write.mockRejectedValue(Error('denied'));fireEvent.click(screen.getByRole('button',{name:'Copy current SVG'}));
 expect(await screen.findByRole('textbox',{name:'SVG source to copy manually'})).toBeTruthy();Reflect.deleteProperty(navigator,'clipboard');
});
