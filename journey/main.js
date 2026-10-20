import * as THREE from 'three';
import './style.css';
import { initActivityWave } from './activity-wave.js';
initActivityWave();
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (innerWidth <= 768 && innerHeight <= 1024))) {
const root = document.documentElement;
const spineStudy=new URLSearchParams(location.search).get('study')==='spine';
if(spineStudy)root.classList.add('spine-study');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const section = document.getElementById('researchJourney');
const container = document.getElementById('container');
const intro = document.getElementById('intro');
const palette = { night: '#120848', violet: '#4a3a7a', dusk: '#b892b8', mist: '#a8a9bd', wall: '#979eb7', gold: '#D0BA98', blue: '#516DB0', red: '#91040C', white: '#ffffff', ink: '#242320' };
const stops = [[0, palette.night], [.35, palette.violet], [.6, palette.dusk], [.85, palette.mist], [1, palette.wall]].map(([t, hex]) => ({ t, color: new THREE.Color(hex) }));
const captions = [
    [0, .13, 'left', '01 / RESEARCH', 'Nan Wang', 'Computational Biology · Biomedical AI', '计算生物学 · 生物医学 AI'],
    [.13, .25, 'left', 'LIFE, IN PATTERNS', 'From sequence<br>to <em>insight.</em>', 'Immune repertoires · molecular structure · interpretable models', '免疫组库 · 分子结构 · 可解释模型'],
    [.25, .30, 'right', '02 / META-ACDC', 'Recognition,<br><em>reconsidered.</em>', 'TCR off-target prediction · EGNN · side-chain AUROC 0.933', 'TCR 脱靶风险预测 · 等变图神经网络 · AUROC 0.933'],
    [.30, .35, 'right', 'META-ACDC / ACTIVE LEARNING', '4.65 million<br><em>possibilities.</em>', '≈2× positive-recall gain at a 6% sampling budget · simulated screen', '模拟筛选约 465 万候选肽 · 6% 采样预算 · 阳性召回增益约 2 倍'],
    [.35, .40, 'left', 'MEDLIT EVIDENCE', 'Evidence,<br>with <em>context.</em>', 'Medical literature QA · 27,978 papers · risk-model AUROC 0.856', '医学文献问答 · 27,978 篇论文 · 撤稿风险模型 AUROC 0.856'],
    [.40, .45, 'left', 'MEDLIT / TRACEABLE ANSWERS', 'Every answer,<br>a <em>source.</em>', 'PICO · evidence grading · PMID traceability · LightGBM + SHAP', 'PICO · 证据分级 · PMID 溯源 · LightGBM + SHAP'],
    [.45, .50, 'right', 'MULTI-OMICS INTEGRATION', 'One tissue.<br><em>Many worlds.</em>', 'Single-cell × spatial transcriptomics · tumor heterogeneity', '单细胞 × 空间转录组 · 肿瘤异质性'],
    [.50, .55, 'right', 'MULTI-OMICS / CELLULAR DIALOGUE', 'Signals<br>between <em>cells.</em>', 'PRRX2⁺ epithelial cells ↔ SPP1⁺ macrophages · gemcitabine resistance', 'PRRX2⁺ 上皮细胞 ↔ SPP1⁺ 巨噬细胞 · 吉西他滨耐药'],
    [.55,.5875,'left','03 / XIAMEN UNIVERSITY','Questions begin<br>with <em>curiosity.</em>','2021–2024 · MSc in Immunology · immune-repertoire research','2021–2024 · 厦门大学免疫学硕士 · 免疫组库研究'],
    [.5875,.625,'left','XIAMEN / IMMUNE RECOGNITION','Reading the<br><em>immune repertoire.</em>','T-cell receptor diversity · antigen-specific recognition','T 细胞受体多样性 · 抗原特异性识别'],
    [.625,.6625,'right','NATIONAL CANCER CENTER','Closer to<br><em>the clinic.</em>','2024–2025 · research assistant · CAMS Cancer Hospital','2024–2025 · 科研助理 · 中国医学科学院肿瘤医院'],
    [.6625,.70,'right','NCC / TRANSLATIONAL RESEARCH','A question<br>worth <em>translating.</em>','Lung-cancer neoantigen prediction · pathology research · research-project coordination','肺癌新抗原预测 · 病理研究支持 · 科研项目协调'],
    [.70,.7375,'left','YIXING BORUI','Data into<br><em>discovery.</em>','2025 · bulk RNA-seq × single-cell × spatial transcriptomics','2025 · bulk RNA-seq × 单细胞 × 空间转录组'],
    [.7375,.775,'left','YIXING / CELLULAR DIALOGUE','Resistance has<br>a <em>conversation.</em>','PDAC · PRRX2⁺ epithelial cells and SPP1⁺ macrophages · gemcitabine resistance','胰腺癌 · PRRX2⁺ 上皮细胞与 SPP1⁺ 巨噬细胞 · 吉西他滨耐药'],
    [.775,.8125,'right','OUJIANG LABORATORY','Engineering<br><em>new questions.</em>','2026–present · Nano–Immune Group · bioinformatics and research','2026–今 · 纳米免疫课题组 · 生物信息与科研'],
    [.8125,.85,'right','OUJIANG / CELL ENGINEERING','Delivering<br><em>possibility.</em>','Nanoinjection · non-viral CAR-T engineering · CRISPR precision and off-target evaluation','纳米注射 · 非病毒 CAR-T 工程 · CRISPR 精准性与脱靶评估'],
    [.85,.87,'left','04 / SCIENTIFIC CONTRIBUTIONS','Six papers.<br><em>One curiosity.</em>','J Hematol Oncol · co-first author · IF 40.4','J Hematol Oncol · 共同第一作者 · IF 40.4'],
    [.87,.89,'right','01 / IMMUNE RECOGNITION','A receptor.<br>A <em>recognition.</em>','SARS-CoV-2-specific T cells and their receptors\nJ Hematol Oncol, 2024','SARS-CoV-2 特异性 T 细胞及其受体 · J Hematol Oncol, 2024'],
    [.89,.91,'left','02 / REGENERATIVE IMMUNITY','Finding<br><em>balance.</em>','Ccl2-induced regulatory T cells · macrophage polarization · Advanced Science, 2024','Ccl2 诱导的调节性 T 细胞 · 巨噬细胞极化 · Advanced Science, 2024'],
    [.91,.93,'right','03 / REPERTOIRE LANDSCAPES','An immune<br><em>landscape.</em>','Intrarenal TCR repertoires in clear cell renal cell cancer · J Transl Med, 2022','肾透明细胞癌的肾内 TCR 组库图谱 · J Transl Med, 2022'],
    [.93,.95,'left','04 / T-CELL DIVERSITY','Different cells.<br><em>Shared questions.</em>','The γδ T-cell receptor repertoire in psoriasis · Immunol Cell Biol, 2024','银屑病中的 γδ T 细胞受体组库 · Immunol Cell Biol, 2024'],
    [.95,.97,'right','05 / MULTI-OMICS','Signals into<br><em>perspective.</em>','Immunogenicity × inflammation · immunotherapy in renal cancer · Front Cell Dev Biol','免疫原性 × 炎症 · 肾透明细胞癌免疫治疗 · Front Cell Dev Biol'],
    [.97,.985,'left','06 / MOLECULAR PATHOLOGY','Patterns behind<br><em>recurrence.</em>','Macrotrabecular massive HCC · molecular and clinicopathological profiling · under review','粗梁巨块型肝癌 · 分子及临床病理特征 · 审稿中'],
    [.985,1,'right','THE WORK CONTINUES','More to<br><em>discover.</em>','Explore the code ↗','探索 GitHub 项目 ↗']
];
const copyLayer = section.querySelector('.journey-copy');
const panels = captions.map((caption, index) => {
    const panel = document.createElement('article'); panel.className = `journey-panel journey-panel--${caption[2]}`;
    panel.innerHTML = `<span class="journey-kicker">${caption[3]}</span><h2>${caption[4].split('<br>').map(line => `<span class="journey-title-line"><span>${line}</span></span>`).join('')}</h2><p>${index === captions.length - 1 ? '<a href="https://github.com/QianRongAn" target="_blank" rel="noopener noreferrer"></a>' : ''}</p>`;
    copyLayer.appendChild(panel); return panel;
});
const progressBar = section.querySelector('.journey-progress-fill');
const progressNumber = section.querySelector('.journey-progress-number');
function localize() {
    const zh = root.lang.startsWith('zh');
    panels.forEach((panel, i) => { const p = panel.querySelector('p');let text=captions[i][zh ? 6 : 5];if(i>=17&&i<=22){if(!zh){const title=document.querySelectorAll('#publications .pub-title')[i-17]?.textContent.trim();const journal=['J Hematol Oncol, 2024','Advanced Science, 2024','J Transl Med, 2022','Immunol Cell Biol, 2024','Front Cell Dev Biol, 2025','Clin Transl Med (under review)'][i-17];text=title+'\n'+journal;}else{const cut=text.lastIndexOf(' · ');if(cut>=0)text=text.slice(0,cut).replaceAll(' · ', ' — ')+'\n'+text.slice(cut+3);}} (p.querySelector('a') || p).textContent=text;p.style.whiteSpace='pre-line';p.style.removeProperty('color');p.style.textShadow='none'; });
    section.querySelector('.journey-scroll').textContent = zh ? '向下滚动，探索研究之旅' : 'SCROLL TO EXPLORE';
}
localize();

const host = document.createElement('div'); host.id = 'journeyCanvas'; host.setAttribute('aria-hidden', 'true'); document.body.prepend(host);
let renderer;
try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' }); } catch (error) { host.dataset.state = 'fallback'; }
const scene = new THREE.Scene();
scene.background = new THREE.Color(palette.night); scene.fog = new THREE.FogExp2(palette.night, .047);
const camera = new THREE.PerspectiveCamera(47, 1, .1, 160);
const cameraCurve = new THREE.CatmullRomCurve3([
 new THREE.Vector3(0,1.4,14),new THREE.Vector3(1.8,4,2),new THREE.Vector3(-1.8,10,-12),
 new THREE.Vector3(.7,5.5,-28),new THREE.Vector3(-.7,-2.5,-44),new THREE.Vector3(1,-5,-59),
 new THREE.Vector3(-1.5,-1.5,-73),new THREE.Vector3(.4,3.5,-87),new THREE.Vector3(0,1.5,-99)
],false,'catmullrom',.3);
const gazeCurve = new THREE.CatmullRomCurve3([
 new THREE.Vector3(1,.6,0),new THREE.Vector3(2.8,-.3,-8),new THREE.Vector3(-3.8,.2,-21),
 new THREE.Vector3(3.6,.1,-35),new THREE.Vector3(-3.8,-2,-48),new THREE.Vector3(0,-3,-68),
 new THREE.Vector3(0,1,-82),new THREE.Vector3(2.7,.7,-104),new THREE.Vector3(0,1.5,-114)
],false,'catmullrom',.3);
// A close, black organic silhouette gives the first reveal a real foreground.
scene.add(camera);
const foreground=new THREE.Group();camera.add(foreground);
let orchidsReady=false;
const orchidAtlas=new THREE.TextureLoader().load('image/orchid-silhouette-atlas.png',()=>{orchidsReady=true;});
const silhouetteMat=new THREE.ShaderMaterial({uniforms:{map:{value:orchidAtlas},opacity:{value:.94}},transparent:true,depthWrite:false,side:THREE.DoubleSide,vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'uniform sampler2D map;uniform float opacity;varying vec2 vUv;void main(){float a=texture2D(map,vUv).a;if(a<.03)discard;gl_FragColor=vec4(vec3(0.),a*opacity);}'});
const orchidGlow=new THREE.Mesh(new THREE.PlaneGeometry(5,4),new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{opacity:{value:.16}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec2 vUv;uniform float opacity;void main(){float a=exp(-dot((vUv-.5)*4.,(vUv-.5)*4.));gl_FragColor=vec4(vec3(.48,.44,.57),a*opacity);}'}));orchidGlow.position.set(0,-.1,-3.2);foreground.add(orchidGlow);
const orchidScreens=[0,1].map(i=>{const plant=document.createElement('div');plant.className='journey-orchid-screen';plant.style.maskPosition=plant.style.webkitMaskPosition=i?'right center':'left center';host.appendChild(plant);return plant;});
const orchidFrames=[];
for(let i=0;i<2;i++){const geometry=new THREE.PlaneGeometry(2.1,2.8),uv=geometry.attributes.uv;for(let j=0;j<uv.count;j++)uv.setX(j,uv.getX(j)*.5+i*.5);const plant=new THREE.Mesh(geometry,silhouetteMat);plant.position.set(i?2:-2,-.15,-3);foreground.add(plant);orchidFrames.push(plant);}
const world = new THREE.Group(); scene.add(world);
scene.add(new THREE.HemisphereLight(palette.mist,palette.violet,.62));
const warm = new THREE.DirectionalLight(palette.gold, 2.7); warm.position.set(-7, 12, 8); scene.add(warm);
const blueLight = new THREE.DirectionalLight(palette.blue, 3.4); blueLight.position.set(7, 5, -7); scene.add(blueLight);
const materials = [];
function matte(color, glow = 0) {
    const mat = new THREE.MeshPhysicalMaterial({ color, roughness: .64, metalness: 0, clearcoat:.25, clearcoatRoughness:.32, sheen:.25, sheenColor:new THREE.Color(palette.dusk), emissive: color, emissiveIntensity: glow*.35, transparent: true });
    materials.push(mat); return mat;
}
const violet = matte(palette.violet, .1), blue = matte(palette.blue, .12), rose = matte(palette.dusk, .08), pearl = matte(palette.mist, .05), gold = matte(palette.gold, .4);
const atomGeometry = new THREE.IcosahedronGeometry(1, 2);
function orb(parent, x, y, z, radius, material) { const mesh = new THREE.Mesh(atomGeometry, material); mesh.position.set(x, y, z); mesh.scale.setScalar(radius); parent.add(mesh); return mesh; }
function line(parent, points, color, opacity = .5) {
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity }); mat.userData.baseOpacity = opacity; materials.push(mat);
    const mesh = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), mat); parent.add(mesh); return mesh;
}
function tube(parent, points, radius, material, segments = 100) {
    const curve = new THREE.CatmullRomCurve3(points); const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, segments, radius, 12, false), material); parent.add(mesh); return mesh;
}
let seed = 18421;
function random() { seed = seed * 16807 % 2147483647; return (seed - 1) / 2147483646; }
function instanceSpheres(parent, count, material, positionFor) {
    const mesh = new THREE.InstancedMesh(atomGeometry, material, count), dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) { const p = positionFor(i); dummy.position.set(p[0], p[1], p[2]); dummy.scale.setScalar(p[3]); dummy.updateMatrix(); mesh.setMatrixAt(i, dummy.matrix); }
    parent.add(mesh); return mesh;
}

