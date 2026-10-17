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
        '  if(uv.x<0.0||uv.x>1.0||uv.y<0.0||uv.y>1.0) discard;',
        '  vec2 offset=vec2(0.0); float light=0.0;',
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
        '      float contourWeight=uContours[i];',
        '      radius=mix(radius,abs(signedDistance),contourWeight);',
        '      vec2 inwardNormal=contourNormal*(signedDistance<0.0?-1.0:1.0);',
        '      direction=mix(direction,inwardNormal,contourWeight);',
        '      float behind=age*165.0-radius;',
        '      float envelope=smoothstep(-12.0,4.0,behind)*exp(-max(behind,0.0)*0.016);',
        '      float lifetime=uDrops[i].w<0.6?1.05:2.8;',
        '      float fade=smoothstep(0.0,0.10,age)*(1.0-smoothstep(0.20,lifetime,age));',
        '      float phase=behind*0.21;',
        '      float slope=cos(phase)*envelope*fade*uDrops[i].w;',
        '      offset+=direction*slope*9.0;',
        '      light+=slope*dot(direction,normalize(vec2(-0.6,-0.8)))*0.13;',
        '    }',
        '  }',
        '  vec3 color=texture2D(uImage,clamp(uv+offset/uRect.zw,vec2(0.001),vec2(0.999))).rgb;',
        '  gl_FragColor=vec4(clamp(color+vec3(light*0.90,light*0.94,light),0.0,1.0),1.0);',
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
        ratio = Math.min(window.devicePixelRatio || 1, 2);
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
    function contourAmount(x, y) {
        if (!outline) return 0;
        x = (x-imageRect.x)/imageRect.scale; y = (y-imageRect.y)/imageRect.scale;
        var inside = false, nearest = Infinity, points = outline.points;
        for (var i=0; i<points.length; i++) {
            var a=points[i], b=points[(i+1)%points.length];
            var vx=b[0]-a[0], vy=b[1]-a[1];
            var t=Math.max(0,Math.min(1,((x-a[0])*vx+(y-a[1])*vy)/(vx*vx+vy*vy)));
            nearest=Math.min(nearest,Math.hypot(x-a[0]-t*vx,y-a[1]-t*vy));
            if ((a[1]>y)!==(b[1]>y) && x<a[0]+(y-a[1])*vx/vy) inside=!inside;
        }
        if (inside) return 1;
        return Math.max(0,1-nearest/160);
    }
    function emit(e, strength) {
        if (!ready || !fieldReady || !outline || stopped || motion.matches || e.target.closest('a, button')) return;
        var bounds = hero.getBoundingClientRect();
        var x=e.clientX-bounds.left, y=e.clientY-bounds.top;
        if (drops.length === 6) drops.shift();
        var contour=contourAmount(x,y);
        drops.push([x,y,performance.now()/1000,strength,contour]);
        canvas.dataset.lastTrigger=e.type;
        canvas.dataset.contourInfluence=contour.toFixed(2);
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
    image.src = 'image/foot3.webp';
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
