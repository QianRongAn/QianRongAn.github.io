(function () {
    var canvas = document.getElementById("curtain-dna");
    var curtain = document.getElementById("pageCurtain");
    if (!canvas || !curtain) return;

    var ctx = canvas.getContext("2d");
    var bases = ["A", "T", "C", "G"];
    var particles = [];
    var width = 0;
    var height = 0;
    var t = 0;
    var raf = 0;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var count = 96;
    var alignment = 0.5;
    var turns = 2.35;

    function Particle(i, offset, char) {
        this.i = i;
        this.offset = offset;
        this.char = char;
    }
    Particle.prototype.update = function (time) {
        var yNorm = this.i / (count - 1);
        // Mid pinch so the two strands visibly cross / twist in the center
        var pinch = 0.42 + 0.58 * Math.pow(Math.abs(2 * yNorm - 1), 0.9);
        var radius = (width < 768 ? 78 : 148) * pinch;
        var angle = yNorm * Math.PI * 2 * turns + time + this.offset;
        var x3d = Math.sin(angle) * radius;
        var z3d = Math.cos(angle) * radius;
        var fov = 980;
        var scale = fov / (fov + z3d);
        this.x = (width * alignment) + x3d * scale;
        this.screenY = height * 0.08 + yNorm * height * 0.84;
        this.size = (width < 768 ? 11 : 14) * scale;
        this.z = z3d;
        this.alpha = 0.22 + ((radius - z3d) / (radius * 2 || 1)) * 0.78;
    };
    Particle.prototype.draw = function () {
        ctx.font = "bold " + this.size.toFixed(1) + "px Helvetica, sans-serif";
        ctx.fillStyle = "rgba(35,20,12," + this.alpha.toFixed(3) + ")";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.char, this.x, this.screenY);
    };

    for (var i = 0; i < count; i++) {
        var char = bases[i % 4];
        var pairChar = char === "A" ? "T" : char === "T" ? "A" : char === "C" ? "G" : "C";
        particles.push(new Particle(i, 0, char));
        particles.push(new Particle(i, Math.PI, pairChar));
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

    function draw() {
        ctx.clearRect(0, 0, width, height);
        var glyphs = [];
        for (var n = 0; n < particles.length; n += 2) {
            var p1 = particles[n];
            var p2 = particles[n + 1];
            p1.update(t);
            p2.update(t);
            var lineAlpha = Math.min(p1.alpha, p2.alpha) * 0.28;
            ctx.strokeStyle = "rgba(35,20,12," + lineAlpha.toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.screenY);
            ctx.lineTo(p2.x, p2.screenY);
            ctx.stroke();
            glyphs.push(p1, p2);
        }
        glyphs.sort(function (a, b) { return b.z - a.z; });
        for (var g = 0; g < glyphs.length; g++) glyphs[g].draw();
    }

    function loop() {
        raf = 0;
        if (!active()) return;
        if (!reduce) t += 0.01;
        draw();
        if (!reduce) raf = requestAnimationFrame(loop);
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

    if (window.ResizeObserver) new ResizeObserver(resize).observe(curtain);
    else window.addEventListener("resize", resize);

    new MutationObserver(kick).observe(curtain, { attributes: true, attributeFilter: ["class"] });
    kick();
})();
