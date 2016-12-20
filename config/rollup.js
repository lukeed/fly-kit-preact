import jsx from 'rollup-plugin-jsx';
import buble from 'rollup-plugin-buble';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';

module.exports = {
	rollup: {
		plugins: [
			buble(),
			jsx({factory: 'h'}),
			resolve({browser: true, main: true}),
			replace({'process.env.NODE_ENV': JSON.stringify('production')})
		]
	},
	bundle: {
		format: 'iife',
		sourceMap: true
	}
};
