'use strict';

const bs = require('browser-sync');
const cRoll = require('./config/rollup');
const cUgly = require('./config/uglify');

let isWatch = 0;

const tar = 'dist';
const rel = 'release';
const node = 'node_modules';
const src = {
	js: 'src/scripts/**',
	css: 'src/styles/**',
	copy: [
		'src/static/**/*.*',
		'src/*.html'
	],
	vendor: [
		// js vendors to be merged as `vendor.js`
		`${node}/promise-polyfill/promise.min.js`
	]
};

export async function clean(fly) {
	await fly.clear([tar, rel]);
}

export async function copies(fly, o) {
	await fly.source(o.src || src.copy).target(tar);
}

export async function scripts(fly) {
	await fly.source('src/scripts/app.js').xo().rollup(cRoll).target(`${tar}/js`);
}

export async function vendors(fly) {
	await fly.source(src.vendor).concat('vendor.js').target(`${tar}/js`);
}

export async function styles(fly) {
	await fly.source('src/styles/app.sass').sass({
		outputStyle: 'compressed',
		includePaths: [`${node}/md-colors/src`]
	}).autoprefixer().target(`${tar}/css`);
}

export async function build(fly) {
	await fly.parallel(['clean', 'copies', 'vendors', 'scripts', 'styles']);
}

export async function release(fly) {
	await fly.start('build');
	// minify js
	await fly.source(`${tar}/js/*`).uglify(cUgly).target(`${tar}/js`);
	// version assets
	await fly.source(`${tar}/**/*`).rev({
		ignores: ['.html', '.png', '.svg', '.ico', '.json', '.txt']
	}).revManifest({dest: rel, trim: tar}).revReplace().target(rel);
	// make assets available for offline
	await fly.source(`${rel}/**/*`).precache({
		stripPrefix: rel,
		navigateFallback: 'index.html'
	}).target(rel);
}

export async function watch(fly) {
	isWatch = 1;
	await fly.start('build');
	await fly.watch(src.js, ['scripts', 'reload']);
	await fly.watch(src.css, ['styles', 'reload']);
	await fly.watch(src.copy, ['copies', 'reload']);
	// start server
	bs({
		server: tar,
		logPrefix: 'Fly',
		port: process.env.PORT || 3000,
		middleware: [
			require('connect-history-api-fallback')()
		]
	});
}

export async function reload() {
	isWatch && bs.reload();
}