// Four closed wing membranes: cupped section, rolled edge and branching venation.
const life=new THREE.Group();life.position.set(3.4,.1,0);world.add(life);
const wings=new THREE.Group();life.add(wings);const wingPivots=[];
const microCanvas=document.createElement('canvas');microCanvas.width=microCanvas.height=128;const microCtx=microCanvas.getContext('2d'),microImage=microCtx.createImageData(128,128);
for(let y=0;y<128;y++)for(let x=0;x<128;x++){const n=128+Math.sin(x*1.8+y*.5)*18+Math.sin(y*2.3)*12+random()*15;const k=(y*128+x)*4;microImage.data[k]=microImage.data[k+1]=microImage.data[k+2]=n;microImage.data[k+3]=255;}microCtx.putImageData(microImage,0,0);
const microTexture=new THREE.CanvasTexture(microCanvas);microTexture.wrapS=microTexture.wrapT=THREE.RepeatWrapping;microTexture.repeat.set(5,5);
const foreOutline=new THREE.CatmullRomCurve3([new THREE.Vector3(.12,.28,0),new THREE.Vector3(.9,2.0,0),new THREE.Vector3(2.8,2.75,0),new THREE.Vector3(3.05,1.85,0),new THREE.Vector3(2.15,.65,0),new THREE.Vector3(.12,.12,0)],true,'catmullrom',.25);
const hindOutline=new THREE.CatmullRomCurve3([new THREE.Vector3(.12,.12,0),new THREE.Vector3(1.1,.35,0),new THREE.Vector3(2.15,-.55,0),new THREE.Vector3(1.65,-1.7,0),new THREE.Vector3(.8,-1.65,0),new THREE.Vector3(.12,-.2,0)],true,'catmullrom',.25);
function wingPoint(u,v,side,hind){
 const edge=(hind?hindOutline:foreOutline).getPoint(v),rootY=hind?-.05:.25;
 return new THREE.Vector3(side*(.12+(edge.x-.12)*u),rootY+(edge.y-rootY)*u,Math.sin(u*Math.PI)*.32+Math.pow(u,3)*(.18+Math.sin(v*7)*.10)+Math.pow(u,9)*Math.sin(v*48)*.025+(hind?-.12:0));
}

for(const side of [-1,1])for(const hind of [false,true]){
 const pivot=new THREE.Group();pivot.userData={side,hind};wings.add(pivot);wingPivots.push(pivot);
 const verts=[],uvs=[],indices=[],colors=[],U=32,V=44,layerSize=(U+1)*(V+1),c1=new THREE.Color(palette.blue),c2=new THREE.Color(palette.dusk);
 for(let layer=0;layer<2;layer++)for(let j=0;j<=V;j++)for(let i=0;i<=U;i++){
  const u=i/U,v=j/V,p=wingPoint(u,v,side,hind);p.z+=(layer?-.012:.012);verts.push(p.x,p.y,p.z);uvs.push(u,v);
  const c=c1.clone().lerp(c2,.18+u*.58+Math.sin(v*8)*.08);colors.push(c.r,c.g,c.b);
  if(i<U&&j<V){const n=layer*layerSize+j*(U+1)+i;layer?indices.push(n,n+U+2,n+1,n,n+U+1,n+U+2):indices.push(n,n+1,n+U+2,n,n+U+2,n+U+1);}
 }
 const edge=[];for(let i=0;i<=U;i++)edge.push(i);for(let j=1;j<=V;j++)edge.push(j*(U+1)+U);for(let i=U-1;i>=0;i--)edge.push(V*(U+1)+i);for(let j=V-1;j>0;j--)edge.push(j*(U+1));
 for(let i=0;i<edge.length;i++){const a=edge[i],b=edge[(i+1)%edge.length];indices.push(a,a+layerSize,b+layerSize,a,b+layerSize,b);}
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));geometry.setAttribute('normal',new THREE.Float32BufferAttribute(new Float32Array(verts.length),3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geometry.setIndex(indices);geometry.computeVertexNormals();
 const material=new THREE.MeshPhysicalMaterial({color:palette.white,vertexColors:true,roughness:.34,metalness:0,iridescence:.52,iridescenceIOR:1.3,iridescenceThicknessRange:[180,440],transmission:.13,thickness:.024,ior:1.35,clearcoat:.35,clearcoatRoughness:.25,bumpMap:microTexture,bumpScale:.018,side:THREE.DoubleSide,transparent:true,opacity:1});materials.push(material);pivot.add(new THREE.Mesh(geometry,material));
 for(let j=1;j<11;j++){
  const v=j/11,points=Array.from({length:33},(_,k)=>{const u=k/32,p=wingPoint(u,v+Math.sin(u*Math.PI)*.022,side,hind);p.z+=.019;return p;});tube(pivot,points,.007,pearl,42);
  for(const branch of [-1,1]){const pts=Array.from({length:18},(_,k)=>{const u=.5+k/17*.48,p=wingPoint(u,v+branch*(u-.5)*.12,side,hind);p.z+=.02;return p;});tube(pivot,pts,.0035,rose,24);}
 }
 tube(pivot,Array.from({length:81},(_,i)=>wingPoint(1,i/80,side,hind)),.012,rose,96);
}
const thorax=orb(wings,0,.15,.12,.23,violet);thorax.scale.multiply(new THREE.Vector3(.7,1.8,.8));
for(let i=0;i<10;i++){const segment=orb(wings,0,-.1-i*.115,.08,.108-i*.006,pearl);segment.scale.y=1.2*(.108-i*.006);}
orb(wings,0,.6,.12,.14,pearl);
for(const side of [-1,1]){tube(wings,[new THREE.Vector3(side*.06,.69,.12),new THREE.Vector3(side*.16,.98,.16),new THREE.Vector3(side*.36,1.18,.2)],.012,gold,30);orb(wings,side*.36,1.18,.2,.025,gold);for(let j=0;j<3;j++)tube(wings,[new THREE.Vector3(0,.2-j*.1,.15),new THREE.Vector3(side*.3,-.05-j*.16,.26),new THREE.Vector3(side*.45,-.25-j*.2,.08)],.009,violet,24);}
const dna = new THREE.Group(); dna.position.set(0, 0, -6); life.add(dna);
const strandA = [], strandB = [], rungPoints = [];
for (let i = 0; i < 56; i++) {
    const a = i * .23, y = (i - 27.5) * .15;
    const p = new THREE.Vector3(Math.cos(a) * 1.1, y, Math.sin(a) * 1.1), q = new THREE.Vector3(-p.x, y, -p.z);
    strandA.push(p); strandB.push(q); if (i % 2 === 0) rungPoints.push(p, q);
}
tube(dna, strandA, .085, blue); tube(dna, strandB, .085, rose);
const rungMaterial = new THREE.LineBasicMaterial({ color: palette.gold, transparent: true, opacity: .55 }); materials.push(rungMaterial);
dna.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(rungPoints), rungMaterial));
instanceSpheres(dna, 56, pearl, i => { const p = i % 2 ? strandA[i] : strandB[i]; return [p.x, p.y, p.z, .115]; });

