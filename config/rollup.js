const alias = require('rollup-plugin-alias');
const buble = require('rollup-plugin-buble');
const replace = require('rollup-plugin-replace');
const resolve = require('rollup-plugin-node-resolve');

module.exports = isDev => ({
	rollup: {
		plugins: [
			alias({
				// you may need `preact-compat` instead!
				react: 'preact/aliases',
				'react-dom': 'preact/aliases'
			}),
			buble({
				jsx: 'h',
				transforms: {
					modules: false
				}
			}),
			replace({'process.env.NODE_ENV': JSON.stringify(isDev || 'production')}),
			resolve({browser: true, jsnext: true})
		]
	},
	bundle: {
		format: 'iife',
		sourceMap: isDev && true
	}
});
