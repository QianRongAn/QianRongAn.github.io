/**
 * 开场 3D 蝴蝶 — Vite + three@0.185 WebGPU/TSL 单场景
 * 程序化建模 + 翅膀 TSL 扇动 + Lissajous 飞行
 */
import * as THREE from 'three/webgpu';
import {
	time,
	oscSine,
	positionLocal,
	uv,
	vec3,
	float,
	mix,
	color,
} from 'three/tsl';

/** @type {THREE.WebGPURenderer | null} */
let renderer = null;
/** @type {number} */
let raf = 0;
/** @type {(() => void) | null} */
let onResize = null;

/**
 * 前翅轮廓（局部 +X 伸展，根部贴身体）
 * @returns {THREE.Shape}
 */
function createForewingShape() {
	const shape = new THREE.Shape();
	shape.moveTo(0.02, 0.02);
	shape.bezierCurveTo(0.25, 0.55, 0.85, 0.75, 1.45, 0.28);
	shape.bezierCurveTo(1.55, 0.05, 1.35, -0.18, 0.85, -0.12);
	shape.bezierCurveTo(0.4, -0.06, 0.12, -0.02, 0.02, 0.02);
	return shape;
}

/**
 * 后翅轮廓（略小、略下垂）
 * @returns {THREE.Shape}
 */
function createHindwingShape() {
	const shape = new THREE.Shape();
	shape.moveTo(0.02, -0.02);
	shape.bezierCurveTo(0.2, -0.05, 0.55, -0.55, 1.05, -0.45);
	shape.bezierCurveTo(1.2, -0.25, 1.05, 0.05, 0.65, 0.12);
	shape.bezierCurveTo(0.3, 0.1, 0.1, 0.02, 0.02, -0.02);
	return shape;
}

/**
 * Shape → 薄片 BufferGeometry，并写入便于着色的属性
 * @param {THREE.Shape} shape
 * @returns {THREE.BufferGeometry}
 */
function shapeToWingGeometry(shape) {
	const geo = new THREE.ShapeGeometry(shape, 24);
	// Shape 默认在 XY，转到 XZ 水平面，+X 为展向
	geo.rotateX(-Math.PI * 0.5);
	geo.computeVertexNormals();
	return geo;
}

/**
 * 翅膀 NodeMaterial：横向渐变 + 半透明 + TSL 顶点扇动
 * @param {{ side: 'left'|'right', tier: 'fore'|'hind', tip: string, root: string }} opts
 * @returns {THREE.MeshBasicNodeMaterial}
 */
function createWingMaterial(opts) {
	const material = new THREE.MeshBasicNodeMaterial();
	material.transparent = true;
	material.depthWrite = false;
	material.side = THREE.DoubleSide;
	material.opacity = 0.82;

	// 根→尖横向渐变（用几何 uv.x）
	const rootCol = color(opts.root);
	const tipCol = color(opts.tip);
	material.colorNode = mix(rootCol, tipCol, uv().x);
	material.opacityNode = float(0.78);

	// 扇动：前翅更快，后翅稍慢；左右相位差 π
	const freq = opts.tier === 'fore' ? 5.2 : 3.6;
	const phase = opts.side === 'left' ? Math.PI : 0;
	const flap = oscSine(time.mul(freq).add(phase)).mul(2).sub(1); // [-1, 1]

	// 距体轴越远振幅越大（用 |x|）；沿局部 Y 开合
	const amount = opts.tier === 'fore' ? 0.55 : 0.4;
	const lift = positionLocal.x.abs().mul(flap).mul(amount);
	material.positionNode = positionLocal.add(vec3(0, lift, 0));

	return material;
}

/**
 * 组装一只完整蝴蝶（身体 + 触角 + 两对翅）
 * @returns {THREE.Group}
 */