// A curved sky dome gives the chambers a horizon and a directional colour field.
const skyUniforms={zenith:{value:new THREE.Color(palette.night)},horizon:{value:new THREE.Color(palette.violet)},clock:{value:0}};
const skyFragment=`varying vec3 direction;
uniform vec3 zenith;uniform vec3 horizon;uniform float clock;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);}
void main(){
 vec3 d=normalize(direction);vec2 uv=vec2(atan(d.z,d.x)/6.28318+.5,asin(d.y)/3.14159+.5);
 float h=smoothstep(-.2,.75,d.y);vec3 color=mix(horizon,zenith,h);
 float clouds=noise(uv*vec2(13.,7.)+vec2(clock*.002,0.))*.65+noise(uv*vec2(29.,19.)-vec2(clock*.001,0.))*.25;
 color+=mix(horizon,zenith,.5)*(clouds-.35)*.22;
 float ribbon=.62+.10*sin(uv.x*14.+clock*.015)+.035*sin(uv.x*35.-clock*.01);
 float aurora=exp(-pow((uv.y-ribbon)*37.,2.))*(.35+.65*noise(vec2(uv.x*60.,uv.y*3.)));
 color+=vec3(.14,.17,.30)*aurora*.28;
 vec2 grid=uv*vec2(350.,180.);vec2 id=floor(grid),f=fract(grid)-.5;float star=step(.985,hash(id))*exp(-dot(f,f)*170.)*(.65+.35*sin(clock*.15+hash(id)*24.));
 color+=vec3(.55,.59,.72)*star*smoothstep(.46,.7,uv.y);
 gl_FragColor=vec4(color,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
const atmosphere=new THREE.Mesh(new THREE.SphereGeometry(145,48,32),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:skyUniforms,vertexShader:'varying vec3 direction;void main(){direction=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:skyFragment}));atmosphere.position.z=-50;scene.add(atmosphere);
// Distant painted cloud banks: broad flat bases and unequal rising lobes.
const skyObjects=new THREE.Group();world.add(skyObjects);
const cloudRamp=new THREE.DataTexture(new Uint8Array([105,155,205,245]),4,1,THREE.RedFormat);cloudRamp.minFilter=cloudRamp.magFilter=THREE.NearestFilter;cloudRamp.needsUpdate=true;
const cloudMaterial=new THREE.MeshToonMaterial({color:palette.white,vertexColors:true,gradientMap:cloudRamp,transparent:true,opacity:.86});materials.push(cloudMaterial);
const cloudGeometry=new THREE.SphereGeometry(1,24,16),cloudBanks=[];
const cloudP=cloudGeometry.attributes.position,cloudColors=[];for(let i=0;i<cloudP.count;i++){const x=cloudP.getX(i),y=cloudP.getY(i),z=cloudP.getZ(i),r=1+.035*Math.sin(x*19+y*11)*Math.cos(z*17);cloudP.setXYZ(i,x*r,y*r,z*r);const tint=new THREE.Color('#a8a9bd').lerp(new THREE.Color('#fff9ee'),THREE.MathUtils.smoothstep(y,-.65,.75));cloudColors.push(tint.r,tint.g,tint.b);}cloudGeometry.setAttribute('color',new THREE.Float32BufferAttribute(cloudColors,3));cloudGeometry.computeVertexNormals();
for(let i=0;i<12;i++){const bank=new THREE.Group();bank.position.set((i%2?1:-1)*(15+random()*18),9+random()*8,-50-i*12);bank.rotation.y=random()*.6;skyObjects.add(bank);cloudBanks.push(bank);
 for(let j=0;j<9;j++){const lobe=new THREE.Mesh(cloudGeometry,cloudMaterial),a=j/8;const hump=Math.sin(a*Math.PI);lobe.position.set((a-.5)*11,Math.pow(hump,1.4)*(1.3+random()*1.8),Math.sin(j*2.1)*.9);lobe.scale.set(2+random()*1.9,.75+hump*1.8,1.1+random());bank.add(lobe);}
}
const moonGeometry=new THREE.SphereGeometry(3.1,64,40);
const lunarCanvas=document.createElement('canvas');lunarCanvas.width=1024;lunarCanvas.height=512;const lunarContext=lunarCanvas.getContext('2d');
lunarContext.fillStyle='#efbdad';lunarContext.fillRect(0,0,1024,512);
for(let i=0;i<160;i++){const x=random()*1024,y=random()*512,r=10+random()*110;for(const offset of [-1024,0,1024]){const wash=lunarContext.createRadialGradient(x+offset,y,0,x+offset,y,r);wash.addColorStop(0,i%3?'rgba(112,88,100,.065)':'rgba(255,225,206,.13)');wash.addColorStop(1,'rgba(190,140,140,0)');lunarContext.fillStyle=wash;lunarContext.fillRect(x+offset-r,y-r,r*2,r*2);}}
for(let i=0;i<400;i++){const x=random()*1024,y=random()*512,r=1+random()*5;const wash=lunarContext.createRadialGradient(x,y,0,x,y,r);wash.addColorStop(0,'rgba(112,88,100,.08)');wash.addColorStop(1,'rgba(190,140,140,0)');lunarContext.fillStyle=wash;lunarContext.fillRect(x-r,y-r,r*2,r*2);}
const lunarTexture=new THREE.CanvasTexture(lunarCanvas);lunarTexture.colorSpace=THREE.SRGBColorSpace;
const moonMaterial=new THREE.MeshBasicMaterial({map:lunarTexture,color:'#fff0e7',fog:false,transparent:true});materials.push(moonMaterial);
const moon=new THREE.Mesh(moonGeometry,moonMaterial);moon.position.set(6.7,9.3,-92);skyObjects.add(moon);
const satellite=new THREE.Mesh(new THREE.SphereGeometry(1.25,32,24),blue);satellite.position.set(-25,16,-78);skyObjects.add(satellite);
const orbit=new THREE.Mesh(new THREE.TorusGeometry(2.1,.012,5,100),gold);orbit.rotation.set(.95,.2,.1);satellite.add(orbit);

// Meta-ACDC: side-chain contact graph with a peptide ribbon and one risk core.
const molecule = new THREE.Group(); molecule.position.set(-3.8, .2, -21); world.add(molecule);
const atoms = [];
for (let i = 0; i < 64; i++) { const a = random() * Math.PI * 2, h = random() * 2 - 1, r = 1.3 + random() * 1.1; atoms.push(new THREE.Vector3(Math.cos(a) * r, h * 2.6, Math.sin(a) * r)); }
instanceSpheres(molecule, atoms.length, blue, i => [atoms[i].x, atoms[i].y, atoms[i].z, .09 + random() * .1]);
const bonds = [];
atoms.forEach((p, i) => { for (let j = i + 1; j < atoms.length; j++) if (p.distanceTo(atoms[j]) < 1.25) bonds.push(p, atoms[j]); });
const bondMaterial = new THREE.LineBasicMaterial({ color: palette.blue, transparent: true, opacity: .48 }); materials.push(bondMaterial);
molecule.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(bonds), bondMaterial));
const peptide = Array.from({ length: 30 }, (_, i) => new THREE.Vector3(Math.sin(i * .45) * .62, (i - 14.5) * .19, Math.cos(i * .45) * .62));
tube(molecule, peptide, .10, gold, 120); orb(molecule, .35, .2, .1, .23, matte(palette.red, .2));

// MedLit: thin, curled fibre-paper records orbit a fixed evidence core.
const evidence = new THREE.Group(); evidence.position.set(3.6, .1, -35); world.add(evidence);
const evidenceRotor=new THREE.Group();evidence.add(evidenceRotor);
const evidencePointer={x:0,y:0},evidenceTurn={z:0,y:0};
addEventListener('pointermove',event=>{evidencePointer.x=(event.clientX/innerWidth-.5)*2;evidencePointer.y=(event.clientY/innerHeight-.5)*2;},{passive:true});
const pageGeometry=new THREE.BoxGeometry(1.45,1.9,.012,16,24,1),pagePosition=pageGeometry.attributes.position;
for(let i=0;i<pagePosition.count;i++){const x=pagePosition.getX(i),y=pagePosition.getY(i);pagePosition.setZ(i,pagePosition.getZ(i)+.065*Math.sin(x*2.2)+.04*y*y+.17*Math.pow(Math.max(0,(x+y-.65)/1.05),2));}pageGeometry.computeVertexNormals();
function evidencePaper(index,research=false){const canvas=document.createElement('canvas');canvas.width=640;canvas.height=840;const c=canvas.getContext('2d');c.fillStyle=index%3===0?'#e9dee6':'#eceaf0';c.fillRect(0,0,640,840);
 // Subpixel fibres and interrupted ink lines remain matte under grazing light.
 for(let k=0;k<11000;k++){const x=random()*640,y=random()*840;c.strokeStyle=random()>.5?'rgba(74,58,122,.045)':'rgba(255,255,255,.22)';c.lineWidth=.5;c.beginPath();c.moveTo(x,y);c.lineTo(x+random()*5,y+random()*2);c.stroke();}
 c.fillStyle='#514967';c.font='18px Georgia';c.fillText((research?'PUBLICATIONS / RESEARCH PAPER 0':'MEDLIT / EVIDENCE RECORD 0')+(index+1),55,65);c.fillRect(55,87,530,1);
 if(research){c.font='28px Georgia';wrapText(c,document.querySelectorAll('#publications .pub-title')[index]?.textContent||'Research paper',55,140,530,34);}else{c.font='bold 36px Georgia';['Clinical evidence','Source traceability','Study design'][index%3].split(' ').forEach((word,j)=>c.fillText(word,55,146+j*42));}
 c.font='italic 20px Georgia';c.fillText(research?'Research · Nan Wang':'A question. A study. A source.',55,research?290:255);
 for(let column=0;column<2;column++)for(let row=0;row<24;row++){c.fillStyle=row%8===0?'#686078':'#9290a2';c.fillRect(55+column*280,310+row*15,180+random()*65,2);}
 c.strokeStyle='#8d879c';c.lineWidth=1;c.strokeRect(55,700,530,66);c.font='18px Arial';c.fillStyle='#514967';c.fillText(['PICO · structured question','PMID · traceable source','GRADE · evidence level'][index%3],74,739);
 const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=renderer?.capabilities.getMaxAnisotropy()||1;
 const mat=new THREE.MeshPhysicalMaterial({map,color:palette.white,roughness:.91,metalness:0,clearcoat:0,sheen:.12,bumpMap:microTexture,bumpScale:.008,side:THREE.DoubleSide,transparent:true});materials.push(mat);return mat;
}
for (let i = 0; i < 9; i++) {
    const sheet = new THREE.Group(), a = i / 9 * Math.PI * 2;
    sheet.position.set(Math.cos(a) * 2, Math.sin(a) * 1.9, Math.sin(a * 2) * .8); sheet.rotation.set(.12, a * .3, Math.sin(a) * .2);
    sheet.add(new THREE.Mesh(pageGeometry,evidencePaper(i)));
    evidenceRotor.add(sheet);
    line(evidenceRotor, [sheet.position.clone(), new THREE.Vector3(0, 0, .4)], palette.gold, .24);
}
orb(evidence, 0, 0, .4, .48, gold);
// The second MedLit beat follows a visible record → assessment → source chain.
const sourceTrail=new THREE.Group();sourceTrail.position.set(2.5,-1.5,-43);world.add(sourceTrail);
for(let i=0;i<3;i++){const record=new THREE.Mesh(pageGeometry,evidencePaper(i));record.position.set((i-1)*1.65,Math.sin(i*1.4)*.55,-i*.75);record.scale.setScalar(.72);record.rotation.set(-.12,(i-1)*-.20,.06);sourceTrail.add(record);if(i){const previous=new THREE.Vector3((i-2)*1.65,Math.sin((i-1)*1.4)*.55,-(i-1)*.75);line(sourceTrail,[previous,record.position.clone()],palette.gold,.48);}orb(sourceTrail,record.position.x,record.position.y-.95,record.position.z,.055,gold);}

// A curved phospholipid bilayer with outward heads, paired inward tails and
// a generic receptor–linker–ligand schematic (not an atomistic protein model).
const tissue=new THREE.Group(),bilayerView=new THREE.PerspectiveCamera(47,1,.1,160);bilayerView.position.copy(cameraCurve.getPoint(.475));bilayerView.lookAt(gazeCurve.getPoint(.475));bilayerView.updateMatrixWorld();tissue.position.copy(new THREE.Vector3(-2.9,-.45,-9.5).applyMatrix4(bilayerView.matrixWorld));tissue.quaternion.copy(bilayerView.quaternion);tissue.scale.setScalar(.72);world.add(tissue);
const bilayer=new THREE.Group();bilayer.rotation.set(.35,.12,-.12);tissue.add(bilayer);
const lipidSites=[];
for(let row=0;row<13;row++)for(let col=0;col<21;col++){
 const x=(col-10)*.27+(row%2)*.135,z=(row-6)*.27;
 if(Math.hypot(x-1.1,z-.15)<.43||Math.hypot(x+1.3,z+.30)<.35)continue;
 lipidSites.push({x,z,y:.19*Math.sin(x*.9)+.09*Math.cos(z*1.5)});
}
const lipidHeadMaterial=matte('#c8cddd',.025);lipidHeadMaterial.roughness=.84;lipidHeadMaterial.clearcoat=0;lipidHeadMaterial.bumpMap=microTexture;lipidHeadMaterial.bumpScale=.032;lipidHeadMaterial.reflectivity=.18;
const lipidTailMaterial=matte('#8196bd',.02);lipidTailMaterial.roughness=.88;lipidTailMaterial.bumpMap=microTexture;lipidTailMaterial.bumpScale=.018;lipidTailMaterial.clearcoat=0;
const lipidHeads=new THREE.InstancedMesh(new THREE.SphereGeometry(.132,16,10),lipidHeadMaterial,lipidSites.length*2);
const tailCurve=new THREE.CatmullRomCurve3([new THREE.Vector3(0,-.065,0),new THREE.Vector3(.025,-.19,.01),new THREE.Vector3(-.025,-.31,.015),new THREE.Vector3(.035,-.46,.025)]);
const lipidTails=new THREE.InstancedMesh(new THREE.TubeGeometry(tailCurve,10,.024,5,false),lipidTailMaterial,lipidSites.length*4),lipidDummy=new THREE.Object3D();
lipidSites.forEach((site,i)=>{for(let layer=0;layer<2;layer++){const sign=layer?-1:1;lipidDummy.position.set(site.x,site.y+sign*.49,site.z);lipidDummy.rotation.set(0,0,0);lipidDummy.scale.set(1,1,1);lipidDummy.updateMatrix();lipidHeads.setMatrixAt(i*2+layer,lipidDummy.matrix);lipidHeads.setColorAt(i*2+layer,new THREE.Color('#c8cddd').lerp(new THREE.Color('#c8cddd'),.08+(i%7)*.025));for(let tail=0;tail<2;tail++){lipidDummy.position.x=site.x+(tail?1:-1)*.047;lipidDummy.rotation.set(0,tail*Math.PI,layer*Math.PI);lipidDummy.updateMatrix();lipidTails.setMatrixAt(i*4+layer*2+tail,lipidDummy.matrix);}}});bilayer.add(lipidHeads,lipidTails);
const receptor=new THREE.Group();receptor.position.set(1.1,0,.15);bilayer.add(receptor);
instanceSpheres(receptor,210,matte('#89a8d5',.02),i=>{const a=random()*6.283,y=-.85+random()*2.1,r=.20+random()*.15;return [Math.cos(a)*r,y,Math.sin(a)*r,.10+random()*.07];});
const ligand=new THREE.Group();ligand.position.set(.5,2.25,.1);receptor.add(ligand);
instanceSpheres(ligand,90,matte('#d5b1c9',.02),i=>{const a=random()*6.283,h=random()*2-1,r=Math.sqrt(1-h*h)*(.15+random()*.24);return [Math.cos(a)*r,h*.40,Math.sin(a)*r,.075+random()*.055];});
tube(receptor,[new THREE.Vector3(0,1.1,0),new THREE.Vector3(.07,1.48,0),new THREE.Vector3(.38,1.73,.10),new THREE.Vector3(.5,1.98,.10)],.038,gold,42);
bilayer.traverse(part=>{if(part.isMesh){part.material.roughness=.82;part.material.clearcoat=0;part.material.bumpMap=microTexture;part.material.bumpScale=.025;}});
const channel=new THREE.Group();channel.position.set(-1.3,0,-.3);bilayer.add(channel);
for(let i=0;i<6;i++){const a=i/6*Math.PI*2;const helix=Array.from({length:40},(_,j)=>new THREE.Vector3(Math.cos(a)*.23+Math.cos(j*.55)*.065,-.78+j*.041,Math.sin(a)*.23+Math.sin(j*.55)*.065));tube(channel,helix,.065,rose,50);}
// Branched glycans sit on the outer leaflet, with a few dispersed partner molecules.
for(let i=0;i<5;i++){const x=-2.3+i*.9,z=.8,y=.19*Math.sin(x*.9)+.09*Math.cos(z*1.5)+.55;const root=new THREE.Vector3(x,y,z),tip=new THREE.Vector3(x+.13,y+.65,z);tube(bilayer,[root,new THREE.Vector3(x-.1,y+.3,z),tip],.022,gold,20);for(let j=0;j<3;j++){const end=new THREE.Vector3(x+.13+(j-1)*.20,y+.9-Math.abs(j-1)*.1,z+.06);tube(bilayer,[tip,end],.018,gold,12);orb(bilayer,end.x,end.y,end.z,.065,pearl);}}

// Deposited structures: UvrD-DNA (4C2U) and unmodified tRNA(Asp), chain A (6UGG).

const structureStudies=new THREE.Group(),structureView=new THREE.PerspectiveCamera(47,1,.1,160);structureView.position.copy(cameraCurve.getPoint(.525));structureView.lookAt(gazeCurve.getPoint(.525));structureView.updateMatrixWorld();structureStudies.position.copy(new THREE.Vector3(-2.8,0,-9.5).applyMatrix4(structureView.matrixWorld));structureStudies.quaternion.copy(structureView.quaternion);world.add(structureStudies);
const crisprStudy=new THREE.Group(),crisprView=new THREE.PerspectiveCamera(47,1,.1,160);crisprView.position.copy(cameraCurve.getPoint(.83125));crisprView.lookAt(gazeCurve.getPoint(.83125));crisprView.updateMatrixWorld();crisprStudy.position.copy(new THREE.Vector3(-2.8,-.1,-9.5).applyMatrix4(crisprView.matrixWorld));crisprStudy.quaternion.copy(crisprView.quaternion);world.add(crisprStudy);

for(const [code,position,size] of [['4c2u',[0,0,0],3.5],['6ugg',[0,0,-6],3.0],['4oo8',[0,0,0],3.7]])fetch('models/'+code+'-atoms.json').then(r=>{if(!r.ok)throw new Error('Structure '+code+' unavailable');return r.json();}).then(data=>{
 if(code==='6ugg')return;
 const coords=data.atoms.map(a=>new THREE.Vector3(a[0],a[1],a[2])),box=new THREE.Box3().setFromPoints(coords),center=box.getCenter(new THREE.Vector3()),extent=box.getSize(new THREE.Vector3()),scale=size/Math.max(extent.x,extent.y,extent.z);
 const model=new THREE.Group(),surfaceMaterial=matte('#c8cddd',.025);surfaceMaterial.roughness=.82;surfaceMaterial.clearcoat=0;surfaceMaterial.bumpMap=microTexture;surfaceMaterial.bumpScale=.025;surfaceMaterial.userData.molecular=true;surfaceMaterial.userData.baseOpacity=1;
 const atoms=new THREE.InstancedMesh(new THREE.SphereGeometry(1,8,5),surfaceMaterial,data.atoms.length),dummy=new THREE.Object3D();
 data.atoms.forEach((atom,i)=>{dummy.position.copy(coords[i]).sub(center).multiplyScalar(scale);const radius=({C:1.7,N:1.55,O:1.52,P:1.8,S:1.8}[atom[3]]||1.6)*scale;dummy.scale.setScalar(radius);dummy.updateMatrix();atoms.setMatrixAt(i,dummy.matrix);atoms.setColorAt(i,new THREE.Color(code==='4oo8'?(atom[4]==='A'?'#c8cddd':atom[4]==='B'?'#d5b1c9':'#89a8d5'):(atom[4]==='A'?'#89a8d5':atom[3]==='P'?'#d5b1c9':'#c8cddd')));});
 model.add(atoms);model.position.fromArray(position);model.rotation.set(.2,-.4,.35);model.userData.pdb=code.toUpperCase();(code==='4oo8'?crisprStudy:structureStudies).add(model);if(code==='6ugg'){const view=new THREE.PerspectiveCamera(47,1,.1,160);view.position.copy(cameraCurve.getPoint(.19));view.lookAt(gazeCurve.getPoint(.19));view.updateMatrixWorld();structureStudies.updateMatrixWorld(true);model.position.copy(structureStudies.worldToLocal(new THREE.Vector3(3,0,-10).applyMatrix4(view.matrixWorld)));}
}).catch(error=>{host.dataset.structureError=error.message;});

// The research timeline is one continuous sand-gold curve through four stations.
const careerNodes = [new THREE.Vector3(3.4, -2, -63), new THREE.Vector3(-3.1, -.5, -72), new THREE.Vector3(3.5, .8, -82), new THREE.Vector3(-3.3, 1.4, -92)];
const careerCurve = new THREE.CatmullRomCurve3(careerNodes);
const career = new THREE.Group(); world.add(career);
const rising = [];
career.add(new THREE.Mesh(new THREE.TubeGeometry(careerCurve, 180, .035, 7, false), gold));
careerNodes.forEach((p, i) => {
    const node = new THREE.Group(); node.position.copy(p); career.add(node);
    orb(node,0,0,0,.36,gold);
    const halo = new THREE.Mesh(new THREE.TorusGeometry(.85,.035,7,56),pearl);halo.rotation.y=i*.35;node.add(halo);
    for(let j=0;j<5;j++){const mote=orb(node,(random()-.5)*1.7,-1.2+random()*2.7,(random()-.5)*1.3,.025+random()*.025,gold);rising.push({mesh:mote,base:mote.position.y,phase:random()});}
});
// Xiamen garden rotunda: six columns, moulded cornice, ribbed dome and climbing ivy.
const careerMaterials=new Map();career.traverse(object=>{if(!object.isMesh)return;const source=object.material;if(!careerMaterials.has(source)){const local=source.clone();local.userData.careerTimeline=true;careerMaterials.set(source,local);materials.push(local);}object.material=careerMaterials.get(source);});
const pavilion=new THREE.Group();pavilion.position.set(3.4,meadowFloor(3.4,-66)+.10,-66);pavilion.scale.setScalar(.82);world.add(pavilion);
const stone=matte(palette.white,.02);stone.roughness=.86;stone.clearcoat=0;stone.bumpMap=microTexture;stone.bumpScale=.016;
const stoneShade=matte('#dcd8e0',.015);stoneShade.roughness=.9;stoneShade.clearcoat=0;
function pavilionCylinder(radius,height,y,material=stone){const part=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,height,64),material);part.position.y=y;pavilion.add(part);return part;}
[[2.22,.16,.08],[2.08,.16,.24],[1.94,.16,.40]].forEach(args=>pavilionCylinder(...args));
const columnProfile=[new THREE.Vector2(.25,0),new THREE.Vector2(.25,.08),new THREE.Vector2(.21,.13),new THREE.Vector2(.18,.17),new THREE.Vector2(.14,.24)];
const footGeometry=new THREE.LatheGeometry(columnProfile,24),shaftGeometry=new THREE.CylinderGeometry(.105,.14,2.14,20),capitalGeometry=new THREE.LatheGeometry(columnProfile.map(v=>new THREE.Vector2(v.x,v.y*-.8)),24);
for(let i=0;i<6;i++){const a=i/6*Math.PI*2,x=Math.cos(a)*1.62,z=Math.sin(a)*1.62;
 const base=new THREE.Mesh(footGeometry,stone);base.position.set(x,.48,z);pavilion.add(base);
 const shaft=new THREE.Mesh(shaftGeometry,stone);shaft.position.set(x,1.78,z);pavilion.add(shaft);
 const capital=new THREE.Mesh(capitalGeometry,stone);capital.position.set(x,3.02,z);pavilion.add(capital);
}
const corniceProfile=[[1.76,2.91],[1.89,2.96],[1.89,3.06],[2.00,3.10],[2.04,3.16],[2.04,3.22],[1.96,3.26],[1.99,3.33],[2.11,3.38],[2.11,3.46],[2.02,3.52]].map(([r,y])=>new THREE.Vector2(r,y));pavilion.add(new THREE.Mesh(new THREE.LatheGeometry(corniceProfile,72),stone));
pavilionCylinder(1.79,.08,2.95,stoneShade);
const dome=new THREE.Mesh(new THREE.SphereGeometry(2.02,64,28,0,Math.PI*2,0,Math.PI/2),stone);dome.scale.y=.71;dome.position.y=3.48;pavilion.add(dome);
for(let i=0;i<12;i++){const a=i/12*Math.PI*2,points=Array.from({length:28},(_,k)=>{const theta=k/27*Math.PI/2,r=2.04*Math.sin(theta);return new THREE.Vector3(Math.cos(a)*r,3.48+1.45*Math.cos(theta),Math.sin(a)*r);});tube(pavilion,points,.021,stoneShade,40);}
const dentils=new THREE.InstancedMesh(new THREE.BoxGeometry(.09,.12,.10),stoneShade,48),pavilionDummy=new THREE.Object3D();for(let i=0;i<48;i++){const a=i/48*Math.PI*2;pavilionDummy.position.set(Math.cos(a)*1.92,3.09,Math.sin(a)*1.92);pavilionDummy.rotation.y=-a;pavilionDummy.updateMatrix();dentils.setMatrixAt(i,pavilionDummy.matrix);}pavilion.add(dentils);
pavilionCylinder(.10,.09,4.98);orb(pavilion,0,5.08,0,.075,stone);
// Recessed frieze panels, dentil band, abaci and a front stair match the reference rotunda.
const panelRecess=matte('#c7c3ce');panelRecess.roughness=1;panelRecess.clearcoat=0;
for(let i=0;i<40;i++){const a=i/40*Math.PI*2;
 const panel=new THREE.Mesh(new THREE.BoxGeometry(.23,.095,.026),panelRecess);panel.position.set(Math.sin(a)*1.994,3.285,Math.cos(a)*1.994);panel.rotation.y=a;pavilion.add(panel);
 const rail=new THREE.Mesh(new THREE.BoxGeometry(.265,.023,.045),stone);rail.position.copy(panel.position);rail.position.y+=.061;rail.rotation.y=a;pavilion.add(rail);
}
const zigzag=Array.from({length:161},(_,i)=>{const a=i/160*Math.PI*2;return new THREE.Vector3(Math.cos(a)*1.91,3.035+(i%2?.032:-.032),Math.sin(a)*1.91);});tube(pavilion,zigzag,.014,stoneShade,160);
for(let i=0;i<6;i++){const a=i/6*Math.PI*2;const abacus=new THREE.Mesh(new THREE.BoxGeometry(.36,.075,.36),stone);abacus.position.set(Math.cos(a)*1.62,2.97,Math.sin(a)*1.62);abacus.rotation.y=-a;pavilion.add(abacus);}
for(let i=0;i<3;i++){const step=new THREE.Mesh(new THREE.BoxGeometry(1.85,.14,1.18-i*.22),stone);step.position.set(0,.07+i*.14,2.16-i*.08);pavilion.add(step);}
for(const x of [-1.1,1.1]){const plinth=new THREE.Mesh(new THREE.BoxGeometry(.46,.56,.68),stone);plinth.position.set(x,.28,2.1);pavilion.add(plinth);const cap=new THREE.Mesh(new THREE.BoxGeometry(.57,.08,.78),stone);cap.position.set(x,.60,2.1);pavilion.add(cap);}
const finialProfile=[[.13,4.91],[.14,4.97],[.095,5.03],[.09,5.1],[.045,5.17],[.07,5.21],[0,5.33]].map(([x,y])=>new THREE.Vector2(x,y));pavilion.add(new THREE.Mesh(new THREE.LatheGeometry(finialProfile,28),stone));

// Six paper-like leaves gradually resolve into a light, abstract constellation.
const publications = new THREE.Group(); publications.position.set(2.7, .7, -107); world.add(publications);
const paperLeaves = [];
for(let i=0;i<6;i++) {
    const a=i/6*Math.PI*2, mesh=new THREE.Mesh(pageGeometry,evidencePaper(i,true));
    mesh.position.set(Math.cos(a)*2.3,Math.sin(a)*2,.2*Math.cos(a)); mesh.rotation.set(-.15,a*.2,Math.sin(a)*.15);publications.add(mesh);paperLeaves.push(mesh);
    orb(publications,mesh.position.x,mesh.position.y,mesh.position.z,.085,gold);
}

// An inhabited, continuous biomorphic canyon: near surfaces occlude distant ones.
const habitat = new THREE.Group(); world.add(habitat);
const terrainMaterial=matte(palette.violet,.035), ridgeMaterial=matte(palette.blue,.025);
terrainMaterial.bumpMap=microTexture;terrainMaterial.bumpScale=.12;terrainMaterial.roughness=1;terrainMaterial.clearcoat=0;ridgeMaterial.bumpMap=microTexture;ridgeMaterial.bumpScale=.08;ridgeMaterial.roughness=.78;
const groundClock={value:0};
terrainMaterial.onBeforeCompile=shader=>{
 shader.uniforms.groundClock=groundClock;
 shader.vertexShader='varying vec3 surveyPosition;\n'+shader.vertexShader;
 shader.vertexShader=shader.vertexShader.replace('#include <worldpos_vertex>','#include <worldpos_vertex>\nsurveyPosition=(modelMatrix*vec4(transformed,1.)).xyz;');
 shader.fragmentShader='varying vec3 surveyPosition;uniform float groundClock;\n'+shader.fragmentShader;
 shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
 vec2 q=surveyPosition.xz;
 float patches=sin(q.x*1.7+sin(q.y*.8))*sin(q.y*2.1-q.x*.6);
 float grain=fract(sin(dot(floor(q*95.),vec2(127.1,311.7)))*43758.5453);
 diffuseColor.rgb*=.78+patches*.12+grain*.16;

 `);
};
const terrainGeometry=new THREE.PlaneGeometry(70,140,100,190);
const terrainPositions=terrainGeometry.attributes.position;
for(let i=0;i<terrainPositions.count;i++){
    const x=terrainPositions.getX(i),z=terrainPositions.getY(i);
    const banks=Math.pow(Math.min(Math.abs(x)/12,2),1.7)*3.2;
    const relief=Math.sin(x*.62+z*.14)*.4+Math.sin(x*1.4-z*.23)*.15+Math.sin(z*.38)*.22;
    terrainPositions.setZ(i,banks+relief-8/(1+Math.exp((z-10)*.18)));
}
terrainGeometry.computeVertexNormals();
const terrain=new THREE.Mesh(terrainGeometry,terrainMaterial);terrain.rotation.x=-Math.PI/2;terrain.position.set(0,-4,-48);habitat.add(terrain);
const pavilionMound=new THREE.Mesh(new THREE.SphereGeometry(1,32,16),terrainMaterial);pavilionMound.position.set(3.4,meadowFloor(3.4,-66)-.45,-66);pavilionMound.scale.set(2.3,.6,2.3);habitat.add(pavilionMound);
// Ground flowers are solid curved petals, stems and leaves, batched as instances.
function meadowFloor(x,z){const localZ=-(z+48);return -4+Math.pow(Math.min(Math.abs(x)/12,2),1.7)*3.2+Math.sin(x*.62+localZ*.14)*.4+Math.sin(x*1.4-localZ*.23)*.15+Math.sin(localZ*.38)*.22-8/(1+Math.exp((localZ-10)*.18));}
function petalGeometry(){
 const positions=[],indices=[],nx=8,ny=16,stride=nx+1;
 for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++){
  const u=j/ny,v=i/nx*2-1,w=.20*Math.pow(Math.sin(Math.PI*u),.7)+.008;
  positions.push(v*w,.12*Math.sin(u*Math.PI)+.24*u*u+.065*v*v*Math.sin(Math.PI*u),.07+u*.75);
 }
 for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const a=j*stride+i;indices.push(a,a+stride,a+1,a+1,a+stride,a+stride+1);}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();return g;
}
const meadow=new THREE.Group();habitat.add(meadow);
const flowerCount=480,petalsPerFlower=7,flowerPetalGeometry=petalGeometry();
const petalMaterial=new THREE.MeshPhysicalMaterial({color:'#ffffff',roughness:.48,metalness:0,transmission:0,thickness:.035,ior:1.36,clearcoat:.28,sheen:.7,sheenColor:palette.mist,iridescence:.18,iridescenceThicknessRange:[180,300],bumpMap:microTexture,bumpScale:.012,side:THREE.DoubleSide});materials.push(petalMaterial);
const foliageMaterial=matte(palette.blue,.015);foliageMaterial.roughness=.6;
const petals=new THREE.InstancedMesh(flowerPetalGeometry,petalMaterial,flowerCount*petalsPerFlower);
const leaves=new THREE.InstancedMesh(flowerPetalGeometry,foliageMaterial,flowerCount*3);
const stems=new THREE.InstancedMesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0,0,0),new THREE.Vector3(.025,.33,.02),new THREE.Vector3(.13,.68,.035),new THREE.Vector3(.28,1,.05)]),12,.025,5,false),foliageMaterial,flowerCount);
const flowerCenters=new THREE.InstancedMesh(new THREE.SphereGeometry(1,10,7),gold,flowerCount);
const stamens=new THREE.InstancedMesh(new THREE.SphereGeometry(1,6,4),pearl,flowerCount*9);
const flowerDummy=new THREE.Object3D(),flowerRoot=new THREE.Object3D(),flowerPositions=[];
const blossomColors=[palette.dusk,palette.mist,palette.blue];
for(let i=0;i<flowerCount;i++){
 const side=i%2?1:-1,patch=Math.floor(i/60),z=12-patch*14-random()*12,x=side*((i%5===0?.4:2.2)+random()*7.5),floor=meadowFloor(x,z),height=(.55+random()*1.15)*(Math.hypot(x-3.4,z+66)<7?.30:1),scale=(.45+random()*.60)*(Math.hypot(x-3.4,z+66)<7?.27:1),bend=random()*Math.PI*2,hx=x+Math.cos(bend)*.28,hz=z-Math.sin(bend)*.28;
 flowerPositions.push({x,y:floor,z,height});
 flowerDummy.position.set(x,floor,z);flowerDummy.rotation.set(0,bend,0);flowerDummy.scale.set(1,height,1);flowerDummy.updateMatrix();stems.setMatrixAt(i,flowerDummy.matrix);
 flowerRoot.position.set(hx,floor+height,hz);flowerRoot.rotation.set((random()-.5)*.85,random()*Math.PI,(random()-.5)*.75);flowerRoot.scale.setScalar(scale);flowerRoot.updateMatrix();
 for(let j=0;j<petalsPerFlower;j++){flowerDummy.position.set(0,0,0);flowerDummy.rotation.set(0,j/petalsPerFlower*Math.PI*2,0);flowerDummy.scale.set(1,1,1);flowerDummy.updateMatrix();petals.setMatrixAt(i*petalsPerFlower+j,new THREE.Matrix4().multiplyMatrices(flowerRoot.matrix,flowerDummy.matrix));petals.setColorAt(i*petalsPerFlower+j,new THREE.Color(blossomColors[i%3]).lerp(new THREE.Color(palette.mist),random()*.3));}
 flowerDummy.position.set(hx,floor+height+.10*scale,hz);flowerDummy.rotation.set(0,0,0);flowerDummy.scale.set(.17*scale,.09*scale,.17*scale);flowerDummy.updateMatrix();flowerCenters.setMatrixAt(i,flowerDummy.matrix);
 for(let j=0;j<9;j++){const angle=j/9*Math.PI*2;flowerDummy.position.set(hx+Math.cos(angle)*.12*scale,floor+height+.15*scale,hz+Math.sin(angle)*.12*scale);flowerDummy.scale.setScalar(.025*scale);flowerDummy.updateMatrix();stamens.setMatrixAt(i*9+j,flowerDummy.matrix);}
 for(let j=0;j<3;j++){flowerDummy.position.set(x+j*.05,floor+height*(.25+j*.17),z);flowerDummy.rotation.set(.48,j*2.4+i*.2,0);flowerDummy.scale.setScalar(Math.hypot(x-3.4,z+66)<7?.16:.43);flowerDummy.updateMatrix();leaves.setMatrixAt(i*3+j,flowerDummy.matrix);}
}
meadow.add(stems,leaves,petals,flowerCenters,stamens);
// A few translucent iris-like accents; the surrounding meadow stays soft and matte.
const irisMaterial=new THREE.MeshPhysicalMaterial({color:palette.mist,roughness:.18,metalness:.08,transparent:true,opacity:.64,depthWrite:false,clearcoat:.9,clearcoatRoughness:.12,iridescence:1,iridescenceIOR:1.36,iridescenceThicknessRange:[190,430],side:THREE.DoubleSide});materials.push(irisMaterial);
const irisPetals=new THREE.InstancedMesh(flowerPetalGeometry,irisMaterial,40*petalsPerFlower),irisVeins=[],irisMatrix=new THREE.Matrix4(),hiddenMatrix=new THREE.Matrix4().makeScale(0,0,0);let irisIndex=0;
for(let f=0;f<flowerCount;f+=12)for(let j=0;j<petalsPerFlower;j++){petals.getMatrixAt(f*petalsPerFlower+j,irisMatrix);irisPetals.setMatrixAt(irisIndex++,irisMatrix);petals.setMatrixAt(f*petalsPerFlower+j,hiddenMatrix);for(let k=0;k<10;k++){for(const u of [k/10,(k+1)/10]){const p=new THREE.Vector3(0,.14*Math.sin(u*Math.PI)+.28*u*u+.012,.07+u*.75).applyMatrix4(irisMatrix);irisVeins.push(p);}}}
const irisVeinMaterial=new THREE.LineBasicMaterial({color:palette.mist,transparent:true,opacity:.38});materials.push(irisVeinMaterial);meadow.add(irisPetals,new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(irisVeins),irisVeinMaterial));
const boulderGeometry=new THREE.SphereGeometry(1,48,36);
const bp=boulderGeometry.attributes.position;
for(let i=0;i<bp.count;i++){const x=bp.getX(i),y=bp.getY(i),z=bp.getZ(i);const r=1+.065*Math.sin(y*19+x*9)+.045*Math.cos(z*23-y*7);bp.setXYZ(i,x*r,y*r,z*r);}boulderGeometry.computeVertexNormals();
// Broken, overlapping brush-shaped foliage gives the roadside a painted forest edge.
const forest=new THREE.Group();habitat.add(forest);
const barkMaterial=matte(palette.violet,.015);barkMaterial.roughness=.97;barkMaterial.clearcoat=0;barkMaterial.bumpMap=microTexture;barkMaterial.bumpScale=.13;
const canopyMaterial=matte(palette.blue,.015);canopyMaterial.roughness=1;canopyMaterial.clearcoat=0;canopyMaterial.sheen=0;canopyMaterial.flatShading=true;
const treeCount=72,dabsPerTree=70,branchCount=5,treePlacements=[];
const trunks=new THREE.InstancedMesh(new THREE.CylinderGeometry(.10,.22,1,7,5),barkMaterial,treeCount*(branchCount+1));
const canopy=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1,1),canopyMaterial,treeCount*dabsPerTree),treeDummy=new THREE.Object3D();
function forestBranch(index,a,b,r){treeDummy.position.copy(a).lerp(b,.5);treeDummy.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),b.clone().sub(a).normalize());treeDummy.scale.set(r,a.distanceTo(b),r);treeDummy.updateMatrix();trunks.setMatrixAt(index,treeDummy.matrix);}
for(let i=0;i<treeCount;i++){
 const side=i%2?1:-1,z=14-Math.floor(i/2)*3.4,x=side*(11+random()*7),floor=meadowFloor(x,z),height=4.2+random()*4.3;treePlacements.push({x,z,floor,height});
 forestBranch(i*6,new THREE.Vector3(x,floor,z),new THREE.Vector3(x+side*.35,floor+height,z-.2),1);
 for(let b=0;b<branchCount;b++){const a=b*2.4+i,spread=1.2+random()*1.3;forestBranch(i*6+b+1,new THREE.Vector3(x,floor+height*(.35+b*.08),z),new THREE.Vector3(x+Math.cos(a)*spread,floor+height*(.63+b*.06),z+Math.sin(a)*spread),.48);}
 for(let j=0;j<dabsPerTree;j++){const a=random()*Math.PI*2,h=random()*2-1,r=Math.sqrt(1-h*h)*(1.1+random()*1.5);treeDummy.position.set(x+Math.cos(a)*r,floor+height*.75+h*height*.31,z+Math.sin(a)*r);treeDummy.rotation.set(random()*.9,random()*6,random()*.7);treeDummy.scale.set(.45+random()*.8,.15+random()*.32,.32+random()*.6);treeDummy.updateMatrix();canopy.setMatrixAt(i*dabsPerTree+j,treeDummy.matrix);const tint=new THREE.Color(palette.blue).lerp(new THREE.Color(j%7===0?palette.dusk:palette.mist),.10+random()*.26).multiplyScalar(.72+random()*.32);canopy.setColorAt(i*dabsPerTree+j,tint);}
}forest.add(trunks,canopy);
// Reuse the approved fir model across the complete forest; the original camera is unchanged.
const paintedForest=new THREE.Group();forest.add(paintedForest);
const firPainting=new THREE.TextureLoader().load('image/watercolour-fir-painted.png',()=>{
 forest.remove(trunks,canopy);trunks.geometry.dispose();canopy.geometry.dispose();host.dataset.forest='painted-watercolour-72';
});firPainting.colorSpace=THREE.SRGBColorSpace;
const paintedTreeMaterial=new THREE.MeshBasicMaterial({map:firPainting,transparent:true,alphaTest:.18,depthWrite:true,side:THREE.DoubleSide,fog:false});paintedTreeMaterial.userData.baseOpacity=1;materials.push(paintedTreeMaterial);
const paintedTreeGeometry=new THREE.PlaneGeometry(1,1);paintedTreeGeometry.translate(0,.5,0);
treePlacements.forEach((tree,i)=>{const sprite=new THREE.Mesh(paintedTreeGeometry,paintedTreeMaterial);sprite.position.set(tree.x,tree.floor,tree.z);sprite.scale.set(tree.height*2/3,tree.height,1);sprite.userData.tree=true;paintedForest.add(sprite);});

