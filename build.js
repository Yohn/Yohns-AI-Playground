// build.js
import esbuild from 'esbuild';
import path from 'path';
//const esbuild = require('esbuild');
//const path = require('path');

esbuild.build({
	entryPoints: [
		path.resolve('www/assets/js/index.js'),
	],
	//outdir: path.resolve('www/assets/js/bundled'),
	outfile: path.resolve('www/assets/js/bundled/all-in-one.js'),
	minify: true,
	bundle: true,
	treeShaking: false, // Include all code
	target: ['esnext'],
	sourcemap: true,
}).catch(() => process.exit(1));
