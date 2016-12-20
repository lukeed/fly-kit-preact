'use strict';

const bs = require('browser-sync');
const cRoll = require('./config/rollup');
const cUgly = require('./config/uglify');

let isWatch = 0;

const tar = 'dist';
const node = 'node_modules';
const src = {
	js: 'src/**/*.js',
	css: 'src/**/*.s{a,c}ss',
	copy: 'src/static/**',
	vendor: [
		// js vendors to be merged as `vendor.js`
	]
}

export async function clean() {
	yield this.clear(tar);
}

export async function copies(o) {
	await this.source(o.src || src.copy).target(`${tar}/static`);
}

export async function scripts() {
	await this.source('src/index.js').xo().rollup(cRoll).concat('bundle.js').target(tar);
}

export async function vendors() {
	await this.source(src.vendor).concat('vendor.js').target(`${tar}/js`);
}

export async function styles() {
	await this.source('src/index.sass').sass({
		outputStyle: 'compressed',
		includePaths: []
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
	bs({server: tar, port: process.env.PORT});
}

export async function reload() {
	isWatch && bs.reload();
}