const botanicalSpecies=['bellflower','cymbidium','daisy','chrysanthemum','pompon','rose','peony','evening_primrose','camellia','phalaenopsis','lavender','water_lily','gladiolus'];
new GLTFLoader().load('models/meadow-flowers.glb',gltf=>{
 gltf.scene.updateMatrixWorld(true);let speciesCount=0;
 gltf.scene.traverse(part=>{if(!part.isMesh)return;const species=botanicalSpecies.indexOf(part.name);if(species<0)return;speciesCount++;
 const geometry=part.geometry.clone().applyMatrix4(part.matrixWorld),material=new THREE.MeshPhysicalMaterial({color:'#ffffff',vertexColors:true,roughness:.82,clearcoat:0,sheen:.25,side:THREE.DoubleSide,transparent:true,bumpMap:microTexture,bumpScale:.014});material.userData.baseOpacity=1;materials.push(material);
 const batch=new THREE.InstancedMesh(geometry,material,60),dummy=new THREE.Object3D();
 for(let j=0;j<60;j++){const cluster=Math.floor(j/10),a=j*2.39996+species,r=.16+Math.sqrt((j%10)/10)*.85,cx=(cluster%2?1:-1)*(2.8+(species%4)*1.5),cz=10-cluster*20-species*.72,x=cx+Math.cos(a)*r,z=cz+Math.sin(a)*r,near=Math.hypot(x-3.4,z+66)<7,scale=(.55+(Math.sin(j*12+species)*.5+.5)*.35)*(near?.7:1);
 dummy.position.set(x,meadowFloor(x,z)+.035,z);dummy.rotation.set(Math.sin(a*2)*.12,a,Math.cos(a)*.13);dummy.scale.setScalar(scale);dummy.updateMatrix();batch.setMatrixAt(j,dummy.matrix);}
 batch.computeBoundingSphere();meadow.add(batch);
 });host.dataset.botanicalSpecies=String(speciesCount);
},undefined,()=>{host.dataset.botanicalSpecies='unavailable';});

