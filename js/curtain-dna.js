(function () {
    var canvas = document.getElementById("curtain-dna");
    var curtain = document.getElementById("pageCurtain");
    if (!canvas || !curtain) return;

    var ctx = canvas.getContext("2d");
    var bases = ["A", "T", "C", "G"];
    var count = 36;
    var particles = [];
    var width = 0;
    var height = 0;
    var time = 0;
    var raf = 0;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    for (var i = 0; i < count; i++) {
        var letter = bases[i % 4];
        var pair = letter === "A" ? "T" : letter === "T" ? "A" : letter === "C" ? "G" : "C";
        particles.push({ i: i, offset: 0, char: letter });
        particles.push({ i: i, offset: Math.PI, char: pair });
    }

    function active() {
        return curtain.classList.contains("is-on");
    }

    function resize() {
        var rect = curtain.getBoundingClientRect();
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = Math.max(1, rect.width);
        height = Math.max(1, rect.height);
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function project(p, radius, cx, top, span, fov) {
        var yNorm = p.i / (count - 1);
        var angle = yNorm * Math.PI * 5.8 + time + p.offset;
        var x3d = Math.sin(angle) * radius;
        var z3d = Math.cos(angle) * radius;
        var scale = fov / (fov + z3d);
        // Front (toward viewer) is darker / stronger — matches Variant depth cue
        var depth = (radius - z3d) / (radius * 2);
        var shade = 0.18 + depth * 0.82;
        return {
            x: cx + x3d * scale,
            y: top + yNorm * span,
            size: (width < 768 ? 13 : 18) * scale,
            shade: shade,
            z: z3d,
            char: p.char,
            angle: angle
        };
    }

    function drawBackbone(side, radius, cx, top, span, fov) {
        var pts = [];
        var steps = count * 3;
        for (var s = 0; s <= steps; s++) {
            var yNorm = s / steps;
            var angle = yNorm * Math.PI * 5.8 + time + side;
            var x3d = Math.sin(angle) * radius;
            var z3d = Math.cos(angle) * radius;
            var scale = fov / (fov + z3d);
            var depth = (radius - z3d) / (radius * 2);
            pts.push({
                x: cx + x3d * scale,
                y: top + yNorm * span,
                shade: 0.12 + depth * 0.55,
                z: z3d
            });
        }
        for (var i = 1; i < pts.length; i++) {
            var a = pts[i - 1];
            var b = pts[i];
            var alpha = Math.min(a.shade, b.shade);
            ctx.strokeStyle = "rgba(35,20,12," + alpha.toFixed(3) + ")";
            ctx.lineWidth = 1.35 + Math.min(a.shade, b.shade) * 1.1;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
        }
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        var radius = Math.min(150, Math.max(64, width * 0.14));
        var cx = width * 0.5;
        var top = height * 0.08;
        var span = height * 0.84;
        var fov = 920;
        var rungs = [];

        drawBackbone(0, radius, cx, top, span, fov);
        drawBackbone(Math.PI, radius, cx, top, span, fov);

        for (var n = 0; n < particles.length; n += 2) {
            rungs.push([
                project(particles[n], radius, cx, top, span, fov),
                project(particles[n + 1], radius, cx, top, span, fov)
            ]);
        }

        rungs.forEach(function (rung) {
            var a = rung[0];
            var b = rung[1];
            var alpha = Math.min(a.shade, b.shade) * 0.42;
            ctx.strokeStyle = "rgba(35,20,12," + alpha.toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
        });

        var glyphs = [];
        rungs.forEach(function (rung) {
            glyphs.push(rung[0], rung[1]);
        });
        glyphs.sort(function (a, b) { return b.z - a.z; });
        glyphs.forEach(function (p) {
            // Deeper brown as the base rotates toward the camera
            var c = Math.round(35 + (1 - p.shade) * 70);
            var g = Math.round(20 + (1 - p.shade) * 55);
            var bl = Math.round(12 + (1 - p.shade) * 40);
            ctx.font = "600 " + p.size.toFixed(1) + "px Helvetica Neue, Helvetica, Arial, sans-serif";
            ctx.fillStyle = "rgba(" + c + "," + g + "," + bl + "," + p.shade.toFixed(3) + ")";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(p.char, p.x, p.y);
        });
    }

    function loop() {
        raf = 0;
        if (!active()) return;
        if (!reduce) time += 0.012;
        draw();
        if (!reduce) raf = requestAnimationFrame(loop);
        else draw();
    }

    function kick() {
        if (active()) {
            resize();
            if (!raf) loop();
        } else if (raf) {
            cancelAnimationFrame(raf);
            raf = 0;
            ctx.clearRect(0, 0, width, height);
        }
    }

    resize();
    if (window.ResizeObserver) new ResizeObserver(resize).observe(curtain);
    else window.addEventListener("resize", resize);

    new MutationObserver(kick).observe(curtain, { attributes: true, attributeFilter: ["class"] });
    kick();
})();
