export function currentWaveSvg(svg:SVGSVGElement){
 const copy=svg.cloneNode(true) as SVGSVGElement;
 copy.setAttributeNS('http://www.w3.org/2000/xmlns/','xmlns','http://www.w3.org/2000/svg');
 copy.setAttribute('width','400');copy.setAttribute('height','120');
 copy.setAttribute('font-family','Arial, Helvetica, sans-serif');
 return new XMLSerializer().serializeToString(copy);
}
