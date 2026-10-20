import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function initCrystalPages(originalWings){
 const about=document.getElementById('about'),experience=document.getElementById('experience');if(!about||!experience)return;
 const root=document.documentElement,host=document.createElement('div');host.id='crystalPagesCanvas';host.hidden=true;document.body.prepend(host);
 let renderer;try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});}catch{return;}
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;host.append(renderer.domElement);
 const scene=new THREE.Scene();scene.background=new THREE.Color('#d6eef4');const camera=new THREE.PerspectiveCamera(40,1,.1,150);camera.position.set(0,0,13);
 const pmrem=new THREE.PMREMGenerator(renderer),studio=new RoomEnvironment();scene.environment=pmrem.fromScene(studio,.04).texture;scene.environmentIntensity=1.25;studio.dispose();pmrem.dispose();
 scene.add(new THREE.HemisphereLight('#ffffff','#b9dbe8',2));for(const [x,y,z,p] of [[-5,7,8,3],[6,2,5,2]]){const light=new THREE.DirectionalLight('#ffffff',p);light.position.set(x,y,z);scene.add(light);}
 const crystal=new THREE.MeshPhysicalMaterial({color:'#c3eaf6',roughness:.035,metalness:0,transmission:.97,thickness:1.2,ior:1.75,clearcoat:1,clearcoatRoughness:.025,iridescence:.13,iridescenceThicknessRange:[230,350],attenuationColor:new THREE.Color('#add9ed'),attenuationDistance:3,side:THREE.DoubleSide});
 const butterfly=originalWings.clone(true);butterfly.traverse(part=>{if(part.isMesh)part.material=crystal;else if(part.isLine)part.visible=false;});butterfly.position.set(0,0,0);butterfly.rotation.set(-.08,.22,.12);scene.add(butterfly);
 const branchTree=new THREE.Group();scene.add(branchTree);branchTree.visible=false;
 const section=experience.querySelector('section'),items=[...section.querySelectorAll('.content-item')].sort((a,b)=>{const key=el=>{const date=el.querySelector('.date-location')?.textContent.match(/(\d{2})\/(\d{4})/);return date?Number(date[2])*12+Number(date[1]):0;};return key(a)-key(b);}),texts=[];
 items.forEach(item=>{const role=item.querySelector('h3')?.textContent||'',date=item.querySelector('.date-location')?.textContent||'';const lines=[...item.querySelectorAll('li')];(lines.length?lines:[item.querySelector('p')]).filter(Boolean).forEach((line,i)=>texts.push({role,date,html:line.innerHTML,first:i===0}));});
 const copy=document.createElement('div');copy.className='experience-growth-labels';section.append(copy);const labels=[],branches=[];
 const count=texts.length,sides=Array.from({length:count},(_,i)=>i%4<2?(i%2?-1:1):(i%2?1:-1));let target=0,progress=0,locked=0,lastWheel=0,frame=0,previous=0;
 function tube(points,r){const curve=new THREE.CatmullRomCurve3(points),g=new THREE.TubeGeometry(curve,64,r,10,false),mesh=new THREE.Mesh(g,crystal);branchTree.add(mesh);return mesh;}
 const trunk=tube(Array.from({length:count+3},(_,i)=>new THREE.Vector3(Math.sin(i*.9)*.06,i*1.65-4,0)),.085);
 texts.forEach((text,i)=>{const side=sides[i],y=i*1.65-2.8,mesh=tube([new THREE.Vector3(0,y,0),new THREE.Vector3(side*.9,y+.22,.1),new THREE.Vector3(side*2.3,y+.65,.25),new THREE.Vector3(side*3.8,y+.77,0)],.045);branches.push(mesh);const label=document.createElement('article');label.className='experience-growth-copy';label.dataset.side=String(side);label.innerHTML=(text.first?'<h3>'+text.role+'</h3><div class="date-location">'+text.date+'</div>':'')+'<p>'+text.html+'</p>';copy.append(label);labels.push(label);});
 const blooms=new THREE.Group();branchTree.add(blooms);blooms.position.set(0,count*1.65-1.6,0);blooms.visible=false;
 const petalMaterial=new THREE.MeshPhysicalMaterial({color:'#bca9d4',roughness:.24,clearcoat:.58,clearcoatRoughness:.14,sheen:.8,side:THREE.DoubleSide});
 const petalGeometry=new THREE.SphereGeometry(1,8,5),falling=new THREE.InstancedMesh(petalGeometry,petalMaterial,180);blooms.add(falling);const dummy=new THREE.Object3D();
 new GLTFLoader().load('models/wisteria-tree.glb',gltf=>{gltf.scene.updateMatrixWorld(true);gltf.scene.traverse(part=>{if(!part.isMesh||!part.name.includes('Raceme'))return;const geometry=part.geometry.clone().applyMatrix4(part.matrixWorld);const bunches=new THREE.InstancedMesh(geometry,petalMaterial,75);for(let i=0;i<75;i++){dummy.position.set(Math.cos(i*2.39996)*(.4+Math.sqrt(i/75)*4),.7+Math.sin(i*2.1)*.5,Math.sin(i*2.39996)*1.1);dummy.rotation.set(0,i,Math.sin(i)*.1);dummy.scale.setScalar(.7+(i%5)*.08);dummy.updateMatrix();bunches.setMatrixAt(i,dummy.matrix);}blooms.add(bunches);});});
 function setStep(step){target=THREE.MathUtils.clamp(step,0,count+1);schedule();}
 experience.addEventListener('wheel',e=>{if(!experience.classList.contains('active')||!root.classList.contains('journey-skipped')||e.ctrlKey)return;e.preventDefault();const now=performance.now(),quiet=now-lastWheel;lastWheel=now;if(now<locked||quiet<180)return;locked=now+750;setStep(target+Math.sign(e.deltaY));},{passive:false});
 experience.addEventListener('keydown',e=>{if(['ArrowDown','PageDown','ArrowUp','PageUp'].includes(e.key)){e.preventDefault();setStep(target+(['ArrowDown','PageDown'].includes(e.key)?1:-1));}});experience.tabIndex=0;
 function state(){const visible=root.classList.contains('journey-skipped'),a=visible&&about.classList.contains('active'),e=visible&&experience.classList.contains('active');host.hidden=!(a||e);root.classList.toggle('experience-crystal',e);butterfly.visible=a;branchTree.visible=e;if(!host.hidden)schedule();}
 function size(){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();schedule();}
 function render(now){frame=0;if(host.hidden||document.hidden)return;const dt=Math.min((now-previous)/1000||.016,.05);previous=now;const time=now/1000;
 if(butterfly.visible){camera.position.set(0,0,13);camera.lookAt(0,0,0);butterfly.scale.setScalar(1.18+Math.sin(time*.8)*.012);butterfly.position.y=.15+Math.sin(time*.8)*.035;butterfly.rotation.y=.15+Math.sin(time*.4)*.045;}
 else{progress=THREE.MathUtils.damp(progress,target,5,dt);camera.position.set(0,Math.max(0,(progress-2.2)*1.65),13);camera.lookAt(0,camera.position.y,0);trunk.geometry.setDrawRange(0,Math.floor(trunk.geometry.index.count*Math.min(1,(progress+.8)/(count+1))));branches.forEach((mesh,i)=>mesh.geometry.setDrawRange(0,Math.floor(mesh.geometry.index.count*THREE.MathUtils.clamp(progress-i,0,1))));labels.forEach((label,i)=>{const entry=THREE.MathUtils.clamp(progress-i-.35,0,1),y=52-(progress-i-1)*17;label.style.top=y+'%';label.style.opacity=String(entry);label.style.visibility=entry>.01&&y>-25&&y<90?'visible':'hidden';});blooms.visible=progress>count-.2;const full=THREE.MathUtils.clamp(progress-count,0,1);blooms.scale.setScalar(.3+full*.7);for(let i=0;i<180;i++){const phase=(time*.20+i*.618)%1;dummy.position.set(Math.sin(i*12.3)*5+Math.sin(time*.5+i)*.25,.5-phase*9,Math.cos(i*8.3)*2);dummy.rotation.set(time*.7+i,i*1.7,time*.45);dummy.scale.set(.025,.055,.012);dummy.updateMatrix();falling.setMatrixAt(i,dummy.matrix);}falling.instanceMatrix.needsUpdate=true;}
 renderer.render(scene,camera);frame=requestAnimationFrame(render);
 }
 function schedule(){if(!frame){previous=performance.now();frame=requestAnimationFrame(render);}}
 new MutationObserver(state).observe(about,{attributes:true,attributeFilter:['class']});new MutationObserver(state).observe(experience,{attributes:true,attributeFilter:['class']});new MutationObserver(state).observe(root,{attributes:true,attributeFilter:['class']});addEventListener('resize',size);document.addEventListener('visibilitychange',schedule);size();state();
}