function createButterfly() {
	const root = new THREE.Group();

	// —— 身体 ——
	const bodyMat = new THREE.MeshBasicNodeMaterial({ color: '#2a1810' });
	const thorax = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), bodyMat);
	thorax.scale.set(0.85, 1.1, 1.2);
	root.add(thorax);

	const abdomen = new THREE.Mesh(
		new THREE.CapsuleGeometry(0.055, 0.28, 6, 12),
		new THREE.MeshBasicNodeMaterial({ color: '#3d2418' })
	);
	abdomen.rotation.z = Math.PI * 0.5;
	abdomen.position.set(-0.22, 0, 0);
	root.add(abdomen);

	const head = new THREE.Mesh(
		new THREE.SphereGeometry(0.07, 14, 12),
		new THREE.MeshBasicNodeMaterial({ color: '#1a100c' })
	);
	head.position.set(0.14, 0.02, 0);
	root.add(head);

	// —— 触角 ——
	const antMat = new THREE.MeshBasicNodeMaterial({ color: '#1a100c' });
	[-1, 1].forEach((side) => {
		const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.006, 0.32, 6), antMat);
		ant.position.set(0.26, 0.18, side * 0.04);
		ant.rotation.z = -0.55;
		ant.rotation.x = side * 0.35;
		root.add(ant);
		const tip = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), antMat);
		tip.position.set(0.38, 0.32, side * 0.08);
		root.add(tip);
	});

	// —— 两对翅膀 ——
	const foreGeo = shapeToWingGeometry(createForewingShape());
	const hindGeo = shapeToWingGeometry(createHindwingShape());

	const wingDefs = [
		{ side: 'right', tier: 'fore', geo: foreGeo, y: 0.04, z: 0.02, root: '#f4c27a', tip: '#e85d4c' },
		{ side: 'left', tier: 'fore', geo: foreGeo, y: 0.04, z: -0.02, root: '#f4c27a', tip: '#e85d4c' },
		{ side: 'right', tier: 'hind', geo: hindGeo, y: -0.06, z: 0.02, root: '#c9a0dc', tip: '#6b4cff' },
		{ side: 'left', tier: 'hind', geo: hindGeo, y: -0.06, z: -0.02, root: '#c9a0dc', tip: '#6b4cff' },
	];

	for (const def of wingDefs) {
		const mat = createWingMaterial({
			side: /** @type {'left'|'right'} */ (def.side),
			tier: /** @type {'fore'|'hind'} */ (def.tier),
			root: def.root,
			tip: def.tip,
		});
		const mesh = new THREE.Mesh(def.geo, mat);
		mesh.position.set(0.02, def.y, def.z);
		if (def.side === 'left') {
			mesh.scale.x = -1;
		}
		root.add(mesh);
	}

	root.scale.setScalar(0.85);
	return root;
}

/**
 * Lissajous 8 字轨迹（水平面为主，略带高度起伏）
 * @param {number} t
 * @param {THREE.Vector3} out
 */
function sampleLissajous(t, out) {
	const ax = 1.65;
	const ay = 0.55;
	const az = 1.1;
	out.set(
		Math.sin(t) * ax,
		Math.sin(2 * t) * ay * 0.35 + 0.15,
		Math.sin(2 * t) * az * 0.5
	);
}

/**
 * 轨迹切线（数值导数），用于姿态对齐
 * @param {number} t
 * @param {THREE.Vector3} out
 */
function sampleLissajousTangent(t, out) {
	const eps = 0.01;
	const a = new THREE.Vector3();
	const b = new THREE.Vector3();
	sampleLissajous(t + eps, a);
	sampleLissajous(t - eps, b);
	out.copy(a).sub(b).normalize();
}

/**
 * 启动开场蝴蝶；失败时静默跳过，不影响主页
 */
async function startHeroButterfly() {
	if (document.documentElement.classList.contains('skip-hero')) return;

	const host = document.getElementById('heroButterfly');
	if (!host) return;

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
	camera.position.set(0, 1.15, 4.2);
	camera.lookAt(0, 0.2, 0);

	renderer = new THREE.WebGPURenderer({
		antialias: true,
		alpha: true,
		powerPreference: 'high-performance',
	});
	renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
	renderer.setClearColor(0x000000, 0);

	try {
		await renderer.init();
	} catch (err) {
		console.warn('[butterfly] WebGPU/WebGL2 初始化失败', err);
		return;
	}

	const canvas = renderer.domElement;
	canvas.className = 'hero-butterfly-canvas';
	canvas.setAttribute('aria-hidden', 'true');
	host.appendChild(canvas);

	const butterfly = createButterfly();
	scene.add(butterfly);

	// 柔和环境光，翅膀渐变更清楚
	scene.add(new THREE.AmbientLight(0xffffff, 1));

	const clock = new THREE.Clock();
	const pos = new THREE.Vector3();
	const tangent = new THREE.Vector3();
	const look = new THREE.Vector3();
	const up = new THREE.Vector3(0, 1, 0);

	const resize = () => {
		const w = host.clientWidth || window.innerWidth;
		const h = host.clientHeight || window.innerHeight;
		camera.aspect = w / Math.max(h, 1);
		camera.updateProjectionMatrix();
		renderer.setSize(w, h, false);
	};
	onResize = resize;
	resize();
	window.addEventListener('resize', resize);

	const tick = () => {
		raf = requestAnimationFrame(tick);
		const t = clock.getElapsedTime() * 0.55;

		sampleLissajous(t, pos);
		sampleLissajousTangent(t, tangent);
		butterfly.position.copy(pos);

		// 姿态：机头朝切线，机翼大致水平
		look.copy(pos).add(tangent);
		butterfly.up.copy(up);
		butterfly.lookAt(look);
		// 略抬头，避免完全俯冲显得扁
		butterfly.rotateX(-0.25);

		renderer.render(scene, camera);
	};
	tick();

	// 离开开场时释放资源
	const hero = document.getElementById('heroScreen');
	const stop = () => {
		cancelAnimationFrame(raf);
		if (onResize) window.removeEventListener('resize', onResize);
		if (renderer) {
			renderer.dispose();
			if (renderer.domElement && renderer.domElement.parentNode) {
				renderer.domElement.parentNode.removeChild(renderer.domElement);
			}
		}
		renderer = null;
	};
	if (hero) hero.addEventListener('hero:dismiss', stop, { once: true });
}

startHeroButterfly().catch((err) => {
	console.warn('[butterfly] 启动失败', err);
});
