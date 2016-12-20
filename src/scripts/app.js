import {h, render} from 'preact';
import App from './views';

let base;
function init() {
	base = render(<App/>, document.body, base);
}

init();
