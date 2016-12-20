'use strict';

const bs = require('browser-sync');
const rollup = require('rollup').rollup;
const cf = require('./rollup.config');

let isWatch = 0;

const out = 'dist';
const node = 'node_modules';

export async function clean() {
	yield this.clear(out);
}

export async function copies() {
	await this.source('src/index.html').target(out);
}

export async function build() {
	await this.start('clean');
	// @todo: parallel
	await this.serial(['copies', 'scripts']);
}

let bun;
export async function scripts() {
	Object.assign(cf.rollup, {cache: bun});
	bun = await rollup(cf.rollup);
	bun.write(cf.bundle);
	isWatch && bs.reload();
}

export async function watch() {
	isWatch = 1;
	await this.start('build');
	await this.watch('src/**/*.js', 'scripts');
	// start server
	bs({server: out, port: process.env.PORT});
}
