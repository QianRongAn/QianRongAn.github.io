import * as THREE from 'three';

const P={gold:'#D0BA98',wine:'#91040C',violet:'#a99ab9',cream:'#eee7db',ink:'#594354'};
const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z),clamp=x=>Math.max(0,Math.min(1,x)),smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
export const workflowStories=[
 {name:'META-ACDC',steps:[['Structural contacts','Represent TCR–peptide complexes with backbone geometry and side-chain contacts.','Backbone + side chains'],['Equivariant learning','Pass contact information through the EGNN, then adapt to predicted complexes.','Contact graph → EGNN'],['Scoring & selection','Compare grafted-decoy discrimination and prioritize candidates with uncertainty-aware sampling.','AUROC 0.500 → 0.933']]},
 {name:'MedLit Evidence',steps:[['Question & retrieval','Structure the clinical question with PICO and retrieve relevant literature from the 27,978-paper collection.','PICO → retrieved papers'],['Evidence & provenance','Organize the evidence by study and evidence grade; keep each answer connected to its PMID sources.','Study → grade → PMID'],['Inspectable outputs','Read the cited answer alongside the separate LightGBM retraction-risk model and SHAP explanations.','Cited answer + risk explanation']]},
 {name:'Pancreatic cancer',steps:[['Integrate the tissue','Bring bulk, single-cell and spatial transcriptomic evidence into a shared view of the tumor microenvironment.','Bulk × single-cell × spatial'],['Cellular dialogue','Examine PRRX2⁺ epithelial cells, SPP1⁺ macrophages and the TGFB1 / TGFBR2 signaling axis shown in the concept diagram.','PRRX2⁺ EC ↔ SPP1⁺ TAM'],['Resistance programs','Connect epithelial transition and matrix remodeling with the reported gemcitabine-resistance phenotype.','EMT + matrix remodeling']]},
 {name:'Multi-cancer fragmentomics',steps:[['Plasma → sequence','Extract cell-free DNA from plasma and profile it with low-pass whole-genome sequencing.','cfDNA → low-pass WGS'],['Repeat-element features','Describe repetitive elements with fragment ratio, length, distribution, complexity and expansion features.','FR · FL · FD · FC · FE'],['Detection & tissue origin','Combine the repeat-element feature families in machine-learning models for cancer prediction and tissue-of-origin analysis.','Features → ML → two outputs']]},
 {name:'AURKA heterogeneity',steps:[['Resolve epithelial cells','Separate epithelial subpopulations within the integrated single-cell and multi-omics profiles.','Tissue → epithelial subsets'],['Compare expression states','Contrast AURKA-high cell-cycle / DNA-repair programs with lower-expression TNF-α / androgen-response programs.','AURKA high ↔ low'],['Test & interpret','Connect cell-line knockdown findings with the computationally proposed treatment-stratification hypotheses.','Knockdown → phenotype → hypotheses']]},
 {name:'Colorectal invasion',steps:[['Map the microenvironment','Integrate single-cell datasets and link cell states to invasion phenotypes with Scissor and deconvolution.','Single-cell + bulk phenotypes'],['Resolve stromal signaling','Follow the proposed PRRX2–TGF-β link toward MMP2⁺ myofibroblasts and matrix remodeling.','PRRX2 → TGF-β → MMP2⁺ myCAF'],['Evaluate invasion','Examine matrix remodeling, perineural invasion and the perturbation evidence supporting the proposed mechanism.','Stroma → matrix → nerve interface']]},
 {name:'Prostate genomics',steps:[['Sequence the cohort','Profile the 52-patient Chinese mHSPC cohort with targeted tumor sequencing.','52 tumors → targeted panel'],['Organize alterations','Map gene-by-patient alterations and compare the mutation landscape with the SU2C-PCF reference cohort.','Alteration matrix + reference cohort'],['Read clinical associations','Inspect FOXA1 and repair-pathway alterations alongside clinical associations, with the small retrospective cohort kept in view.','FOXA1 · HRR · clinical context']]},
 {name:'Kidney immunotherapy',steps:[['Prepare two feature families','Derive inflammatory features from bulk / single-cell profiles and immunogenic features from genomic information.','Inflammatory + immunogenic'],['Train & validate TIs-ML','Combine gene, pathway, cell and mutation signals, then compare the model across training and independent immune cohorts.','Feature ensemble → TIs-ML'],['Evaluate two outcomes','Read immunotherapy-response and survival predictions alongside cohort-based validation and the limits of retrospective analysis.','Response + survival']]}
];

