import * as THREE from 'three';
import './style.css';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

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
    [.87,.89,'right','01 / IMMUNE RECOGNITION','A receptor.<br>A <em>recognition.</em>','SARS-CoV-2-specific T cells and their receptors · J Hematol Oncol, 2024','SARS-CoV-2 特异性 T 细胞及其受体 · J Hematol Oncol, 2024'],
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
    panels.forEach((panel, i) => { const p = panel.querySelector('p'); (p.querySelector('a') || p).textContent = captions[i][zh ? 6 : 5]; });
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
const silhouetteShape=new THREE.Shape();silhouetteShape.moveTo(-2,-2);silhouetteShape.bezierCurveTo(-.8,-1.8,-1.4,-.8,-.75,-.65);silhouetteShape.bezierCurveTo(-.2,-.1,-1.7,.8,-2,2);silhouetteShape.lineTo(-3,2);silhouetteShape.lineTo(-3,-2);
const silhouetteMat=new THREE.MeshBasicMaterial({color:'#03030a',side:THREE.DoubleSide,transparent:true,opacity:.94});
for(const side of [-1,1]){const veil=new THREE.Mesh(new THREE.ShapeGeometry(silhouetteShape,40),silhouetteMat);veil.position.set(side===1?-1.05:1.05,-.6,-2.8);veil.scale.set(side===1?.7:-.7,.85,1);foreground.add(veil);}
// A recognisable sprig: a continuous curved stem, petioles and rounded leaves.
const revealSprig=new THREE.Group();foreground.add(revealSprig);
const sprigStem=new THREE.CatmullRomCurve3([new THREE.Vector3(1.45,-1.7,-3),new THREE.Vector3(1.32,-1.25,-3),new THREE.Vector3(1.18,-.93,-3),new THREE.Vector3(1.07,-.57,-3)]);
revealSprig.add(new THREE.Mesh(new THREE.TubeGeometry(sprigStem,48,.014,7,false),silhouetteMat));
const sprigLeafShape=new THREE.Shape();sprigLeafShape.moveTo(0,0);
sprigLeafShape.bezierCurveTo(-.21,.10,-.26,.39,-.06,.61);
sprigLeafShape.bezierCurveTo(-.025,.65,.015,.65,.045,.61);
sprigLeafShape.bezierCurveTo(.24,.40,.19,.12,0,0);sprigLeafShape.closePath();
const sprigLeafGeometry=new THREE.ExtrudeGeometry(sprigLeafShape,{depth:.009,bevelEnabled:true,bevelThickness:.004,bevelSize:.004,bevelSegments:2,steps:1,curveSegments:24});
const veinMat=new THREE.MeshBasicMaterial({color:'#201d30',transparent:true,opacity:.65});
[[1.30,-1.18,.90,.78],[1.21,-.98,-.80,.76],[1.13,-.76,.65,.72]].forEach(([x,y,angle,scale])=>{
 const leaf=new THREE.Group();leaf.position.set(x,y,-2.99);leaf.rotation.z=angle;leaf.scale.setScalar(scale);
 leaf.add(new THREE.Mesh(sprigLeafGeometry,silhouetteMat));
 const vein=new THREE.CatmullRomCurve3([new THREE.Vector3(0,.035,.017),new THREE.Vector3(-.015,.30,.025),new THREE.Vector3(-.01,.57,.017)]);
 leaf.add(new THREE.Mesh(new THREE.TubeGeometry(vein,20,.003,5,false),veinMat));revealSprig.add(leaf);
});
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
 vec2 grid=uv*vec2(350.,180.);vec2 id=floor(grid),f=fract(grid)-.5;float star=step(.992,hash(id))*exp(-dot(f,f)*170.)*(.65+.35*sin(clock*.15+hash(id)*24.));
 color+=vec3(.55,.59,.72)*star*smoothstep(.46,.7,uv.y);
 gl_FragColor=vec4(color,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
const atmosphere=new THREE.Mesh(new THREE.SphereGeometry(145,48,32),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:skyUniforms,vertexShader:'varying vec3 direction;void main(){direction=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:skyFragment}));atmosphere.position.z=-50;scene.add(atmosphere);

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

// MedLit: matte document leaves flow through a structured evidence lattice.
const evidence = new THREE.Group(); evidence.position.set(3.6, .1, -35); world.add(evidence);
const pageGeometry = new THREE.BoxGeometry(1.45, 1.9, .07), ruleGeometry = new THREE.BoxGeometry(.82, .035, .025);
for (let i = 0; i < 9; i++) {
    const sheet = new THREE.Group(), a = i / 9 * Math.PI * 2;
    sheet.position.set(Math.cos(a) * 2, Math.sin(a) * 1.9, Math.sin(a * 2) * .8); sheet.rotation.set(.12, a * .3, Math.sin(a) * .2);
    sheet.add(new THREE.Mesh(pageGeometry, i % 3 === 0 ? rose : pearl));
    for (let j = 0; j < 5; j++) { const rule = new THREE.Mesh(ruleGeometry, blue); rule.position.set(-.08, .5 - j * .22, .06); if(j===4)rule.scale.x=.55;sheet.add(rule); }
    evidence.add(sheet);
    line(evidence, [sheet.position.clone(), new THREE.Vector3(0, 0, .4)], palette.gold, .32);
}
orb(evidence, 0, 0, .4, .48, gold);

// Two interleaved populations, plus spatial positions, stand for integrated omics.
const tissue = new THREE.Group(); tissue.position.set(-3.8, .4, -47); world.add(tissue);
function cellPosition(i, side) {
    const angle = random() * Math.PI * 2, h = random() * 2 - 1, r = Math.pow(random(), .45) * 2.2;
    return [Math.cos(angle) * r + side * .7, h * 1.8, Math.sin(angle) * r, .055 + random() * .13];
}
instanceSpheres(tissue, 230, blue, i => cellPosition(i, -1)); instanceSpheres(tissue, 230, rose, i => cellPosition(i, 1));
const spatial = new THREE.Group(); tissue.add(spatial); spatial.rotation.x = -.2;
for(let i=0;i<9;i++)line(spatial,[new THREE.Vector3(-3,-2+i*.5,-1.8),new THREE.Vector3(3,-2+i*.5,-1.8)],palette.blue,.15);

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

// Six paper-like leaves gradually resolve into a light, abstract constellation.
const publications = new THREE.Group(); publications.position.set(2.7, .7, -107); world.add(publications);
const paperLeaves = [];
for(let i=0;i<6;i++) {
    const a=i/6*Math.PI*2, mesh=new THREE.Mesh(new THREE.BoxGeometry(.9,1.3,.06),i===0?rose:pearl);
    mesh.position.set(Math.cos(a)*2.3,Math.sin(a)*2,.2*Math.cos(a)); mesh.rotation.set(-.15,a*.2,Math.sin(a)*.15);publications.add(mesh);paperLeaves.push(mesh);
    orb(publications,mesh.position.x,mesh.position.y,mesh.position.z,.085,gold);
}

// An inhabited, continuous biomorphic canyon: near surfaces occlude distant ones.
const habitat = new THREE.Group(); world.add(habitat);
const terrainMaterial=matte(palette.violet,.035), ridgeMaterial=matte(palette.blue,.025);
terrainMaterial.bumpMap=microTexture;terrainMaterial.bumpScale=.12;terrainMaterial.roughness=.85;ridgeMaterial.bumpMap=microTexture;ridgeMaterial.bumpScale=.08;ridgeMaterial.roughness=.78;
const groundClock={value:0};
terrainMaterial.onBeforeCompile=shader=>{
 shader.uniforms.groundClock=groundClock;
 shader.vertexShader='varying vec3 surveyPosition;\n'+shader.vertexShader;
 shader.vertexShader=shader.vertexShader.replace('#include <worldpos_vertex>','#include <worldpos_vertex>\nsurveyPosition=(modelMatrix*vec4(transformed,1.)).xyz;');
 shader.fragmentShader='varying vec3 surveyPosition;uniform float groundClock;\n'+shader.fragmentShader;
 shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
 vec2 q=surveyPosition.xz;
 float ridges=sin(q.x*.47+sin(q.y*.21)*1.8)+sin(q.y*.63-q.x*.15);
 float contour=1.-smoothstep(.035,.11,abs(sin((surveyPosition.y+ridges*.10)*9.)));
 float shimmer=pow(max(0.,sin(q.x*.8+groundClock*.07)*sin(q.y*.65-groundClock*.04)),12.);
 diffuseColor.rgb*=.83+.16*sin(q.x*.13+q.y*.09)+contour*.12;
 diffuseColor.rgb+=vec3(.16,.14,.12)*shimmer*.2;
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
// Ground flowers are solid curved petals, stems and leaves, batched as instances.
function meadowFloor(x,z){const localZ=-(z+48);return -4+Math.pow(Math.min(Math.abs(x)/12,2),1.7)*3.2+Math.sin(x*.62+localZ*.14)*.4+Math.sin(x*1.4-localZ*.23)*.15+Math.sin(localZ*.38)*.22-8/(1+Math.exp((localZ-10)*.18));}
function petalGeometry(){
 const positions=[],indices=[],nx=6,ny=14,stride=nx+1,count=stride*(ny+1);
 for(let back=0;back<2;back++)for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++){
  const u=j/ny,v=i/nx*2-1,w=.28*Math.pow(Math.sin(Math.PI*u),.65)+.018;
  positions.push(v*w,.14*Math.sin(u*Math.PI)+.28*u*u+.075*v*v*Math.sin(Math.PI*u)+(back?-.009:.009),.07+u*.75);
 }
 for(let back=0;back<2;back++)for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const a=back*count+j*stride+i,b=a+1,c=a+stride,d=c+1;if(back)indices.push(a,b,c,b,d,c);else indices.push(a,c,b,b,c,d);}
 const boundary=[];for(let i=0;i<=nx;i++)boundary.push(i);for(let j=1;j<=ny;j++)boundary.push(j*stride+nx);for(let i=nx-1;i>=0;i--)boundary.push(ny*stride+i);for(let j=ny-1;j>0;j--)boundary.push(j*stride);
 boundary.forEach((a,i)=>{const b=boundary[(i+1)%boundary.length];indices.push(a,b,a+count,b,b+count,a+count);});
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();return g;
}
const meadow=new THREE.Group();habitat.add(meadow);
const flowerCount=192,petalsPerFlower=7,flowerPetalGeometry=petalGeometry();
const petalMaterial=new THREE.MeshPhysicalMaterial({color:'#ffffff',roughness:.33,metalness:0,transmission:.16,thickness:.035,ior:1.36,clearcoat:.28,sheen:.7,sheenColor:palette.mist,iridescence:.18,iridescenceThicknessRange:[180,300],bumpMap:microTexture,bumpScale:.012,side:THREE.DoubleSide});materials.push(petalMaterial);
const foliageMaterial=matte(palette.blue,.015);foliageMaterial.roughness=.6;
const petals=new THREE.InstancedMesh(flowerPetalGeometry,petalMaterial,flowerCount*petalsPerFlower);
const leaves=new THREE.InstancedMesh(flowerPetalGeometry,foliageMaterial,flowerCount*3);
const stems=new THREE.InstancedMesh(new THREE.CylinderGeometry(.023,.036,1,6,1),foliageMaterial,flowerCount);
const flowerCenters=new THREE.InstancedMesh(new THREE.SphereGeometry(1,10,7),gold,flowerCount);
const stamens=new THREE.InstancedMesh(new THREE.SphereGeometry(1,6,4),pearl,flowerCount*9);
const flowerDummy=new THREE.Object3D(),flowerRoot=new THREE.Object3D(),flowerPositions=[];
const blossomColors=[palette.dusk,palette.mist,palette.blue];
for(let i=0;i<flowerCount;i++){
 const side=i%2?1:-1,patch=Math.floor(i/24),z=12-patch*14-random()*12,x=side*(3.4+random()*7.5),floor=meadowFloor(x,z),height=.55+random()*1.15,scale=.45+random()*.60;
 flowerPositions.push({x,y:floor,z,height});
 flowerDummy.position.set(x+.10,floor+height*.5,z);flowerDummy.rotation.set(0,0,-.11);flowerDummy.scale.set(1,height,1);flowerDummy.updateMatrix();stems.setMatrixAt(i,flowerDummy.matrix);
 flowerRoot.position.set(x+.18,floor+height,z);flowerRoot.rotation.set((random()-.5)*.36,random()*Math.PI,(random()-.5)*.3);flowerRoot.scale.setScalar(scale);flowerRoot.updateMatrix();
 for(let j=0;j<petalsPerFlower;j++){flowerDummy.position.set(0,0,0);flowerDummy.rotation.set(.05*Math.sin(j*2),j/petalsPerFlower*Math.PI*2,0);flowerDummy.scale.set(1,1,1);flowerDummy.updateMatrix();petals.setMatrixAt(i*petalsPerFlower+j,new THREE.Matrix4().multiplyMatrices(flowerRoot.matrix,flowerDummy.matrix));petals.setColorAt(i*petalsPerFlower+j,new THREE.Color(blossomColors[i%3]).lerp(new THREE.Color(palette.mist),random()*.3));}
 flowerDummy.position.set(x+.18,floor+height+.10*scale,z);flowerDummy.rotation.set(0,0,0);flowerDummy.scale.set(.17*scale,.09*scale,.17*scale);flowerDummy.updateMatrix();flowerCenters.setMatrixAt(i,flowerDummy.matrix);
 for(let j=0;j<9;j++){const angle=j/9*Math.PI*2;flowerDummy.position.set(x+.18+Math.cos(angle)*.12*scale,floor+height+.15*scale,z+Math.sin(angle)*.12*scale);flowerDummy.scale.setScalar(.025*scale);flowerDummy.updateMatrix();stamens.setMatrixAt(i*9+j,flowerDummy.matrix);}
 for(let j=0;j<3;j++){flowerDummy.position.set(x+j*.05,floor+height*(.25+j*.17),z);flowerDummy.rotation.set(.48,j*2.4+i*.2,0);flowerDummy.scale.set(.43,.50,.60);flowerDummy.updateMatrix();leaves.setMatrixAt(i*3+j,flowerDummy.matrix);}
}
meadow.add(stems,leaves,petals,flowerCenters,stamens);
const boulderGeometry=new THREE.SphereGeometry(1,48,36);
const bp=boulderGeometry.attributes.position;
for(let i=0;i<bp.count;i++){const x=bp.getX(i),y=bp.getY(i),z=bp.getZ(i);const r=1+.065*Math.sin(y*19+x*9)+.045*Math.cos(z*23-y*7);bp.setXYZ(i,x*r,y*r,z*r);}boulderGeometry.computeVertexNormals();
const rocks=new THREE.InstancedMesh(boulderGeometry,ridgeMaterial,110),rockDummy=new THREE.Object3D();
for(let i=0;i<110;i++){
    const side=i%2?1:-1,z=16-Math.floor(i/2)*2.2;
    rockDummy.position.set(side*(11+random()*8),-2+random()*2,z);
    rockDummy.scale.set(1.8+random()*3.3,2.7+random()*5,1.8+random()*2.7);rockDummy.rotation.set(random(),random()*3,side*-.35);rockDummy.updateMatrix();rocks.setMatrixAt(i,rockDummy.matrix);
}habitat.add(rocks);
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
const membraneMaterial=new THREE.MeshPhysicalMaterial({color:palette.mist,roughness:.19,metalness:.05,transmission:.4,thickness:.16,ior:1.34,transparent:true,opacity:.45,side:THREE.DoubleSide});materials.push(membraneMaterial);const membrane=new THREE.Mesh(membraneGeometry,membraneMaterial);membrane.position.set(0,.2,-42);habitat.add(membrane);
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
paperLeaves.forEach(leaf=>{for(let j=0;j<5;j++){const rule=new THREE.Mesh(new THREE.BoxGeometry(j===4?.37:.59,.018,.008),blue);rule.position.set(-.04,.35-j*.15,.037);leaf.add(rule);}});
const nucleusMaterial=new THREE.MeshPhysicalMaterial({color:palette.mist,roughness:.28,transmission:.3,thickness:.09,ior:1.36,clearcoat:.35,transparent:true});materials.push(nucleusMaterial);
for(let i=0;i<24;i++){const a=i*2.4,r=1.1+random(),x=Math.cos(a)*r,y=(random()-.5)*2.5,z=Math.sin(a)*r;orb(tissue,x,y,z,.17,nucleusMaterial);orb(tissue,x+.025,y-.02,z+.02,.065,i%2?rose:blue);}

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
 const canvas=document.createElement('canvas');canvas.width=1600;canvas.height=1120;const c=canvas.getContext('2d');
 await document.fonts.ready;
 const images=await Promise.all([...card.querySelectorAll('.pub-image')].map(el=>new Promise(resolve=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>resolve(null);img.src=el.src;})));
 c.fillStyle='#514a67';c.font='22px Arial';c.fillText('SCIENTIFIC CONTRIBUTIONS / 0'+card.dataset.pubId,70,72);
 const fit=(img,x,y,w,h)=>{if(!img)return;let r=Math.min(w/img.width,h/img.height);c.drawImage(img,x+(w-img.width*r)/2,y+(h-img.height*r)/2,img.width*r,img.height*r);};
 fit(images[0],65,145,430,620);fit(images[1],65,800,205,200);fit(images[2],290,800,205,200);
 c.fillStyle='#302d44';c.font='52px Recoleta, Georgia';let y=wrapText(c,card.querySelector('.pub-title').textContent.trim(),550,210,970,66);
 c.font='33px Arial';c.fillStyle='#4b465e';y=wrapText(c,card.querySelector('.pub-authors').textContent.trim(),550,y+35,955,48);
 c.font='italic 32px Georgia';c.fillStyle='#624f72';y=wrapText(c,card.querySelector('.pub-journal').textContent.trim(),550,y+30,950,47);
 c.font='bold 30px Georgia';c.fillStyle='#353047';c.fillText((card.querySelector('.pub-impact')?.textContent||'').trim(),550,Math.min(1045,y+32));
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=renderer?.capabilities.getMaxAnisotropy()||1;return texture;
}
function initGlassCards(){
 if(glassCards.length)return;
 const cards=[...document.querySelectorAll('#publications .publication-card')];if(cards.length!==6)return;
 cards.forEach((card,i)=>{const group=new THREE.Group();glassScene.add(group);const mat=new THREE.MeshPhysicalMaterial({color:new THREE.Color(['#e8e5ee','#e1e6ef','#eee5ec'][i%3]),roughness:.10,metalness:0,transparent:true,opacity:.55,depthWrite:false,transmission:.97,thickness:.065,ior:1.36,clearcoat:.10,clearcoatRoughness:.16,iridescence:.12,iridescenceThicknessRange:[180,320],envMapIntensity:.14,side:THREE.FrontSide});
 const sheet=new THREE.Mesh(sheetGeometry(7.1,4.97,.075),mat);group.add(sheet);
 // A second thin inset edge catches the light at grazing angles.
 const rim=new THREE.LineSegments(new THREE.EdgesGeometry(sheet.geometry,27),new THREE.LineBasicMaterial({color:'#f7eefb',transparent:true,opacity:.35}));group.add(rim);
 const ink=new THREE.Mesh(sheetGeometry(6.96,4.87,0,true),new THREE.MeshBasicMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,alphaTest:.01,toneMapped:false}));ink.position.z=.075;group.add(ink);printedPaper(card).then(texture=>{ink.material.map=texture;ink.material.needsUpdate=true;});glassCards.push(group);});
 root.classList.add('publication-webgl');
}
let paperPhase=0,paperSelection=-1;const paperMotion={phase:0};let paperTween;
function moveGlassCards(){initGlassCards();const selected=window.PublicationStage?.index||0;if(selected!==paperSelection){paperSelection=selected;let diff=selected-paperMotion.phase;while(diff>3)diff-=6;while(diff< -3)diff+=6;paperTween?.kill();if(window.gsap&&!motion.matches)paperTween=window.gsap.to(paperMotion,{phase:paperMotion.phase+diff,duration:1.15,ease:'power2.inOut',overwrite:true});else paperMotion.phase+=diff;}paperPhase=paperMotion.phase;
 glassCards.forEach((group,i)=>{let d=i-paperPhase;while(d>3)d-=6;while(d< -3)d+=6;let a=d*.95;const distance=Math.abs(d);group.position.set(1.8+Math.sin(a)*6.1,-d*6.6,3.2-distance*4.8);group.rotation.set(.025*Math.sin(a),a*.72-.08,.018*Math.sin(a));});
}

