'use strict';

const bs = require('browser-sync');
const cRoll = require('./config/rollup');
const cUgly = require('./config/uglify');

let isWatch = 0;

const tar = 'dist';
const node = 'node_modules';
const src = {
	js: 'src/scripts/**',
	css: 'src/styles/**',
	copy: [
		'src/static/**/*',
		'src/*.html'
	],
	vendor: [
		// js vendors to be merged as `vendor.js`
	]
};

export async function clean() {
	await this.clear(tar);
}

export async function copies(o) {
	await this.source(o.src || src.copy).target(tar);
}

export async function scripts() {
	await this.source('src/scripts/app.js').xo().rollup(cRoll).target(`${tar}/js`);
}

export async function vendors() {
	await this.source(src.vendor).concat('vendor.js').target(`${tar}/js`);
}

export async function styles() {
	await this.source('src/styles/app.sass').sass({
		outputStyle: 'compressed',
		includePaths: [`${node}/md-colors/src`]
	}).autoprefixer().target(`${tar}/css`);
}

export async function build() {
	await this.start('clean');
	await this.serial(['copies', 'vendors', 'scripts', 'styles']); // @todo: parallel
}

export async function release() {
	await this.start('build');
	// minify js
	await this.source(`${tar}/js/*`).uglify(cUgly).target(`${tar}/js`);
	// version assets
	await this.source(`${tar}/**/*`).rev({
		ignores: ['.html', '.png', '.svg', '.ico', '.json', '.txt']
	}).revManifest({dest: tar}).revReplace().target(tar);
}

export async function watch() {
	isWatch = 1;
	await this.start('build');
	await this.watch(src.js, ['scripts', 'reload']);
	await this.watch(src.css, ['styles', 'reload']);
	await this.watch(src.copy, ['copies', 'reload']);
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