const grassGeometry=new THREE.PlaneGeometry(.075,1,1,9);grassGeometry.translate(0,.5,0);const gp=grassGeometry.attributes.position;for(let i=0;i<gp.count;i++){const h=gp.getY(i);gp.setX(i,gp.getX(i)*(.12+.88*Math.sin(Math.PI*h))*(1-h*.65)+h*h*.12);gp.setZ(i,h*h*.18);}grassGeometry.computeVertexNormals();
const grassMaterial=matte(palette.blue,.01);grassMaterial.side=THREE.DoubleSide;grassMaterial.roughness=1;grassMaterial.clearcoat=0;
const grass=new THREE.InstancedMesh(grassGeometry,grassMaterial,18000);
for(let i=0;i<grass.count;i++){const cluster=Math.floor(i/8),r=()=>{const v=Math.sin(cluster*127.1+19.7)*43758.5453;return v-Math.floor(v);},cx=(cluster%2?1:-1)*(.15+r()*11),cz=14-((cluster*.61803398875)%1)*119,x=cx+(random()-.5)*.6,z=cz+(random()-.5)*.6;treeDummy.position.set(x,meadowFloor(x,z)+.055,z);treeDummy.rotation.set((random()-.5)*.18,random()*6.28,(random()-.5)*.4);treeDummy.scale.set(.7+random()*1.3,(Math.abs(x)<2?.15:.35)+random()*(Math.abs(x)<2?.25:.85),1);treeDummy.updateMatrix();grass.setMatrixAt(i,treeDummy.matrix);grass.setColorAt(i,new THREE.Color(palette.blue).lerp(new THREE.Color(palette.mist),.30+random()*.42));}meadow.add(grass);
// A high, open chamber transitions into a submerged molecular garden.
for(let j=0;j<10;j++){
 const island=new THREE.Mesh(boulderGeometry,terrainMaterial);island.position.set((j%2?1:-1)*(5+random()*7),8+random()*9,7-j*6);island.scale.set(1.2+random()*2,1.5+random()*3,1+random()*2);island.rotation.z=random();habitat.add(island);
}
for(let j=0;j<18;j++){
 const side=j%2?1:-1,z=-35-j*3.5,rootX=side*(6+random()*5),floor=-10;
 for(let branch=0;branch<5;branch++){
  const pts=[new THREE.Vector3(rootX,floor,z),new THREE.Vector3(rootX+side*.2,floor+1.5,z-.2),new THREE.Vector3(rootX+Math.sin(branch*2)*.8,floor+2.5+branch*.25,z+Math.cos(branch)*.6),new THREE.Vector3(rootX+Math.sin(branch*2)*1.2,floor+3+branch*.3,z+Math.cos(branch)*.9)];
  tube(habitat,pts,.09+branch*.012,branch%2?rose:ridgeMaterial,40);
 }
}
const portalPoints=Array.from({length:80},(_,i)=>{const a=i/79*Math.PI;return new THREE.Vector3(Math.cos(a)*11,Math.sin(a)*11-7,-63+Math.sin(a*2)*1.5);});tube(habitat,portalPoints,.7,terrainMaterial,120);
const membraneGeometry=new THREE.PlaneGeometry(70,54,70,70);membraneGeometry.rotateX(-Math.PI/2);const mp=membraneGeometry.attributes.position;
for(let i=0;i<mp.count;i++)mp.setY(i,Math.sin(mp.getX(i)*.22+mp.getZ(i)*.3)*.12);membraneGeometry.computeVertexNormals();
const membraneMaterial=new THREE.MeshBasicMaterial({color:palette.mist,transparent:true,opacity:.065,depthWrite:false,side:THREE.DoubleSide});materials.push(membraneMaterial);const membrane=new THREE.Mesh(membraneGeometry,membraneMaterial);membrane.position.set(0,.2,-42);habitat.add(membrane);
// Foreground cell membranes, with nested pores and connecting filaments.
for(let i=0;i<24;i++){
    const side=i%2?1:-1,z=8-i*4.6,group=new THREE.Group();group.position.set(side*(5.5+random()*2),1+random()*3,z);group.rotation.set(random(),random()*2,random());habitat.add(group);
    const membrane=new THREE.Mesh(new THREE.TorusGeometry(.65+random()*.5,.08,9,52),i%3?ridgeMaterial:rose);group.add(membrane);
    for(let n=0;n<7;n++){const a=n/7*Math.PI*2;orb(group,Math.cos(a)*.55,Math.sin(a)*.55,.06,.055,pearl);}
}

