import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

// Slow fonts and an image that never resolves must not leave the paper blank.
const source=readFileSync(new URL('../journey/main.js',import.meta.url),'utf8');
const text=[],images=[],context={
 scale(){},clearRect(){},fillText(value){text.push(value);},drawImage(){},
 beginPath(){},moveTo(){},lineTo(){},stroke(){},measureText:value=>({width:value.length*12})
};
class Texture{constructor(canvas){this.image=canvas;}}
const fonts={load:()=>new Promise(()=>{})};
Object.defineProperty(fonts,'ready',{get(){throw Error('Do not wait for unrelated site fonts');}});
const sandbox={
 renderer:null,
 document:{createElement:()=>({getContext:()=>context}),fonts},
 THREE:{CanvasTexture:Texture,SRGBColorSpace:'srgb',LinearFilter:'linear'},
 Image:class{constructor(){images.push(this);}},
 wrapText(ctx,value,x,y,width,line){ctx.fillText(value);return y+line;},
 drawPaperLine(ctx,value){ctx.fillText(value);}
};
runInNewContext(source.slice(source.indexOf('function printedPaper('),source.indexOf('function initGlassCards(')),sandbox);
const card={dataset:{pubId:'1'},querySelector(selector){return{
 '.pub-title':{textContent:'Immediately readable title'},
 '.pub-authors':{textContent:'Research authors'},
 '.pub-journal':{textContent:'Journal, 2026'},
 '.pub-summary':{innerText:'An abstract that must appear while the photograph is still loading.'},
 '.pub-impact':null,
 '.pub-image':{src:'slow-image.png'}
}[selector];}};
const texture=sandbox.printedPaper(card);
assert(texture instanceof Texture,'A complete text texture must be returned synchronously');
assert(text.includes('Immediately readable title'));
assert(text.includes('Research authors'));assert(text.includes('Journal, 2026'));
assert(text.includes('ABSTRACT'));assert.equal(texture.needsUpdate,true);
assert.equal(images.length,1,'Load only the image that is actually printed');
const before=text.length;images[0].width=640;images[0].height=480;images[0].onload();
assert(text.length>before,'Arriving photographs must update the existing texture');
console.log('Paper text renders immediately with stalled fonts and images');
