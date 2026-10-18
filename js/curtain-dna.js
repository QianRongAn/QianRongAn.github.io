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
    var density = 1.5;
    var alignment = 0.5;
    var tilt = Math.PI / 4;
    var cosTilt = Math.cos(tilt);
    var sinTilt = Math.sin(tilt);

    function Particle(y, offset, char) {
        this.y = y;
        this.offset = offset;
        this.char = char;
    }
    Particle.prototype.update = function (time) {
        var angle = this.y * 0.05 + time + this.offset;
        var radius = width < 768 ? 80 : 150;
        var x3d = Math.sin(angle) * radius;
        var z3d = Math.cos(angle) * radius;
        var axisLength = Math.hypot(width, height) + radius * 2;
        var y3d = (this.y / (80 * density - 1) - 0.5) * axisLength;
        var fov = 1000;
        var scale = fov / (fov + z3d);
        // Tilt the helix axis by 45 degrees, keeping the base letters upright.
        this.x = width * alignment + (x3d * cosTilt - y3d * sinTilt) * scale;
        this.screenY = height * 0.5 + (x3d * sinTilt + y3d * cosTilt) * scale;
        this.size = 12 * scale;
        this.alpha = scale > 1 ? 1 : 0.3;
    };
    Particle.prototype.draw = function () {
        ctx.font = "bold " + this.size + "px Helvetica, sans-serif";
        ctx.fillStyle = "rgba(35,20,12," + this.alpha + ")";
        ctx.textAlign = "center";
        ctx.fillText(this.char, this.x, this.screenY);
    };

    for (var i = 0; i < (80 * density); i++) {
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
        ctx.strokeStyle = "rgba(35,20,12,0.15)";
        for (var n = 0; n < particles.length; n += 2) {
            var p1 = particles[n];
            var p2 = particles[n + 1];
            p1.update(t);
            p2.update(t);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.screenY);
            ctx.lineTo(p2.x, p2.screenY);
            ctx.stroke();
            p1.draw();
            p2.draw();
        }
    }

    function loop() {
        raf = 0;
        if (!active()) return;
        if (!reduce) t += 0.008;
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
