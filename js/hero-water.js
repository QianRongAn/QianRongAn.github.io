/* Pointer-driven water refraction follows the traced butterfly silhouette. */
(function () {
    'use strict';
    var hero = document.getElementById('heroScreen');
    var canvas = document.getElementById('heroWater');
    if (!hero || !canvas) return;
    var gl = canvas.getContext('webgl', {alpha: true, antialias: false, depth: false, premultipliedAlpha: false});
    if (!gl) return; // The intact CSS background remains available without WebGL.
    var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var drops = [], frame = 0, ready = false, stopped = false;
    var width = 0, height = 0, ratio = 1;
    var image = new Image();
    var fieldImage = new Image(), outline = null, fieldReady = false;
    var imageRect = {x:0, y:0, scale:1};
    var lastMove = null, lastEmission = 0;
    var vertexSource = 'attribute vec2 aPosition; void main(){gl_Position=vec4(aPosition,0.0,1.0);}';
    var fragmentSource = [
        'precision highp float;',
        'uniform sampler2D uImage;',
        'uniform sampler2D uField;',
        'uniform vec2 uSize;',
        'uniform vec4 uRect;',
        'uniform float uRatio;',
        'uniform float uTime;',
        'uniform vec4 uDrops[6];',
        'uniform float uContours[6];',
        'void main(){',
        '  vec2 p=vec2(gl_FragCoord.x/uRatio,uSize.y-gl_FragCoord.y/uRatio);',
        '  vec2 uv=(p-uRect.xy)/uRect.zw;',
        '  if(uv.x<0.0||uv.x>1.0||uv.y<0.0||uv.y>1.0){',
        '    gl_FragColor=vec4(0.0);',
        '    return;',
        '  }',
        '  vec2 slopeField=vec2(0.0); float activity=0.0;',
        '  vec4 field=texture2D(uField,uv);',
        '  float signedDistance=((field.r*65280.0+field.g*255.0)/65535.0*1024.0-512.0)*uRect.z/1392.0;',
        '  float normalAngle=(field.b*2.0-1.0)*3.14159265;',
        '  vec2 contourNormal=vec2(cos(normalAngle),sin(normalAngle));',
        '  for(int i=0;i<6;i++){',
        '    float age=uTime-uDrops[i].z;',
        '    if(uDrops[i].w>0.0 && age>=0.0 && age<2.8){',
        '      vec2 delta=p-uDrops[i].xy;',
        '      float radius=length(delta);',
        '      vec2 direction=delta/max(radius,0.001);',
        '      float dropSdf=uContours[i];',
        '      float shaped=abs(signedDistance-dropSdf);',
        '      float nearShape=1.0-smoothstep(36.0,240.0,abs(dropSdf));',
        '      float bend=nearShape*smoothstep(0.10,1.05,age)*0.28;',
        '      radius=mix(radius,shaped,bend);',
        '      float side=signedDistance-dropSdf;',
        '      vec2 shapeDir=contourNormal*(side<0.0?-1.0:1.0);',
        '      direction=normalize(mix(direction,shapeDir,bend));',
        '      float behind=age*155.0-radius;',
        '      float envelope=smoothstep(-10.0,8.0,behind)*exp(-max(behind,0.0)/(34.0+age*12.0));',
        '      float spreading=inversesqrt(1.0+radius*0.018)*exp(-age*0.48);',
        '      float lifetime=uDrops[i].w<0.6?1.05:2.8;',
        '      float fade=smoothstep(0.0,0.10,age)*(1.0-smoothstep(0.20,lifetime,age));',
        '      float phase=behind*0.16;',
        '      float capillary=(age*204.0-radius)*0.29;',
        '      float slope=(cos(phase)+0.24*cos(capillary))*envelope*fade*spreading*uDrops[i].w;',
        '      slopeField+=direction*slope;',
        '      activity+=abs(slope);',
        '    }',
        '  }',
        '  vec3 normal=normalize(vec3(-slopeField*0.24,1.0));',
        '  vec2 refraction=normal.xy*25.0;',
        '  vec3 color=texture2D(uImage,clamp(uv+refraction/uRect.zw,vec2(0.001),vec2(0.999))).rgb;',
        '  vec3 key=normalize(vec3(-0.45,0.65,1.0));',
        '  float diffuse=(dot(normal,key)-key.z)*0.12;',
        '  vec3 reflected=reflect(vec3(0.0,0.0,-1.0),normal);',
        '  float specular=pow(max(dot(reflected,key),0.0),92.0)*0.23;',
        '  float fresnel=0.02+0.98*pow(1.0-normal.z,5.0);',
        '  float shimmer=(specular+fresnel*0.15)*min(activity,1.0);',
        '  gl_FragColor=vec4(clamp(color+vec3(diffuse)+vec3(0.86,0.90,1.0)*shimmer,0.0,1.0),1.0);',
        '}'
    ].join('\n');

    function shader(type, source) {
        var result = gl.createShader(type);
        gl.shaderSource(result, source); gl.compileShader(result);
        if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) {
            gl.deleteShader(result); return null;
        }
        return result;
    }
    var vertex = shader(gl.VERTEX_SHADER, vertexSource);
    var fragment = shader(gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertex || !fragment) return;
    var program = gl.createProgram();
    gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program);
    gl.deleteShader(vertex); gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);
    var buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    var position = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    var uniforms = {};
    ['uImage','uField','uSize','uRect','uRatio','uTime','uDrops[0]','uContours[0]'].forEach(function (key) {
        uniforms[key] = gl.getUniformLocation(program, key);
    });
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.uniform1i(uniforms.uImage, 0);
    var fieldTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, fieldTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.uniform1i(uniforms.uField, 1);
    gl.clearColor(0, 0, 0, 0);

    function clear() { gl.clear(gl.COLOR_BUFFER_BIT); canvas.style.visibility = 'hidden'; }
    function resize() {
        if (stopped) return;
        width = hero.clientWidth; height = hero.clientHeight;
        ratio = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(uniforms.uSize, width, height);
        gl.uniform1f(uniforms.uRatio, ratio);
        if (ready) {
            var scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
            var w = image.naturalWidth * scale, h = image.naturalHeight * scale;
            gl.uniform4f(uniforms.uRect, (width-w)/2, (height-h)/2, w, h);
            imageRect = {x:(width-w)/2, y:(height-h)/2, scale:scale};
        }
        drops = []; lastMove = null; clear();
    }
    function draw(now) {
        frame = 0;
        if (stopped || motion.matches || document.hidden) { drops = []; clear(); return; }
        var seconds = now / 1000;
        drops = drops.filter(function (d) { return seconds - d[2] < 2.8; });
        if (!drops.length) { clear(); return; }
        var values = new Float32Array(24), contours = new Float32Array(6);
        drops.forEach(function (d, i) { values.set(d.slice(0,4), i*4); contours[i] = d[4]; });
        gl.uniform4fv(uniforms['uDrops[0]'], values);
        gl.uniform1fv(uniforms['uContours[0]'], contours);
        gl.uniform1f(uniforms.uTime, seconds);
        canvas.style.visibility = 'visible';
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        frame = requestAnimationFrame(draw);
    }
    function contourSigned(x, y) {
        if (!outline || !imageRect.scale) return 400;
        x = (x-imageRect.x)/imageRect.scale; y = (y-imageRect.y)/imageRect.scale;
        var inside = false, nearest = Infinity, points = outline.points;
        for (var i=0; i<points.length; i++) {
            var a=points[i], b=points[(i+1)%points.length];
            var vx=b[0]-a[0], vy=b[1]-a[1];
            var len2=vx*vx+vy*vy;
            var t=len2>0?Math.max(0,Math.min(1,((x-a[0])*vx+(y-a[1])*vy)/len2)):0;
            nearest=Math.min(nearest,Math.hypot(x-a[0]-t*vx,y-a[1]-t*vy));
            if ((a[1]>y)!==(b[1]>y) && x<a[0]+(y-a[1])*vx/vy) inside=!inside;
        }
        var screen=nearest*imageRect.scale;
        return inside?-screen:screen;
    }
    function emit(e, strength) {
        if (!ready || !fieldReady || !outline || stopped || motion.matches || e.target.closest('a, button')) return;
        var bounds = hero.getBoundingClientRect();
        var x=e.clientX-bounds.left, y=e.clientY-bounds.top;
        if (drops.length === 6) drops.shift();
        var contour=contourSigned(x,y);
        drops.push([x,y,performance.now()/1000,strength,contour]);
        canvas.dataset.lastTrigger=e.type;
        canvas.dataset.contourInfluence=contour.toFixed(1);
        if (e.type==='pointermove') canvas.dataset.moveWaves=String(Number(canvas.dataset.moveWaves||0)+1);
        if (!frame) frame = requestAnimationFrame(draw);
    }
    function onClick(e) { emit(e, .85); }
    function onMove(e) {
        if (e.pointerType==='touch') return;
        var now=performance.now();
        if (!lastMove) { lastMove={x:e.clientX,y:e.clientY}; emit(e,.3); lastEmission=now; return; }
        var distance=Math.hypot(e.clientX-lastMove.x,e.clientY-lastMove.y);
        if (distance<8 || now-lastEmission<150) return;
        lastMove={x:e.clientX,y:e.clientY}; lastEmission=now;
        emit(e,Math.min(.55,.25+distance/250));
    }
    function onLeave() { lastMove=null; }
    function cancel() { cancelAnimationFrame(frame); frame = 0; drops = []; lastMove=null; clear(); }
    function stop() {
        stopped = true; cancel();
        hero.removeEventListener('click', onClick);
        hero.removeEventListener('pointermove', onMove);
        hero.removeEventListener('pointerleave', onLeave);
        window.removeEventListener('resize', resize);
        document.removeEventListener('visibilitychange', cancel);
        motion.removeEventListener('change', cancel);
        hero.removeEventListener('hero:dismiss', stop);
    }
    image.onload = function () {
        if (stopped) return;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        // HTML images arrive top-first, matching the top-left UVs used above.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        ready = true; canvas.dataset.ready = 'true'; resize();
    };
    image.src = 'image/hero-background.jpg';
    fieldImage.onload = function () {
        if (stopped) return;
        gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D,fieldTexture);
        gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL,gl.NONE);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,fieldImage);
        fieldReady=true; canvas.dataset.contourReady='true';
    };
    fieldImage.src='image/butterfly-field.png';
    fetch('image/butterfly-contour.json').then(function(r){return r.json();}).then(function(data){outline=data;}).catch(function(){canvas.dataset.contourReady='false';});
    hero.addEventListener('click', onClick);
    hero.addEventListener('pointermove', onMove, {passive:true});
    hero.addEventListener('pointerleave', onLeave);
    hero.addEventListener('hero:dismiss', stop);
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', cancel);
    motion.addEventListener('change', cancel);
    canvas.addEventListener('webglcontextlost', stop);
    resize();
})();
