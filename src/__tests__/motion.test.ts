import {describe,it,expect} from 'vitest';
import {impulseAt,scenePoint,wavePath} from '../lib/motion';
describe('scene-space interaction',()=>{
 it('converts display coordinates into each scene rather than treating CSS pixels as physics units',()=>{
  expect(scenePoint(400,150,{left:100,top:50,width:600,height:200})).toEqual({x:150,y:50});
  expect(scenePoint(1000,-50,{left:100,top:50,width:600,height:200})).toEqual({x:300,y:0});
  expect(scenePoint(0,0,{left:0,top:0,width:0,height:0})).toEqual({x:150,y:50});
 });
 it('keeps a centre hit finite and uses dy for the vertical splash',()=>{
  const centre=impulseAt({x:150,y:50},{x:150,y:50},'splash')!;
  expect(Number.isFinite(centre.x)&&Number.isFinite(centre.y)).toBe(true);
  const vertical=impulseAt({x:150,y:60},{x:150,y:50},'splash')!;
  expect(vertical.x).toBe(0);expect(vertical.y).toBeGreaterThan(0);
  expect(impulseAt({x:300,y:100},{x:0,y:0},'move')).toBeNull();
 });
 it('lets a splash fall off smoothly from full strength at the centre to nothing at the rim',()=>{
  const at=(d:number)=>{const i=impulseAt({x:150+d,y:50},{x:150,y:50},'splash')!;return Math.hypot(i.x,i.y);};
  expect(Math.hypot(...Object.values(impulseAt({x:150,y:50},{x:150,y:50},'splash')!)as [number,number])).toBeCloseTo(150);
  expect(at(0.0001)).toBeCloseTo(500,1);
  const samples=[1,10,20,30,40,49].map(at);
  for(let i=1;i<samples.length;i++)expect(samples[i]).toBeLessThan(samples[i-1]);
  expect(at(25)).toBeCloseTo(125);
  expect(at(49)).toBeLessThan(1);
  expect(at(50)).toBe(0);
  expect(impulseAt({x:201,y:50},{x:150,y:50},'splash')).toBeNull();
 });
 it('makes compatible finite SVG paths and clamps manual amplitude',()=>{
  const a=wavePath(20,12),b=wavePath(300,20);
  expect(a).not.toBe(b);expect(a.match(/ L/g)).toHaveLength(21);expect(b.match(/ L/g)).toHaveLength(21);
  expect(wavePath(NaN,Infinity)).not.toMatch(/NaN|Infinity/);expect(wavePath(200,99)).toBe(wavePath(200,28));
 });
});