function kit(){
 const group=new THREE.Group(),animated=[],labels=[],materials=new Set(),geometries=new Set(),textures=new Set();
 const mat=(color,extra={})=>{const m=new THREE.MeshPhysicalMaterial({color,roughness:.43,metalness:0,clearcoat:.15,sheen:.35,sheenColor:new THREE.Color('#eee1f0'),transparent:true,...extra});materials.add(m);return m;};
 const m={gold:mat(P.gold),wine:mat(P.wine),violet:mat(P.violet),cream:mat(P.cream),ink:mat(P.ink)};
 const sphere=new THREE.SphereGeometry(1,20,14),box=new THREE.BoxGeometry(1,1,1);geometries.add(sphere);geometries.add(box);
 function mesh(parent,g,material,p=V(),scale=V(1,1,1)){geometries.add(g);const o=new THREE.Mesh(g,material);o.position.copy(p);o.scale.copy(scale);parent.add(o);return o;}
 const ball=(par,p,r,material=m.gold)=>mesh(par,sphere,material,p,V(r,r,r));
 const block=(par,p,size,material=m.cream)=>{const o=mesh(par,box,material,p,size);return o;};
 function line(par,points,r=.024,material=m.gold){return mesh(par,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),Math.max(16,points.length*5),r,7,false),material);}
 function arrow(par,a,b,material=m.gold,r=.025){const d=b.clone().sub(a),end=b.clone().addScaledVector(d.clone().normalize(),-.16);line(par,[a,a.clone().lerp(b,.5),end],r,material);const cone=mesh(par,new THREE.ConeGeometry(r*3.3,.18,10),material,b);cone.quaternion.setFromUnitVectors(V(0,1,0),d.normalize());return cone;}
 function text(par,t,p,size=.13,color=P.ink){const c=document.createElement('canvas');c.width=768;c.height=128;const cx=c.getContext('2d');cx.font='400 42px "Research Open Sans",Arial';cx.fillStyle=color;cx.textAlign='center';cx.textBaseline='middle';cx.fillText(t,384,64,735);const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;textures.add(texture);const material=new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,side:THREE.DoubleSide});materials.add(material);const o=mesh(par,new THREE.PlaneGeometry(size*6,size),material,p);return o;}
 function card(par,title,p,width=1.4,height=1.1){const g=new THREE.Group();g.position.copy(p);par.add(g);block(g,V(),V(width,height,.055));text(g,title,V(0,height*.28,.036),.13);for(let i=0;i<5;i++)block(g,V(-.03,height*.1-i*.1,.038),V(width*.72-(i%3)*.1,.012,.008),m.violet);return g;}
 function graph(par,p,seed=0,layers=1){const root=new THREE.Group();root.position.copy(p);par.add(root);for(let l=0;l<layers;l++){const pts=Array.from({length:8},(_,i)=>V(Math.sin(i*2.399+seed)*(.6+(i%3)*.07),Math.cos(i*2.399+seed)*.67,l*.32));pts.forEach((v,i)=>{ball(root,v,.07,i%4===0?m.wine:m.gold);pts.slice(i+1).forEach((q,j)=>{if(v.distanceTo(q)<.95)line(root,[v,q],.012,m.violet);});});}return root;}
 function matrix(par,p,cols=8,rows=5,seed=0){const g=new THREE.Group();g.position.copy(p);par.add(g);for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const v=Math.sin(x*13.7+y*19.1+seed)*.5+.5;block(g,V((x-(cols-1)/2)*.17,(y-(rows-1)/2)*.17,v*.09),V(.14,.14,.06),v>.68?m.wine:v>.38?m.violet:m.cream);}return g;}
 function cell(par,p,r=.6,type='round'){const g=new THREE.Group();g.position.copy(p);par.add(g);const body=ball(g,V(),r,m.violet);body.scale.set(1,.86,type==='spindle'?.5:1);ball(g,V(.08,.02,r*.63),r*.28,m.wine);for(let i=0;i<24;i++){const a=i/24*Math.PI*2;ball(g,V(Math.cos(a)*r,Math.sin(a)*r*.86,.08),.035,m.gold);}if(type==='spindle'){g.scale.set(1.5,.55,.7);for(let side of [-1,1])line(g,[V(side*r,0,0),V(side*r*1.6,.12,0),V(side*r*2,0,0)],.018,m.violet);}return g;}
 function bars(par,p,values,colors=m.gold){values.forEach((h,i)=>block(par,p.clone().add(V((i-(values.length-1)/2)*.25,h*.5,0)),V(.16,h,.22),Array.isArray(colors)?colors[i%colors.length]:colors));}
 function stream(par,a,b,offset=0){for(let i=0;i<5;i++){const o=ball(par,a,.035,m.wine);animated.push((p,t)=>o.position.copy(a).lerp(b,(t*.17+i/5+offset)%1));}}
 function plates(par,p){for(let i=0;i<3;i++){const o=matrix(par,p.clone().add(V(i*.10,i*.13,-i*.3)),6,5,i);o.rotation.y=-.18;}}
 function tissue(par,p){const g=new THREE.Group();g.position.copy(p);par.add(g);for(let i=0;i<22;i++){const a=i*2.3999,r=.17+Math.sqrt(i)*.19;ball(g,V(Math.cos(a)*r,Math.sin(a)*r*.65,(i%4)*.09),.11,i%5===0?m.wine:m.violet);}return g;}
 function board(par,p,kind='bars'){const g=new THREE.Group();g.position.copy(p);par.add(g);block(g,V(0,.1,-.06),V(1.8,1.45,.09));line(g,[V(-.66,-.43,.01),V(-.66,.6,.01)],.012,m.ink);line(g,[V(-.66,-.43,.01),V(.7,-.43,.01)],.012,m.ink);if(kind==='bars')bars(g,V(0,-.4,.1),[.4,.7,.55,.9],m.violet);else{line(g,[V(-.62,.55,.02),V(-.3,.3,.02),V(.1,.16,.02),V(.64,-.2,.02)],.018,m.wine);line(g,[V(-.62,.55,.02),V(-.18,.48,.02),V(.2,.25,.02),V(.64,.17,.02)],.018,m.gold);}return g;}
 function dispose(){geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());}
 return {group,animated,labels,m,mat,ball,block,line,arrow,text,card,graph,matrix,cell,bars,stream,plates,tissue,board,dispose};
}
function build(k,kind,groups){
 const {m,ball,block,line,arrow,text,card,graph,matrix,cell,bars,stream,plates,tissue,board,animated}=k,[a,b,c]=groups;
 if(kind===0){
  // Two structural partners and their explicit side-chain contacts, not a DNA helix.
  for(let sheet=0;sheet<4;sheet++){const ps=Array.from({length:22},(_,i)=>V((i/21-.5)*1.9,.25+sheet*.15+Math.sin(i*.33+sheet*.7)*.09,(sheet-1.5)*.13));line(a,ps,.06,m.violet);}
  const peptide=Array.from({length:9},(_,i)=>V((i-4)*.23,-.42+Math.sin(i*.8)*.055,.23));line(a,peptide,.045,m.wine);peptide.forEach((p,i)=>{ball(a,p,.068,m.wine);const tip=p.clone().add(V(.03,.23+(i%2)*.05,.10));line(a,[p,tip],.023,m.gold);ball(a,tip,.055,m.gold);if(i%2===0)line(a,[tip,tip.clone().add(V(0,.25,-.15))],.01,m.ink);});text(a,'TCR contact surface',V(0,1.13,.2),.14);text(a,'Peptide side chains',V(0,-.82,.3),.14);
  for(let i=0;i<3;i++){const g=graph(b,V(0,0,-.45+i*.45),i);g.rotation.y=.12;}stream(b,V(-.6,.4,.7),V(.5,-.4,.7));
  bars(c,V(0,-.55,0),[.5,.933],[m.violet,m.wine]);text(c,'Backbone',V(-.38,-.78,.2),.12);text(c,'+ side chains',V(.38,-.78,.2),.12);text(c,'0.500       0.933',V(0,.66,.15),.14);text(c,'Grafted-decoy AUROC',V(0,.94,.1),.13);arrow(c,V(.7,-.25,.1),V(1,.32,.1));
 }else if(kind===1){
  ['P','I','C','O'].forEach((t,i)=>{const o=block(a,V((i-1.5)*.42,.5,0),V(.35,.44,.14),i%2?m.violet:m.gold);text(a,t,o.position.clone().add(V(0,0,.08)),.22);});for(let i=0;i<3;i++)card(a,['Question','Retrieval','Studies'][i],V((i-1)*.60,-.32,-i*.12),.52,.7);
  for(let i=0;i<3;i++){const g=card(b,['Study design','Evidence grade','PMID source'][i],V((i-1)*.60,(1-i)*.18,-i*.22),.7,1);g.rotation.y=(i-1)*-.14;}for(let i=0;i<2;i++)arrow(b,V(-.35+i*.65,-.68,.3),V(.05+i*.65,-.68,.3));
  card(c,'Cited answer',V(-.5,.1,0),.95,1.3);const g=board(c,V(.55,0,-.1));g.scale.setScalar(.56);text(c,'LightGBM + SHAP',V(.5,-.72,.2),.12);line(c,[V(-.4,-.6,.1),V(-.4,-.88,.1),V(.5,-.88,.1)],.018,m.gold);
 }else if(kind===2){
  plates(a,V(-.42,0,0));tissue(a,V(.55,-.05,.2));
  cell(b,V(-.75,.1,0),.46);cell(b,V(.75,.1,0),.55);arrow(b,V(-.22,.35,.45),V(.16,.35,.45));arrow(b,V(.22,-.15,.45),V(-.16,-.15,.45));stream(b,V(-.25,.15,.5),V(.25,.15,.5));text(b,'PRRX2+ EC',V(-.7,-.67,.3),.13);text(b,'SPP1+ TAM',V(.7,-.67,.3),.13);text(b,'TGFB1 / TGFBR2',V(0,.9,.3),.13);
  for(let i=0;i<3;i++)cell(c,V((i-1)*.6,.3,0),.22,'spindle');for(let i=0;i<7;i++)line(c,[V(-1,-.4+i*.12,-.1),V(0,-.32+i*.12,.1),V(1,-.5+i*.12,-.1)],.015,m.gold);text(c,'EMT + matrix remodeling',V(0,-.87,.2),.13);
 }else if(kind===3){
  const tube=block(a,V(-.6,.05,0),V(.35,1.2,.35),m.violet);ball(a,V(-.6,-.54,0),.175,m.violet);block(a,V(-.6,.05,.19),V(.24,.75,.025),m.wine);arrow(a,V(-.28,.1,.1),V(.2,.1,.1));const sequencer=block(a,V(.7,.03,-.1),V(.85,1,.6));block(a,V(.7,.25,.22),V(.58,.37,.015),m.ink);for(let i=0;i<6;i++)block(a,V(.45+(i%3)*.2,-.25+Math.floor(i/3)*.13,.22),V(.12,.05,.025),m.gold);text(a,'Plasma → cfDNA → WGS',V(0,-.84,.25),.13);
  ['FR','FL','FD','FC','FE'].forEach((t,i)=>{const x=(i-2)*.43;bars(b,V(x,-.5,0),[.2+(i%3)*.18],i%2?m.violet:m.gold);text(b,t,V(x,-.74,.2),.12);for(let j=0;j<3;j++)block(b,V(x,(j*.22)+.25,0),V(.26,.05,.08),j%2?m.wine:m.gold);});text(b,'Repeat-element feature families',V(0,1,.2),.13);
  graph(c,V(-.55,0,0),3);arrow(c,V(.2,.4,.1),V(.7,.6,.1));arrow(c,V(.2,-.3,.1),V(.7,-.5,.1));block(c,V(.95,.65,0),V(.6,.45,.13),m.wine);matrix(c,V(.95,-.5,0),3,3,2);text(c,'Detection',V(.95,1,.2),.13);text(c,'Tissue origin',V(.9,-1,.2),.13);
 }else if(kind===4){
  tissue(a,V());for(let i=0;i<7;i++){const x=(i-3)*.28;ball(a,V(x,-.8,.2),.07,i%2?m.violet:m.wine);}text(a,'Epithelial subpopulations',V(0,1,.2),.13);
  for(let i=0;i<10;i++){const g=i<5?-1:1;cell(b,V(g*.63+Math.sin(i*2.3)*.22,Math.cos(i*2.3)*.5,0),.11);}text(b,'AURKA low',V(-.65,-.8,.2),.13);text(b,'AURKA high',V(.65,-.8,.2),.13);matrix(b,V(-.6,.95,.1),3,2,2);matrix(b,V(.6,.95,.1),3,2,6);
  card(c,'Knockdown',V(-.6,.15,0),.8,.95);arrow(c,V(-.1,.2,.2),V(.25,.2,.2));for(let i=0;i<6;i++)cell(c,V(.55+(i%2)*.3,(Math.floor(i/2)-1)*.36,0),.08);text(c,'Colony · migration · invasion',V(0,-.8,.2),.13);
 }else if(kind===5){
  plates(a,V(-.5,0,-.1));tissue(a,V(.55,.1,.2));text(a,'Phenotype-linked cell states',V(0,-.9,.2),.13);
  cell(b,V(-.8,.1,0),.37);cell(b,V(.7,.1,0),.34,'spindle');arrow(b,V(-.32,.1,.35),V(.16,.1,.35));stream(b,V(-.25,.1,.4),V(.25,.1,.4));text(b,'PRRX2',V(-.8,-.58,.2),.13);text(b,'MMP2+ myCAF',V(.65,-.58,.2),.13);text(b,'TGF-beta',V(0,.8,.2),.13);
  for(let i=0;i<7;i++)line(c,[V(-1,-.6+i*.13,-.15),V(0,-.45+i*.13,.1),V(1,-.6+i*.13,-.15)],.017,m.violet);line(c,[V(-.9,.7,.1),V(0,.6,.1),V(.9,.8,.1)],.09,m.gold);for(let i=0;i<4;i++){const tip=V((i-1.5)*.5,.95+(i%2)*.18,.05);line(c,[V((i-1.5)*.5,.65,.1),tip],.035,m.gold);}cell(c,V(.1,.1,.3),.18,'spindle');text(c,'Matrix / nerve interface',V(0,-.92,.25),.13);
 }else if(kind===6){
  for(let i=0;i<12;i++){ball(a,V((i%4-1.5)*.4,Math.floor(i/4)*.43-.5,0),.09,i%5?m.violet:m.wine);block(a,V((i%4-1.5)*.4,Math.floor(i/4)*.43-.66,0),V(.12,.18,.1),m.violet);}text(a,'52-patient cohort',V(0,1,.2),.14);
  matrix(b,V(),10,7,4);text(b,'Genes x patients',V(0,.9,.2),.13);for(let i=0;i<3;i++)block(b,V((i-1)*.6,-.95,.1),V(.45,.08,.06),m.gold);
  bars(c,V(-.4,-.45,0),[.3654*2,.3654*2],[m.wine,m.gold]);text(c,'FOXA1 / HRR',V(-.4,-.78,.2),.13);card(c,'Clinical context',V(.7,.1,-.1),.75,1.1);text(c,'36.54% each',V(-.4,.65,.2),.13);
 }else{
  plates(a,V(-.65,0,0));graph(a,V(.6,0,0),2);text(a,'Inflammatory   +   immunogenic',V(0,-.9,.2),.13);
  for(let i=0;i<3;i++){const g=matrix(b,V(-.6+i*.6,(i%2)*.18,-i*.22),3,4,i);g.rotation.y=-.16;}arrow(b,V(-.6,-.9,.1),V(.65,-.9,.1));text(b,'Training / independent cohorts',V(0,1,.2),.13);
  const response=board(c,V(-.63,0,0));response.scale.setScalar(.62);const survival=board(c,V(.63,0,0),'survival');survival.scale.setScalar(.62);text(c,'Response',V(-.63,-.72,.2),.13);text(c,'Survival',V(.63,-.72,.2),.13);
 }
}
export function createProjectWorld(kind=0){
 const k=kit(),groups=[-4,0,4].map((x,i)=>{const g=new THREE.Group();g.position.x=x;g.rotation.y=-.10;k.group.add(g);return g;});build(k,kind,groups);
 for(let i=0;i<2;i++){k.arrow(k.group,V(-2.55+i*4,-1.35,-.15),V(-1.45+i*4,-1.35,-.15),k.m.gold,.025);k.stream(k.group,V(-2.55+i*4,-1.35,-.08),V(-1.45+i*4,-1.35,-.08),i*.2);}
 const anchors=groups.map(g=>g.position.clone().add(V(0,1.4,0)));
 function cameraAt(p,aspect){const overviewZ=Math.max(12,16/Math.max(.75,aspect)),focusZ=Math.max(4.8,4/Math.max(.65,aspect));const keys=[[0,0,overviewZ,0],[.19,-4,focusZ,-4],[.35,-4,focusZ,-4],[.58,0,focusZ,0],[.76,0,focusZ,0],[.90,4,focusZ,4],[1,4,focusZ,4]];let j=0;while(j<keys.length-2&&p>keys[j+1][0])j++;const a=keys[j],b=keys[j+1],u=smooth((p-a[0])/(b[0]-a[0]));return {position:V(THREE.MathUtils.lerp(a[1],b[1],u),1.5,THREE.MathUtils.lerp(a[2],b[2],u)),target:V(THREE.MathUtils.lerp(a[3],b[3],u),0,0)};}
 return {group:k.group,story:workflowStories[kind],anchors,cameraAt,update(progress,time){k.animated.forEach(fn=>fn(progress,time));},dispose:k.dispose};
}
export function createExperienceWorld(index=0){
 const k=kit(),g=k.group;
 if(index<2){
  // Nanoinjection: a needle array reaches an immune-cell membrane; cargo travels
  // along the needles, giving the model a relationship to this actual role.
  const cell=k.cell(g,V(.4,.35,0),1.1);cell.rotation.z=.15;
  k.block(g,V(-.55,-1.15,0),V(2.9,.16,1.45),k.m.cream);
  for(let i=0;i<12;i++){const x=(i%4-1.5)*.55-.55,z=(Math.floor(i/4)-1)*.48;const o=new THREE.Mesh(new THREE.ConeGeometry(.055,1.15,10),k.m.gold);o.position.set(x,-.55,z);g.add(o);k.stream(g,V(x,-.95,z),V(x,.02,z),i*.1);}k.text(g,'Nanoinjection / immune-cell delivery',V(0,1.85,.2),.19);
 }else if(index===2){const groups=[new THREE.Group(),new THREE.Group(),new THREE.Group()];build(k,2,groups);g.add(groups[1]);groups[1].scale.setScalar(1.3);}else{const groups=[new THREE.Group(),new THREE.Group(),new THREE.Group()];build(k,6,groups);g.add(groups[0]);g.add(groups[1]);groups[0].position.x=-1.1;groups[1].position.x=1.2;groups[0].scale.setScalar(.7);groups[1].scale.setScalar(.9);}
 return {group:g,update(p,t){g.rotation.y=-.18+p*.3;k.animated.forEach(fn=>fn(p,t));},dispose(){g.traverse(o=>o.geometry?.dispose());k.dispose();}};
}
