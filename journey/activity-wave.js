import * as THREE from 'three';

// The photographs move along one continuous wave; their surfaces bend with it.
export function initActivityWave() {
    const gallery = document.querySelector('#extracurricular .activities-gallery');
    const page = document.getElementById('extracurricular');
    if (!gallery) return;
    const images = [...gallery.querySelectorAll('.activity-image')];
    if (!images.length) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    let renderer;
    try { renderer = new THREE.WebGLRenderer({alpha:true, antialias:true, powerPreference:'low-power'}); }
    catch { return; }
    gallery.classList.add('activity-wave');
    const stage = document.createElement('div'); stage.className = 'activity-wave-stage';
    stage.setAttribute('role', 'group'); stage.setAttribute('aria-label', 'Academic activity photo carousel');
    const controls = document.createElement('div'); controls.className = 'activity-wave-controls';
    controls.innerHTML = '<button type="button" aria-label="Previous photograph">←</button><span aria-live="polite">1 / '+images.length+'</span><button type="button" aria-label="Next photograph">→</button>';
    const sources = document.createElement('div'); sources.className = 'activity-wave-sources';
    images.forEach(image=>sources.append(image)); gallery.append(stage,controls,sources);
    stage.append(renderer.domElement); renderer.domElement.tabIndex=0;
    renderer.domElement.setAttribute('aria-label','Drag to browse photographs. Arrow keys change photograph; Enter opens the original.');
    const scene = new THREE.Scene(); scene.fog = new THREE.Fog('#dedcec',9,20);
    const camera = new THREE.PerspectiveCamera(40,1,.1,40); camera.position.z=8.4;
    const raycaster=new THREE.Raycaster(), pointer=new THREE.Vector2(), cards=[];
    const period=images.length*4.4;
    let hoverSpeed=0,target=0, current=0, frame=0, previous=0, dragging=null, activeIndex=0;
    images.forEach((image,index)=>{
        const geometry=new THREE.PlaneGeometry(4.1,2.9,32,16);
        const material=new THREE.MeshBasicMaterial({color:'#ffffff',side:THREE.DoubleSide});
        material.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
          vec2 edge=abs(vMapUv-.5)-vec2(.475,.465);
          if(length(max(edge,0.))>.025)discard;`);};
        const mesh=new THREE.Mesh(geometry,material); mesh.userData.index=index; scene.add(mesh);
        const original=geometry.attributes.position.array.slice(); cards.push({mesh,original});
        function texture(){
            if(!image.naturalWidth)return;
            const c=document.createElement('canvas');c.width=1200;c.height=848;const ctx=c.getContext('2d');
            ctx.fillStyle='#e9e5ef';ctx.fillRect(0,0,c.width,c.height);
            // Contain the whole photograph instead of cutting out people at the edges.
            const scale=Math.min(1200/image.naturalWidth,774/image.naturalHeight),w=image.naturalWidth*scale,h=image.naturalHeight*scale;
            ctx.drawImage(image,(1200-w)/2,(774-h)/2,w,h);ctx.fillStyle='#423c52';ctx.font='24px Georgia';ctx.fillText('Academic activities',28,819);
            ctx.textAlign='right';ctx.fillText(String(index+1).padStart(2,'0'),1172,819);
            const map=new THREE.CanvasTexture(c);map.colorSpace=THREE.SRGBColorSpace;material.map=map;material.needsUpdate=true;schedule();
        }
        if(image.complete)texture();else image.addEventListener('load',texture,{once:true});image.loading='eager';
    });
    function size(){const w=stage.clientWidth,h=stage.clientHeight;renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.25));renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();schedule();}
    function render(now){
        frame=0;if(document.hidden||!page.classList.contains('active'))return;
        const dt=Math.min((now-previous)/1000||.016,.05);previous=now;
        if(!dragging&&!reduce.matches)target+=hoverSpeed*dt*5;
        current=reduce.matches?target:THREE.MathUtils.damp(current,target,7,dt);
        cards.forEach(({mesh,original},index)=>{
            const center=THREE.MathUtils.euclideanModulo(index*4.4-current+period/2,period)-period/2;
            mesh.position.x=center;mesh.visible=Math.abs(center)<13;
            const pos=mesh.geometry.attributes.position;
            for(let i=0;i<pos.count;i++){
                const x=original[i*3],y=original[i*3+1],worldX=center+x;
                pos.setXYZ(i,x,y+.17*Math.sin(worldX*.65),-.085*worldX*worldX+.25*Math.sin(worldX*.8));
            }
            pos.needsUpdate=true;mesh.geometry.computeVertexNormals();mesh.geometry.computeBoundingSphere();
        });
        activeIndex=THREE.MathUtils.euclideanModulo(Math.round(current/4.4),images.length);
        controls.querySelector('span').textContent=(activeIndex+1)+' / '+images.length;
        renderer.render(scene,camera);
        if(Math.abs(target-current)>.001||Math.abs(hoverSpeed)>.01)frame=requestAnimationFrame(render);
    }
    function schedule(){if(!frame){previous=performance.now();frame=requestAnimationFrame(render);}}
    function step(direction){target=(Math.round(target/4.4)+direction)*4.4;schedule();}
    controls.querySelectorAll('button').forEach((button,index)=>button.addEventListener('click',()=>step(index?1:-1)));
    stage.addEventListener('pointerdown',e=>{dragging={x:e.clientX,start:e.clientX,target};stage.setPointerCapture(e.pointerId);});
    stage.addEventListener('pointerleave',()=>{hoverSpeed=0;});
    stage.addEventListener('pointermove',e=>{const rect=stage.getBoundingClientRect(),x=(e.clientX-rect.left)/rect.width*2-1;hoverSpeed=Math.abs(x)<.12?0:x;if(!dragging){schedule();return;}target=dragging.target+(dragging.x-e.clientX)*.013;schedule();});
    stage.addEventListener('pointerup',e=>{
        if(!dragging)return;const moved=Math.abs(e.clientX-dragging.start);dragging=null;
        if(moved<6){const rect=stage.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(cards.map(c=>c.mesh))[0];if(hit)images[hit.object.userData.index].click();}
        else {target=Math.round(target/4.4)*4.4;schedule();}
    });
    stage.addEventListener('pointercancel',()=>{dragging=null;});
    stage.addEventListener('wheel',e=>{if(Math.abs(e.deltaX)>Math.abs(e.deltaY)||e.shiftKey){e.preventDefault();target+=(e.deltaX||e.deltaY)*.008;schedule();}},{passive:false});
    renderer.domElement.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();step(e.key==='ArrowRight'?1:-1);}else if(e.key==='Enter')images[activeIndex].click();});
    new ResizeObserver(size).observe(stage);
    new MutationObserver(schedule).observe(page,{attributes:true,attributeFilter:['class']});
    document.addEventListener('visibilitychange',schedule);reduce.addEventListener('change',schedule);size();
}
