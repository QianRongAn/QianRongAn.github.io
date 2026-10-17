import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
	root: '.',
	base: './',
	server: {
		open: '/butterfly/index.html',
	},
	build: {
		outDir: 'js/hero-butterfly',
		emptyOutDir: true,
		lib: {
			entry: resolve(__dirname, 'butterfly/main.js'),
			name: 'HeroButterfly',
			formats: ['es'],
			fileName: () => 'butterfly.js',
		},
		rollupOptions: {
			output: {
				inlineDynamicImports: true,
			},
		},
	},
});