const surveyDetails=new THREE.Group();habitat.add(surveyDetails);
for(let j=0;j<12;j++){
 const group=new THREE.Group();group.position.set((j%2?1:-1)*(5.5+random()*1.2),-1.5,j* -7+3);group.rotation.set(.3,Math.sin(j)*.4,j*.2);surveyDetails.add(group);
 const ticks=[];for(let k=0;k<48;k++){const a=k/48*Math.PI*2,r=.9;ticks.push(new THREE.Vector3(Math.cos(a)*r,Math.sin(a)*r,0),new THREE.Vector3(Math.cos(a)*(r+(k%4===0?.12:.045)),Math.sin(a)*(r+(k%4===0?.12:.045)),0));}
 const tickMaterial=new THREE.LineBasicMaterial({color:palette.gold,transparent:true,opacity:.22});materials.push(tickMaterial);group.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(ticks),tickMaterial));
 line(group,Array.from({length:65},(_,k)=>new THREE.Vector3(Math.cos(k/64*Math.PI*2)*.82,Math.sin(k/64*Math.PI*2)*.82,0)),palette.blue,.24);
}
for(let i=0;i<8;i++){
 const p=atoms[i*7],tip=p.clone().multiplyScalar(1.23);tube(molecule,[p,p.clone().lerp(tip,.4).add(new THREE.Vector3(0,.1,0)),tip],.022,pearl,20);orb(molecule,tip.x,tip.y,tip.z,.065,gold);
}



// 1,100 restrained ambient motes. All textures are generated locally on canvas.
const starCanvas=document.createElement('canvas');starCanvas.width=starCanvas.height=32;
const starCtx=starCanvas.getContext('2d'),radial=starCtx.createRadialGradient(16,16,0,16,16,16);
radial.addColorStop(0,palette.white);radial.addColorStop(.15,palette.gold);radial.addColorStop(1,'transparent');starCtx.fillStyle=radial;starCtx.fillRect(0,0,32,32);
const dustGeometry=new THREE.BufferGeometry(), dustPositions=new Float32Array(1100*3);
for(let i=0;i<1100;i++){dustPositions[i*3]=(random()-.5)*36;dustPositions[i*3+1]=(random()-.5)*20;dustPositions[i*3+2]=12-random()*119;}
dustGeometry.setAttribute('position',new THREE.BufferAttribute(dustPositions,3));
const dustMaterial=new THREE.PointsMaterial({color:palette.gold,size:.055,transparent:true,opacity:.38,map:new THREE.CanvasTexture(starCanvas),depthWrite:false});materials.push(dustMaterial);
const dust=new THREE.Points(dustGeometry,dustMaterial);world.add(dust);
materials.forEach(mat=>{if(mat.userData.baseOpacity===undefined)mat.userData.baseOpacity=mat.opacity;});

