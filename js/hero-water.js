/* Refract the original foot3 pixels along outward-travelling water waves. */
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
    var vertexSource = 'attribute vec2 aPosition; void main(){gl_Position=vec4(aPosition,0.0,1.0);}';
    var fragmentSource = [
        'precision highp float;',
        'uniform sampler2D uImage;',
        'uniform vec2 uSize;',
        'uniform vec4 uRect;',
        'uniform float uRatio;',
        'uniform float uTime;',
        'uniform vec4 uDrops[6];',
        'void main(){',
        '  vec2 p=vec2(gl_FragCoord.x/uRatio,uSize.y-gl_FragCoord.y/uRatio);',
        '  vec2 uv=(p-uRect.xy)/uRect.zw;',
        '  if(uv.x<0.0||uv.x>1.0||uv.y<0.0||uv.y>1.0) discard;',
        '  vec2 offset=vec2(0.0); float light=0.0;',
        '  for(int i=0;i<6;i++){',
        '    float age=uTime-uDrops[i].z;',
        '    if(uDrops[i].w>0.0 && age>=0.0 && age<2.8){',
        '      vec2 delta=p-uDrops[i].xy;',
        '      float radius=length(delta);',
        '      vec2 direction=delta/max(radius,0.001);',
        '      float behind=age*165.0-radius;',
        '      float envelope=smoothstep(-12.0,4.0,behind)*exp(-max(behind,0.0)*0.016);',
        '      float fade=smoothstep(0.0,0.10,age)*(1.0-smoothstep(0.35,2.8,age));',
        '      float phase=behind*0.21;',
        '      float slope=cos(phase)*envelope*fade;',
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
    ['uImage','uSize','uRect','uRatio','uTime','uDrops[0]'].forEach(function (key) {
        uniforms[key] = gl.getUniformLocation(program, key);
    });
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.uniform1i(uniforms.uImage, 0);
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
        }
        drops = []; clear();
    }
    function draw(now) {
        frame = 0;
        if (stopped || motion.matches || document.hidden) { drops = []; clear(); return; }
        var seconds = now / 1000;
        drops = drops.filter(function (d) { return seconds - d[2] < 2.8; });
        if (!drops.length) { clear(); return; }
        var values = new Float32Array(24);
        drops.forEach(function (d, i) { values.set(d, i*4); });
        gl.uniform4fv(uniforms['uDrops[0]'], values);
        gl.uniform1f(uniforms.uTime, seconds);
        canvas.style.visibility = 'visible';
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        frame = requestAnimationFrame(draw);
    }
    function onClick(e) {
        if (!ready || stopped || motion.matches || e.target.closest('a, button')) return;
        var bounds = hero.getBoundingClientRect();
        if (drops.length === 6) drops.shift();
        drops.push([e.clientX-bounds.left, e.clientY-bounds.top, performance.now()/1000, 1]);
        if (!frame) frame = requestAnimationFrame(draw);
    }
    function cancel() { cancelAnimationFrame(frame); frame = 0; drops = []; clear(); }
    function stop() {
        stopped = true; cancel();
        hero.removeEventListener('click', onClick);
        window.removeEventListener('resize', resize);
        document.removeEventListener('visibilitychange', cancel);
        motion.removeEventListener('change', cancel);
        hero.removeEventListener('hero:dismiss', stop);
    }
    image.onload = function () {
        if (stopped) return;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        // HTML images arrive top-first, matching the top-left UVs used above.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        ready = true; canvas.dataset.ready = 'true'; resize();
    };
    image.src = 'image/foot3.webp';
    hero.addEventListener('click', onClick);
    hero.addEventListener('hero:dismiss', stop);
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', cancel);
    motion.addEventListener('change', cancel);
    canvas.addEventListener('webglcontextlost', stop);
    resize();
})();
