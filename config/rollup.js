const jsx = require('rollup-plugin-jsx');
const buble = require('rollup-plugin-buble');
const replace = require('rollup-plugin-replace');
const resolve = require('rollup-plugin-node-resolve');

module.exports = {
	rollup: {
		plugins: [
			buble(),
			jsx({factory: 'h'}),
			resolve({browser: true, jsnext: true}),
			replace({'process.env.NODE_ENV': JSON.stringify('production')})
		]
	},
	bundle: {
		format: 'iife',
		sourceMap: true
	}
};