// Glass vertebrae: a procedural physical sculpture behind the literature cards.
const glassScene=new THREE.Scene();glassScene.background=new THREE.Color('#979eb7');glassScene.environmentIntensity=.65;const glassCamera=new THREE.PerspectiveCamera(40,1,.1,80);glassCamera.position.set(0,0,16);
const studyControls=spineStudy&&renderer?new OrbitControls(glassCamera,renderer.domElement):null;
const studyRotation={y:.85};let studyRotationGoal=.85,studyRotationTween;
if(studyControls){
 studyControls.enableDamping=true;studyControls.dampingFactor=.09;studyControls.enablePan=false;studyControls.enableZoom=false;studyControls.rotateSpeed=1.05;
 renderer.domElement.addEventListener('wheel',event=>{
  if(event.ctrlKey)return;event.preventDefault();
  const pixels=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1);
  studyRotationGoal+=THREE.MathUtils.clamp(pixels,-120,120)*.0065;
  studyRotationTween?.kill();
  if(window.gsap&&!motion.matches)studyRotationTween=window.gsap.to(studyRotation,{y:studyRotationGoal,duration:.42,ease:'power2.out',overwrite:true});else studyRotation.y=studyRotationGoal;
 },{passive:false});
}
const skeleton=new THREE.Group();skeleton.position.set(-.75,.4,0);glassScene.add(skeleton);
const glassMaterial=new THREE.MeshPhysicalMaterial({color:'#c5c4d2',metalness:1,roughness:.18,transmission:0,clearcoat:1,clearcoatRoughness:.10,iridescence:1,iridescenceIOR:1.46,iridescenceThicknessRange:[160,480],envMapIntensity:1.45,bumpMap:microTexture,bumpScale:.002});
// Actual BodyParts3D anatomy. Each source mesh keeps its original shape and pose.
// Only one shared rigid axis conversion, translation and uniform scale was applied.
const discMaterial=new THREE.MeshPhysicalMaterial({color:palette.mist,roughness:.42,transmission:.36,thickness:.04,ior:1.38,transparent:true,opacity:.78});
const anatomicalSpine=new THREE.Group();skeleton.add(anatomicalSpine);
host.dataset.anatomy='loading';
new GLTFLoader().load('models/bodyparts3d-spine.glb',gltf=>{
 gltf.scene.traverse(part=>{if(part.isMesh){part.material=part.name.startsWith('Intervertebral')?discMaterial:glassMaterial;}});
 anatomicalSpine.add(gltf.scene);host.dataset.anatomy='BodyParts3D-4.3';host.dataset.anatomyParts='24 vertebrae, 1 sacrum, 23 intervertebral discs';
},undefined,error=>{host.dataset.anatomy='load-failed';console.error('Anatomical spine asset failed to load',error);});
const anatomyCredit=document.createElement('a');anatomyCredit.className='anatomy-credit';anatomyCredit.href='models/bodyparts3d-license.txt';anatomyCredit.target='_blank';anatomyCredit.rel='noopener';anatomyCredit.textContent='Anatomy: BodyParts3D / DBCLS · CC BY-SA';document.body.appendChild(anatomyCredit);if(spineStudy){const studyHint=document.createElement('p');studyHint.className='spine-study-hint';studyHint.textContent='Scroll to rotate · Drag to inspect';document.body.appendChild(studyHint);}
const splinterPositions=[],splinterColors=[];
for(let i=0;i<520;i++){const a=i*.29,y=(random()-.5)*9,r=.65+random()*.6;splinterPositions.push(Math.cos(a)*r,y,Math.sin(a)*r);const c=new THREE.Color(i%4===0?palette.gold:palette.blue).lerp(new THREE.Color(palette.mist),random()*.6);splinterColors.push(c.r,c.g,c.b);}
const splinterGeometry=new THREE.BufferGeometry();splinterGeometry.setAttribute('position',new THREE.Float32BufferAttribute(splinterPositions,3));splinterGeometry.setAttribute('color',new THREE.Float32BufferAttribute(splinterColors,3));
const splinters=new THREE.Points(splinterGeometry,new THREE.PointsMaterial({vertexColors:true,size:.022,transparent:true,opacity:.46,depthWrite:false,map:new THREE.CanvasTexture(starCanvas)}));skeleton.add(splinters);
const edgeLight=new THREE.DirectionalLight(palette.blue,2);edgeLight.position.set(-4,3,-5);glassScene.add(edgeLight);
const rimLight=new THREE.DirectionalLight(palette.dusk,1.5);rimLight.position.set(4,-1,3);glassScene.add(rimLight);
glassScene.add(new THREE.HemisphereLight(palette.white,palette.blue,2));
if(renderer){const studio=new RoomEnvironment(),generator=new THREE.PMREMGenerator(renderer);glassScene.environment=generator.fromScene(studio,.04).texture;scene.environment=glassScene.environment;scene.environmentIntensity=.42;studio.dispose();generator.dispose();}
// Coloured studio ribbons are reflected by the chrome vertebrae only.
// Glass paper panels keep their neutral lighting for legible ink.
if(renderer){
 const metalStudio=new THREE.Scene();
 const metalSky=new THREE.Mesh(new THREE.SphereGeometry(40,48,24),new THREE.ShaderMaterial({side:THREE.BackSide,uniforms:{blue:{value:new THREE.Color(palette.blue)},rose:{value:new THREE.Color(palette.dusk)},gold:{value:new THREE.Color(palette.gold)}},vertexShader:'varying vec3 p;void main(){p=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`varying vec3 p;uniform vec3 blue;uniform vec3 rose;uniform vec3 gold;
 void main(){vec3 d=normalize(p);float a=atan(d.z,d.x);vec3 c=vec3(.035,.027,.055);
 float b=exp(-pow(sin(a+.35)*8.,2.));float r=exp(-pow(sin(a-1.2)*7.,2.));float g=exp(-pow(sin(a+2.2)*12.,2.));
 c+=blue*b*2.8+rose*r*2.2+gold*g*1.9;
 float white=exp(-pow((d.y-.55)*22.,2.))*.9+exp(-pow((d.y+.3)*32.,2.))*.45;c+=vec3(white);
 c*=.85+.15*sin(d.y*50.+a*8.);gl_FragColor=vec4(c,1.);}` }));
 metalStudio.add(metalSky);const metalGenerator=new THREE.PMREMGenerator(renderer);glassMaterial.envMap=metalGenerator.fromScene(metalStudio,.018).texture;metalGenerator.dispose();metalSky.geometry.dispose();metalSky.material.dispose();
}
// Curved solid glass sheets and printed content share the same world coordinates.
const glassCards=[];
const backdrop=new THREE.Mesh(new THREE.PlaneGeometry(160,90),new THREE.ShaderMaterial({depthWrite:false,uniforms:{},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec2 vUv;void main(){vec3 blue=vec3(.592,.620,.718),lilac=vec3(.83,.79,.86);float glow=exp(-8.*distance(vUv,vec2(.64,.68)));gl_FragColor=vec4(mix(blue,lilac,glow*.9),1.);}'}));backdrop.position.z=-26;glassScene.add(backdrop);
function sheetGeometry(w,h,depth,frontOnly=false){
 const nx=72,ny=36,positions=[],uvs=[],indices=[],stride=nx+1;
 // Rounded corners and a shallow cylindrical bend with a soft rolled rim.
 function point(u,v,back){let x=(u-.5)*w,y=(v-.5)*h,r=.19;const ay=Math.abs(y),edge=h/2-r;if(ay>edge){let reach=w/2-r+Math.sqrt(Math.max(0,r*r-(ay-edge)**2));x*=reach/(w/2);}const z=.31*(x/(w/2))**2+.045*Math.sin(x*1.3+y*.65)+.025*Math.cos(y*2.2)+back;return[x,y,z];}
 const surfaces=frontOnly?1:2;
 for(let side=0;side<surfaces;side++)for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++){let u=i/nx,v=j/ny;positions.push(...point(u,v,side?-depth:0));uvs.push(u,v);}
 const count=stride*(ny+1);
 for(let side=0;side<surfaces;side++)for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){let a=side*count+j*stride+i,b=a+1,c=a+stride,d=c+1;if(side)indices.push(a,c,b,b,c,d);else indices.push(a,b,c,b,d,c);}
 if(!frontOnly){let edge=[];for(let i=0;i<=nx;i++)edge.push(i);for(let j=1;j<=ny;j++)edge.push(j*stride+nx);for(let i=nx-1;i>=0;i--)edge.push(ny*stride+i);for(let j=ny-1;j>0;j--)edge.push(j*stride);edge.forEach((a,i)=>{let b=edge[(i+1)%edge.length];indices.push(a,a+count,b,b,a+count,b+count);});}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));g.setIndex(indices);g.computeVertexNormals();return g;
}
function wrapText(ctx,text,x,y,maxWidth,line){let words=text.split(/\s+/),row='';for(const word of words){let next=row?row+' '+word:word;if(ctx.measureText(next).width>maxWidth&&row){ctx.fillText(row,x,y);y+=line;row=word;}else row=next;}if(row)ctx.fillText(row,x,y);return y+line;}
async function printedPaper(card){
 const canvas=document.createElement('canvas');canvas.width=1600;canvas.height=1800;const c=canvas.getContext('2d');
 await document.fonts.ready;
 const images=await Promise.all([...card.querySelectorAll('.pub-image')].map(el=>new Promise(resolve=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>resolve(null);img.src=el.src;})));
 c.fillStyle='#514a67';c.font='24px Arial';c.fillText('RESEARCH / 0'+card.dataset.pubId,70,76);
 const fit=(img,x,y,w,h)=>{if(!img)return;let r=Math.min(w/img.width,h/img.height);c.drawImage(img,x+(w-img.width*r)/2,y+(h-img.height*r)/2,img.width*r,img.height*r);};
 fit(images[0],70,155,345,520);
 c.fillStyle='#292537';c.font='56px Recoleta, Georgia';let y=wrapText(c,card.querySelector('.pub-title').textContent.trim(),470,160,1040,67);
 c.font='34px Arial';c.fillStyle='#423c53';y=wrapText(c,card.querySelector('.pub-authors').textContent.trim(),470,y+28,1040,47);
 c.font='italic 34px Georgia';c.fillStyle='#51405e';y=wrapText(c,card.querySelector('.pub-journal').textContent.trim(),470,y+22,1040,46);
 const impact=(card.querySelector('.pub-impact')?.textContent||'').trim();if(impact){c.font='bold 32px Georgia';c.fillStyle='#353047';c.fillText(impact,470,y+23);y+=55;}
 const summary=card.querySelector('.pub-summary');if(summary){y=Math.max(y+45,760);c.strokeStyle='rgba(70,57,88,.25)';c.beginPath();c.moveTo(70,y-25);c.lineTo(1530,y-25);c.stroke();c.font='25px Arial';c.fillStyle='#675575';c.fillText('ABSTRACT',70,y+14);c.font='31px Georgia';c.fillStyle='#302b40';const words=summary.innerText.trim().split(/\s+/),rows=[];let row='';for(const word of words){const next=row?row+' '+word:word;if(c.measureText(next).width>695&&row){rows.push(row);row=word;}else row=next;}if(row)rows.push(row);const half=Math.ceil(rows.length/2);rows.forEach((line,i)=>c.fillText(line,i<half?70:835,y+70+(i%half)*43));card.dataset.printBottom=String(y+70+half*43);}
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=renderer?.capabilities.getMaxAnisotropy()||1;return texture;
}
function initGlassCards(){
 if(glassCards.length)return;
 const cards=[...document.querySelectorAll('#publications .publication-card')];if(cards.length!==6)return;
 cards.forEach((card,i)=>{const group=new THREE.Group();glassScene.add(group);const mat=new THREE.MeshPhysicalMaterial({color:new THREE.Color(['#d4cede','#c4ccdf','#dbcede'][i%3]),roughness:.24,metalness:0,transmission:.86,thickness:.10,ior:1.40,clearcoat:.18,clearcoatRoughness:.22,iridescence:.12,iridescenceThicknessRange:[180,320],envMapIntensity:.25,side:THREE.FrontSide});
 const sheet=new THREE.Mesh(sheetGeometry(7.1,7.99,.075),mat);group.add(sheet);
 // A second thin inset edge catches the light at grazing angles.
 const rim=new THREE.LineSegments(new THREE.EdgesGeometry(sheet.geometry,27),new THREE.LineBasicMaterial({color:'#f7eefb',transparent:true,opacity:.35}));group.add(rim);
 const ink=new THREE.Mesh(sheetGeometry(6.96,7.83,0,true),new THREE.MeshBasicMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,alphaTest:.01,toneMapped:false}));ink.position.z=.075;group.add(ink);printedPaper(card).then(texture=>{ink.material.map=texture;ink.material.needsUpdate=true;});glassCards.push(group);});
 root.classList.add('publication-webgl');
}
let paperPhase=0,paperSelection=-1;const paperMotion={phase:0};let paperTween;
function moveGlassCards(){initGlassCards();const selected=window.PublicationStage?.index||0;if(selected!==paperSelection){paperSelection=selected;let diff=selected-paperMotion.phase;while(diff>3)diff-=6;while(diff< -3)diff+=6;paperTween?.kill();if(window.gsap&&!motion.matches)paperTween=window.gsap.to(paperMotion,{phase:paperMotion.phase+diff,duration:1.15,ease:'power2.inOut',overwrite:true});else paperMotion.phase+=diff;}paperPhase=paperMotion.phase;
 glassCards.forEach((group,i)=>{let d=i-paperPhase;while(d>3)d-=6;while(d< -3)d+=6;let a=d*.95;const distance=Math.abs(d);group.position.set(1.8+Math.sin(a)*6.1,-d*8.6,3.2-distance*4.8);group.rotation.set(.025*Math.sin(a),a*.72-.08,.018*Math.sin(a));});
}

function publicationMode(){return skipped&&!!document.querySelector('#publications.active');}
function paintGlass(time){orchidScreens.forEach(plant=>plant.style.display='none');if(butterflyRenderer)butterflyRenderer.domElement.style.display='none';moveGlassCards();host.style.display='';host.style.zIndex='0';host.style.background='#979eb7';host.style.setProperty('--scene-focus','0px');host.style.setProperty('--scene-light','1');host.dataset.mode='publication-glass';skeleton.rotation.y=THREE.MathUtils.lerp(skeleton.rotation.y,.85+(window.PublicationStage?.index||0)*.85,.12)+.0008;skeleton.rotation.z=Math.sin(time*.12)*.10;skeleton.position.y=Math.sin(time*.3)*.12;skeleton.scale.setScalar(1.4);if(!spineStudy){glassCamera.position.y=THREE.MathUtils.lerp(glassCamera.position.y,window.PublicationStage?.spineOffset||0,.14);glassCamera.lookAt(0,glassCamera.position.y,0);}splinters.rotation.y=time*.045;if(spineStudy){backdrop.visible=false;glassCards.forEach(card=>card.visible=false);skeleton.position.x=0;skeleton.scale.setScalar(1.05);skeleton.rotation.z=.035;skeleton.rotation.y=studyRotation.y;glassScene.background.set('#12101f');host.style.background='#12101f';}if(studyControls)studyControls.update();if(renderer)renderer.render(glassScene,glassCamera);}
if(renderer){renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;host.appendChild(renderer.domElement);}
// Only the butterfly is blurred; the orchids and black stage stay sharp.
const butterflyScene=new THREE.Scene(),butterflyCamera=new THREE.PerspectiveCamera(47,1,.1,80);
butterflyCamera.position.set(0,0,14);butterflyCamera.lookAt(0,0,0);
[...scene.children].filter(item=>item.isLight).forEach(light=>butterflyScene.add(light.clone()));
butterflyScene.environmentIntensity=scene.environmentIntensity;butterflyScene.fog=new THREE.FogExp2(palette.night,.025);
let butterflyRenderer;
if(renderer){const canvas=document.createElement('canvas');canvas.className='journey-butterfly-layer';host.appendChild(canvas);butterflyRenderer={domElement:canvas,context:canvas.getContext('2d'),setSize(w,h){canvas.width=w;canvas.height=h;}};}

const gazePoint=new THREE.Vector3();
const clamp=THREE.MathUtils.clamp;
const whiteInk=new THREE.Color(palette.white),charcoalInk=new THREE.Color(palette.ink),textInk=new THREE.Color();
function smooth(a,b,x){const u=clamp((x-a)/(b-a),0,1);return u*u*(3-2*u);}
let frame=0,previous=0,current=0,target=0,elapsed=0,skipped=new URLSearchParams(location.search).get('enter')==='about';
let flightStarted=-1,wingClock=0,wingTime=0;
let sectionTop=0,travel=1,focusStarted=0,copyIndex=-1,copyStarted=0,oldCopy=-1,oldCopyStarted=0,lastWheel=0,wheelLock=0,requestedBeat=0,leavingJourney=false;let scrollTween;const scrollMotion={y:0};
function measure(){
    sectionTop=section.getBoundingClientRect().top+scrollY;travel=Math.max(1,section.offsetHeight-innerHeight);
    const mobile=false;
    [[life,3.4,.15,.68],[molecule,-3.8,-.1,.62],[evidence,3.6,.1,.68],[publications,2.7,.3,.7]].forEach(([group,x,mx,scale])=>{group.position.x=mobile?mx:x;group.scale.setScalar(mobile?scale:1);});career.scale.x=mobile?.3:1;
    if(renderer){glassCamera.aspect=innerWidth/innerHeight;glassCamera.updateProjectionMatrix();camera.aspect=innerWidth/innerHeight;camera.fov=mobile?58:47;camera.updateProjectionMatrix();const edge=Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*3*camera.aspect;orchidFrames[0].position.x=-edge+.18;orchidFrames[1].position.x=edge-.18;renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.setSize(innerWidth,innerHeight);if(butterflyRenderer){butterflyRenderer.setSize(innerWidth,innerHeight);butterflyCamera.aspect=camera.aspect;butterflyCamera.updateProjectionMatrix();}host.dataset.dpr=String(renderer.getPixelRatio());}updateTarget();
}
function updateTarget(){target=clamp((scrollY-sectionTop)/travel,0,1);}
function backgroundAt(t){let i=0;while(i<stops.length-2&&t>stops[i+1].t)i++;scene.background.lerpColors(stops[i].color,stops[i+1].color,clamp((t-stops[i].t)/(stops[i+1].t-stops[i].t),0,1));scene.fog.color.copy(scene.background);skyUniforms.zenith.value.copy(scene.background).multiplyScalar(.4);skyUniforms.horizon.value.copy(scene.background).lerp(new THREE.Color(palette.dusk),.14);}
function paint(t,time){
    paintedForest.children.forEach(tree=>{tree.rotation.y=Math.atan2(camera.position.x-tree.position.x,camera.position.z-tree.position.z);});
    skyUniforms.clock.value=time;groundClock.value=time;
    molecule.visible=t>.17&&t<.44;evidence.visible=t>.29&&t<.52;sourceTrail.visible=t>.38&&t<.49;tissue.visible=t>.37&&t<.60;structureStudies.visible=false;crisprStudy.visible=t>.78&&t<.90;career.visible=t>.48&&t<.821;pavilion.visible=t>.47&&t<.78;publications.visible=t>.845;dna.visible=t>.12;membrane.visible=false;
    const flight=flightStarted<0?0:smooth(0,3,time-flightStarted),opening=smooth(.065,.12,t),emergence=smooth(.075,.12,t);
    host.style.setProperty('--scene-focus','0px');host.style.setProperty('--scene-light','1');
    foreground.visible=t<.20;silhouetteMat.uniforms.opacity.value=1-smooth(.14,.20,t);
    const edge=Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*3*camera.aspect;
    orchidFrames.forEach((plant,i)=>{plant.position.x=THREE.MathUtils.lerp(i?-.75:.75,i?edge-.18:-edge+.18,opening);plant.scale.setScalar(.8+opening*.2);plant.visible=t>=.12;const screen=orchidScreens[i],unit=innerHeight/(2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*3);screen.style.display=t<.12?'block':'none';screen.style.width=`${2.1*plant.scale.x*unit}px`;screen.style.height=`${2.8*plant.scale.y*unit}px`;screen.style.left=`${innerWidth/2+plant.position.x*unit}px`;screen.style.top=`${innerHeight/2-plant.position.y*unit}px`;});
    orchidGlow.material.uniforms.opacity.value=.24*(1-opening);
    backgroundAt(t);scene.background.multiplyScalar(emergence);skyUniforms.horizon.value.multiplyScalar(emergence);scene.fog.color.copy(scene.background);
    atmosphere.visible=emergence>0&&t<.975;skyObjects.visible=emergence>0&&t<.975;habitat.visible=emergence>0;dust.visible=emergence>0;
    cloudBanks.forEach((bank,i)=>bank.position.x+=(i%2?1:-1)*Math.sin(time*.025+i)*.00012);
    life.position.set(3.4,Math.sin(time*.55)*.09,0);life.rotation.z=Math.sin(time*.32)*.045;scene.fog.density=.025+.25*smooth(.95,1,t);
    const cameraProgress=t<.12?.065*opening:THREE.MathUtils.lerp(.065,t,smooth(.12,.17,t));
    cameraCurve.getPoint(cameraProgress,camera.position);gazeCurve.getPoint(cameraProgress,gazePoint);camera.lookAt(gazePoint);camera.rotateZ(Math.sin(t*Math.PI*4)*.025);
    if(t<.12){if(wings.parent!==butterflyScene)butterflyScene.add(wings);wings.position.x=THREE.MathUtils.lerp(-6,3.4,flight);}
    else if(wings.parent!==life){life.add(wings);wings.position.x=0;}
    const fade=1-smooth(.95,.998,t);world.visible=fade>0;
    materials.forEach(mat=>{mat.opacity=mat.userData.baseOpacity*fade*emergence*(mat.userData.molecular?smooth(.34,.41,t):1)*(mat.userData.careerTimeline?1-smooth(.805,.82,t):1);});
    wingClock+=Math.min(.06,Math.max(0,time-wingTime))*THREE.MathUtils.lerp(13,1,flight)*(1-opening);wingTime=time;wings.scale.setScalar(1-smooth(.10,.24,t));wings.rotation.set(-.12,-.35, .12);wingPivots.forEach(pivot=>{const phase=wingClock-(pivot.userData.hind?.24:0);pivot.rotation.y=pivot.userData.side*(.24+Math.sin(phase)*.75*(1-opening));pivot.rotation.x=Math.sin(phase-.25)*.025*(1-opening);});wings.position.y=Math.sin(time*.9)*.09;
    dna.rotation.y=time*.055;molecule.rotation.y=Math.sin(time*.19)*.2;evidence.rotation.y=Math.sin(time*.14)*.12;
    evidenceTurn.z+=(evidencePointer.x*Math.PI*1.1-evidenceTurn.z)*.17;evidenceTurn.y+=(evidencePointer.y*.45-evidenceTurn.y)*.17;evidenceRotor.rotation.set(0,evidenceTurn.y,evidenceTurn.z+Math.sin(time*.18)*.06);bilayer.rotation.y=.12+Math.sin(time*.11)*.10;
    crisprStudy.children.forEach(model=>{model.rotation.y=-.4+Math.sin(time*.20)*.12;});structureStudies.children.forEach((model,i)=>{model.rotation.y=-.4+Math.sin(time*.25+i)*.12;model.visible=model.userData.pdb==='4C2U';});dust.position.y=Math.sin(time*.12)*.15;const paperSide=captions.find(c=>t>=c[0]&&t<c[1])?.[2];publications.position.x+=((paperSide==='right'?-3.2:2.7)-publications.position.x)*.05;publications.rotation.z=Math.sin(time*.13)*.04;
    rising.forEach(mote=>{mote.mesh.position.y=mote.base+((time*.11+mote.phase)%1)*1.3;});
    paperLeaves.forEach((leaf,i)=>{const a=i/6*Math.PI*2;leaf.position.z=THREE.MathUtils.lerp(.2*Math.cos(a),0,smooth(.90,.97,t));});
    const active=captions.findIndex(c=>t>=c[0]&&t<c[1]);
    if(active!==copyIndex){oldCopy=copyIndex;oldCopyStarted=time;copyIndex=active;copyStarted=time;}
    panels.forEach((panel,i)=>{
        let opacity=0,entry=0,exit=0;
        if(i===copyIndex){entry=smooth(0,.72,time-copyStarted);opacity=entry;}
        else if(i===oldCopy){entry=1;exit=smooth(0,.36,time-oldCopyStarted);opacity=1-exit;}
        panel.style.color=i>=8&&i<=15?'#f0dfba':i>=16?palette.ink:palette.white;panel.style.textShadow='none';panel.classList.toggle('journey-panel--light-ink',i<8);panel.style.opacity=String(Math.min(1,opacity*1.7)*smooth(.085,.12,t));panel.style.transform=`translateY(${-exit*32}px)`;panel.style.visibility=opacity>.001?'visible':'hidden';panel.inert=opacity<.5;
        panel.querySelectorAll('.journey-title-line > span').forEach((line,j)=>{const lift=clamp((entry-j*.12)/(1-j*.12),0,1);line.style.transform=`translateY(${(1-lift)*112}%)`;});
        const subtitle=panel.querySelector('p');subtitle.style.transform=`translateY(${(1-smooth(.25,1,entry))*24}px)`;subtitle.style.opacity=String(smooth(.25,1,entry)*(1-exit));
    });
    const dark=smooth(.74,.82,t);textInk.lerpColors(whiteInk,charcoalInk,dark);section.style.setProperty('--journey-ink','#'+textInk.getHexString());
    const darkNav=!skipped&&t<.85;if(root.classList.contains('journey-dark')!==darkNav)root.classList.toggle('journey-dark',darkNav);
    progressBar.style.transform=`scaleX(${t})`;progressNumber.textContent=t<.25?'01 / 04':t<.55?'02 / 04':t<.85?'03 / 04':'04 / 04';
    section.querySelector('.journey-progress').style.opacity=String(.65*(1-smooth(.96,1,t)));
    if(!skipped)intro.style.setProperty('opacity',String(smooth(.975,1,t)),'important');
    section.querySelector('.journey-scroll').style.opacity=String(1-smooth(.01,.06,t));
    host.dataset.progress=t.toFixed(3);host.dataset.background='#'+scene.background.getHexString();host.style.backgroundColor=host.dataset.background;host.dataset.camera='CatmullRomCurve3';
    if(butterflyRenderer){const canvas=butterflyRenderer.domElement;canvas.style.display=t<.12?'block':'none';canvas.style.filter=`blur(${68*(1-flight)}px)`;canvas.style.opacity=String(smooth(0,.008,t));if(t<.12){wings.traverse(part=>{if(part.material&&part.material.opacity!==undefined)part.material.opacity=(part.material.userData.baseOpacity??1)*fade;});butterflyCamera.copy(camera);wings.position.y+=life.position.y;butterflyScene.environment=scene.environment;butterflyScene.environmentIntensity=scene.environmentIntensity;butterflyScene.fog.color.set(palette.night);renderer.render(butterflyScene,butterflyCamera);butterflyRenderer.context.clearRect(0,0,canvas.width,canvas.height);butterflyRenderer.context.drawImage(renderer.domElement,0,0,canvas.width,canvas.height);wings.traverse(part=>{if(part.material&&part.material.opacity!==undefined)part.material.opacity=(part.material.userData.baseOpacity??1)*fade*emergence;});}}
    if(renderer)renderer.render(scene,camera);
    const openingText=document.getElementById('heroScreen');if(openingText&&root.classList.contains('intro-text-active')){openingText.style.opacity=String(1-opening);openingText.style.display=t<.12?'block':'none';}
    host.dataset.butterflyClarity=flight.toFixed(3);host.dataset.flapping=String(opening<1);host.dataset.introStage=t<.065?'butterfly-flight':t<.12?'orchids-opening':'journey';
}
function isVisible(){return !document.hidden&&(!skipped||publicationMode())&&!motion.matches&&!root.classList.contains('hero-locked');}
function tick(now){frame=0;if(!isVisible())return;if(now-previous<1000/30){frame=requestAnimationFrame(tick);return;}const dt=Math.min((now-previous)/1000||.016,.06);previous=now;elapsed+=dt;current+=(target-current)*(1-Math.exp(-dt*10));if(Math.abs(target-current)<.0001)current=target;if(publicationMode())paintGlass(elapsed);else paint(current,elapsed);if(publicationMode()||current<1||target<1||elapsed-oldCopyStarted<.8)frame=requestAnimationFrame(tick);}
function resume(){if(skipped){host.style.display=publicationMode()?'':'none';host.style.zIndex=publicationMode()?'0':'-1';}if(isVisible()&&!frame){previous=performance.now();frame=requestAnimationFrame(tick);}if(!isVisible()){cancelAnimationFrame(frame);frame=0;}}
function skip(){scrollTween?.kill();skipped=true;root.classList.add('journey-skipped');root.classList.remove('journey-dark');intro.style.setProperty('opacity','1','important');section.hidden=true;host.style.display='none';resume();}
function start(){flightStarted=-1;scrollTween?.kill();requestedBeat=0;leavingJourney=false;lastWheel=performance.now();wheelLock=lastWheel+1150;if(motion.matches){finishReduced();return;}skipped=false;section.hidden=false;host.style.zIndex='-1';host.style.background='';host.style.display='';root.classList.remove('journey-skipped');measure();window.scrollTo({top:sectionTop,behavior:'instant'});target=current=.065;requestedBeat=1;flightStarted=elapsed;wheelLock=performance.now()+4400;window.scrollTo({top:sectionTop+travel*.065,behavior:'instant'});copyIndex=-1;oldCopy=-1;focusStarted=elapsed;paint(.065,elapsed);resume();}
function finishReduced(){skipped=true;root.classList.add('journey-reduced','journey-skipped');intro.style.setProperty('opacity','1','important');section.hidden=true;host.style.display='';world.visible=false;scene.background.set(palette.wall);scene.fog.color.copy(scene.background);if(renderer)renderer.render(scene,camera);const hero=document.getElementById('heroScreen');if(hero){hero.hidden=true;hero.style.display='none';hero.dispatchEvent(new Event('hero:dismiss'));}root.classList.remove('hero-locked','journey-dark');resume();}
window.SiteJourney={start,skip};
new MutationObserver(resume).observe(document.getElementById('publications'),{attributes:true,attributeFilter:['class']});
// Treat the initial reveal as its own stop; forward/backward share identical anchors.
const beatStops=[0,.065,.12,...captions.slice(1).map(c=>(c[0]+c[1])*.5)];
function moveToBeat(beat){
 if(beat===0)flightStarted=-1;else if(beat===1){flightStarted=elapsed-(current>.065?3:0);wheelLock=performance.now()+3300;}
 requestedBeat=beat;scrollTween?.kill();scrollMotion.y=scrollY;
 const destination=sectionTop+travel*beatStops[beat];
 if(window.gsap)scrollTween=window.gsap.to(scrollMotion,{y:destination,duration:beat===1?3:beat===2?1.8:1.1,ease:'power2.inOut',overwrite:true,onUpdate:()=>window.scrollTo({top:scrollMotion.y,behavior:'instant'})});
 else window.scrollTo({top:destination,behavior:'smooth'});
}
function enterHome(){
 if(leavingJourney||skipped)return;leavingJourney=true;scrollTween?.kill();
 const finish=()=>{skip();if(window.switchPage)window.switchPage(0);requestAnimationFrame(()=>window.scrollTo({top:0,behavior:'instant'}));};
 if(window.gsap)window.gsap.to(copyLayer,{opacity:0,duration:.35,overwrite:true,onComplete:()=>{finish();window.gsap.set(copyLayer,{clearProps:'opacity'});}});else finish();
}
addEventListener('wheel',event=>{
 if(skipped||motion.matches||root.classList.contains('hero-locked')||event.ctrlKey||Math.abs(event.deltaX)>Math.abs(event.deltaY))return;
 const direction=Math.sign(event.deltaY);if(!direction)return;
 event.preventDefault();const at=performance.now(),quiet=at-lastWheel;lastWheel=at;
 if(leavingJourney||quiet<220||at<wheelLock)return;
 wheelLock=at+1300;
 if(requestedBeat===beatStops.length-1&&direction>0){enterHome();return;}
 const next=clamp(requestedBeat+direction,0,beatStops.length-1);if(next!==requestedBeat)moveToBeat(next);
},{passive:false});
addEventListener('keydown',event=>{
 if(skipped||motion.matches||root.classList.contains('hero-locked')||event.target.closest('a,button,input,textarea,select'))return;
 if(['Home','End'].includes(event.key)){event.preventDefault();if(!leavingJourney){wheelLock=performance.now()+1300;moveToBeat(event.key==='Home'?0:beatStops.length-1);}return;}
 const direction=['ArrowDown','PageDown',' '].includes(event.key)?1:['ArrowUp','PageUp'].includes(event.key)?-1:0;
 if(!direction)return;event.preventDefault();if(event.repeat||leavingJourney||performance.now()<wheelLock)return;
 wheelLock=performance.now()+1300;
 if(requestedBeat===beatStops.length-1&&direction>0)enterHome();else moveToBeat(clamp(requestedBeat+direction,0,beatStops.length-1));
});
addEventListener('scroll',()=>{updateTarget();if(!skipped&&target===1&&scrollY>sectionTop+travel+80){enterHome();}resume();},{passive:true});addEventListener('resize',()=>{measure();if(motion.matches)finishReduced();else if(!skipped)paint(current,elapsed);},{passive:true});
document.addEventListener('visibilitychange',resume);
new MutationObserver(()=>{localize();resume();}).observe(root,{attributes:true,attributeFilter:['class','lang']});
motion.addEventListener('change',()=>{if(motion.matches)finishReduced();else{root.classList.remove('journey-reduced');skip();}});
root.classList.add('journey-ready');
if(skipped)skip();measure();if(motion.matches)finishReduced();else{paint(0,0);resume();}
const previewScenes={orchids:0,sky:2,meadow:10,bilayer:8,signals:9,ncc:13,crispr:17,papers:23};
const previewScene=new URLSearchParams(location.search).get('scene');if(Object.hasOwn(previewScenes,previewScene)){const showScene=()=>{start();moveToBeat(previewScenes[previewScene]);};if(document.readyState==='complete')showScene();else addEventListener('load',showScene,{once:true});}
if(spineStudy){const showStudy=()=>{if(window.switchPage)window.switchPage(6);};if(document.readyState==='complete')showStudy();else addEventListener('load',showStudy,{once:true});}

}
