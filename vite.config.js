import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => ({
	root: '.',
	base: './',
	server: {
		open: mode === 'journey' ? '/' : '/butterfly/index.html',
	},
	build: {
		outDir: mode === 'journey' ? 'js/research-journey' : 'js/hero-butterfly',
		emptyOutDir: true,
		lib: {
			entry: resolve(__dirname, mode === 'journey' ? 'journey/main.js' : 'butterfly/main.js'),
			name: mode === 'journey' ? 'ResearchJourney' : 'HeroButterfly',
			formats: ['es'],
			fileName: () => mode === 'journey' ? 'main.js' : 'butterfly.js',
			cssFileName: 'style',
		},
		rollupOptions: {
			output: {
				inlineDynamicImports: true,
			},
		},
	},
}));