function publicationMode(){return skipped&&!!document.querySelector('#publications.active');}
function paintGlass(time){moveGlassCards();host.style.display='';host.style.zIndex='0';host.style.background='#979eb7';host.style.setProperty('--scene-focus','0px');host.style.setProperty('--scene-light','1');host.dataset.mode='publication-glass';skeleton.rotation.y=THREE.MathUtils.lerp(skeleton.rotation.y,.85+(window.PublicationStage?.index||0)*.85,.12)+.0008;skeleton.rotation.z=Math.sin(time*.12)*.10;skeleton.position.y=Math.sin(time*.3)*.12;skeleton.scale.setScalar(1.4);splinters.rotation.y=time*.045;if(spineStudy){backdrop.visible=false;glassCards.forEach(card=>card.visible=false);skeleton.position.x=0;skeleton.scale.setScalar(1.05);skeleton.rotation.z=.035;skeleton.rotation.y=studyRotation.y;glassScene.background.set('#12101f');host.style.background='#12101f';}if(studyControls)studyControls.update();if(renderer)renderer.render(glassScene,glassCamera);}
if(renderer){renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;host.appendChild(renderer.domElement);}
let composer,bokeh;
if(renderer){composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));bokeh=new BokehPass(scene,camera,{focus:15,aperture:.00012,maxblur:.009});composer.addPass(bokeh);composer.addPass(new OutputPass());}
const gazePoint=new THREE.Vector3();
const clamp=THREE.MathUtils.clamp;
const whiteInk=new THREE.Color(palette.white),charcoalInk=new THREE.Color(palette.ink),textInk=new THREE.Color();
function smooth(a,b,x){const u=clamp((x-a)/(b-a),0,1);return u*u*(3-2*u);}
let frame=0,previous=0,current=0,target=0,elapsed=0,skipped=new URLSearchParams(location.search).get('enter')==='about';
let sectionTop=0,travel=1,focusStarted=0,copyIndex=-1,copyStarted=0,oldCopy=-1,oldCopyStarted=0,lastWheel=0,wheelLock=0,requestedBeat=0,leavingJourney=false;let scrollTween;const scrollMotion={y:0};
function measure(){
    sectionTop=section.getBoundingClientRect().top+scrollY;travel=Math.max(1,section.offsetHeight-innerHeight);
    const mobile=false;
    [[life,3.4,.15,.68],[molecule,-3.8,-.1,.62],[evidence,3.6,.1,.68],[tissue,-3.8,-.2,.7],[publications,2.7,.3,.7]].forEach(([group,x,mx,scale])=>{group.position.x=mobile?mx:x;group.scale.setScalar(mobile?scale:1);});career.scale.x=mobile?.3:1;
    if(renderer){glassCamera.aspect=innerWidth/innerHeight;glassCamera.updateProjectionMatrix();camera.aspect=innerWidth/innerHeight;camera.fov=mobile?58:47;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.setSize(innerWidth,innerHeight);if(composer)composer.setSize(innerWidth,innerHeight);host.dataset.dpr=String(renderer.getPixelRatio());}updateTarget();
}
function updateTarget(){target=clamp((scrollY-sectionTop)/travel,0,1);}
function backgroundAt(t){let i=0;while(i<stops.length-2&&t>stops[i+1].t)i++;scene.background.lerpColors(stops[i].color,stops[i+1].color,clamp((t-stops[i].t)/(stops[i+1].t-stops[i].t),0,1));scene.fog.color.copy(scene.background);skyUniforms.zenith.value.copy(scene.background).multiplyScalar(.4);skyUniforms.horizon.value.copy(scene.background).lerp(new THREE.Color(palette.dusk),.14);}
function paint(t,time){
    skyUniforms.clock.value=time;groundClock.value=time;
    molecule.visible=t>.17&&t<.44;evidence.visible=t>.29&&t<.52;tissue.visible=t>.4&&t<.64;career.visible=t>.48;publications.visible=t>.79;dna.visible=t>.055;membrane.visible=t>.38&&t<.76;
    const focus=Math.max(smooth(.002,.055,t),smooth(.6,4.2,time-focusStarted));
    host.style.setProperty('--scene-focus','0px');if(bokeh){bokeh.uniforms.aperture.value=THREE.MathUtils.lerp(.0011,.000035,focus);bokeh.uniforms.focus.value=THREE.MathUtils.lerp(6,15,focus);}
    host.style.setProperty('--scene-light',String(.05+focus*.95));
    foreground.visible=t<.2;silhouetteMat.opacity=.94*(1-smooth(.06,.19,t));veinMat.opacity=.65*(1-smooth(.06,.19,t));
    backgroundAt(t);const emergence=smooth(.045,.11,t);scene.background.multiplyScalar(emergence);scene.fog.color.copy(scene.background);atmosphere.visible=emergence>.02&&t<.975;habitat.visible=t>.065;dust.visible=t>.065;life.position.x=-5.8+9.2*smooth(0,4.6,time-focusStarted);life.position.y=(1-focus)*-.6+Math.sin(time*.55)*.09;life.rotation.z=Math.sin(time*.32)*.045;scene.fog.density=.025+.25*smooth(.95,1,t);
    cameraCurve.getPoint(t,camera.position);gazeCurve.getPoint(t,gazePoint);camera.lookAt(gazePoint);camera.rotateZ(Math.sin(t*Math.PI*4)*.025);
    const fade=1-smooth(.95,.998,t);world.visible=fade>0;
    materials.forEach(mat=>{mat.opacity=mat.userData.baseOpacity*fade;});
    wings.scale.setScalar(1-smooth(.10,.24,t));wings.rotation.set(-.12,-.35, .12);wingPivots.forEach(pivot=>{const phase=time*2.5-(pivot.userData.hind?.24:0);pivot.rotation.y=pivot.userData.side*(.24+Math.sin(phase)*.22);pivot.rotation.x=Math.sin(phase-.25)*.025;});wings.position.y=Math.sin(time*.9)*.09;
    dna.rotation.y=time*.055;molecule.rotation.y=Math.sin(time*.19)*.2;evidence.rotation.y=Math.sin(time*.14)*.12;tissue.rotation.y=time*.025;
    dust.position.y=Math.sin(time*.12)*.15;publications.rotation.z=Math.sin(time*.13)*.04;
    rising.forEach(mote=>{mote.mesh.position.y=mote.base+((time*.11+mote.phase)%1)*1.3;});
    paperLeaves.forEach((leaf,i)=>{const a=i/6*Math.PI*2;leaf.position.z=THREE.MathUtils.lerp(.2*Math.cos(a),0,smooth(.90,.97,t));});
    const active=captions.findIndex(c=>t>=c[0]&&t<c[1]);
    if(active!==copyIndex){oldCopy=copyIndex;oldCopyStarted=time;copyIndex=active;copyStarted=time;}
    panels.forEach((panel,i)=>{
        let opacity=0,entry=0,exit=0;
        if(i===copyIndex){entry=smooth(0,.72,time-copyStarted);opacity=entry;}
        else if(i===oldCopy){entry=1;exit=smooth(0,.36,time-oldCopyStarted);opacity=1-exit;}
        panel.style.color=i>=8?palette.ink:palette.white;panel.classList.toggle('journey-panel--light-ink',i<8);panel.style.opacity=String(Math.min(1,opacity*1.7));panel.style.transform=`translateY(${-exit*32}px)`;panel.style.visibility=opacity>.001?'visible':'hidden';panel.inert=opacity<.5;
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
    if(composer)composer.render();else if(renderer)renderer.render(scene,camera);
}
function isVisible(){return !document.hidden&&(!skipped||publicationMode())&&!motion.matches&&!root.classList.contains('hero-locked');}
function tick(now){frame=0;if(!isVisible())return;if(now-previous<1000/30){frame=requestAnimationFrame(tick);return;}const dt=Math.min((now-previous)/1000||.016,.06);previous=now;elapsed+=dt;current+=(target-current)*(1-Math.exp(-dt*10));if(Math.abs(target-current)<.0001)current=target;if(publicationMode())paintGlass(elapsed);else paint(current,elapsed);if(publicationMode()||current<1||target<1||elapsed-oldCopyStarted<.8)frame=requestAnimationFrame(tick);}
function resume(){if(skipped){host.style.display=publicationMode()?'':'none';host.style.zIndex=publicationMode()?'0':'-1';}if(isVisible()&&!frame){previous=performance.now();frame=requestAnimationFrame(tick);}if(!isVisible()){cancelAnimationFrame(frame);frame=0;}}
function skip(){scrollTween?.kill();skipped=true;root.classList.add('journey-skipped');root.classList.remove('journey-dark');intro.style.setProperty('opacity','1','important');section.hidden=true;host.style.display='none';resume();}
function start(){scrollTween?.kill();requestedBeat=0;leavingJourney=false;lastWheel=performance.now();wheelLock=lastWheel+1150;if(motion.matches){finishReduced();return;}skipped=false;section.hidden=false;host.style.zIndex='-1';host.style.background='';host.style.display='';root.classList.remove('journey-skipped');measure();window.scrollTo({top:sectionTop,behavior:'instant'});target=current=0;copyIndex=-1;oldCopy=-1;focusStarted=elapsed;paint(0,elapsed);resume();}
function finishReduced(){skipped=true;root.classList.add('journey-reduced','journey-skipped');intro.style.setProperty('opacity','1','important');section.hidden=true;host.style.display='';world.visible=false;scene.background.set(palette.wall);scene.fog.color.copy(scene.background);if(renderer)renderer.render(scene,camera);const hero=document.getElementById('heroScreen');if(hero){hero.hidden=true;hero.style.display='none';hero.dispatchEvent(new Event('hero:dismiss'));}root.classList.remove('hero-locked','journey-dark');resume();}
window.SiteJourney={start,skip};
new MutationObserver(resume).observe(document.getElementById('publications'),{attributes:true,attributeFilter:['class']});
// Treat the initial reveal as its own stop; forward/backward share identical anchors.
const beatStops=[0,...captions.map(c=>(c[0]+c[1])*.5)];
function moveToBeat(beat){
 requestedBeat=beat;scrollTween?.kill();scrollMotion.y=scrollY;
 const destination=sectionTop+travel*beatStops[beat];
 if(window.gsap)scrollTween=window.gsap.to(scrollMotion,{y:destination,duration:1.1,ease:'power2.inOut',overwrite:true,onUpdate:()=>window.scrollTo({top:scrollMotion.y,behavior:'instant'})});
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
if(spineStudy){const showStudy=()=>{if(window.switchPage)window.switchPage(6);};if(document.readyState==='complete')showStudy();else addEventListener('load',showStudy,{once:true});}

}
