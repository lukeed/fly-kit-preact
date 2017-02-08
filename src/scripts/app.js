import {h, render} from 'preact';
import {nav, loc, onSuccess, onError} from './sw';
import App from './views';

// render app to document
render(<App/>, document.body);

if (process.env.NODE_ENV === 'production' && 'serviceWorker' in nav && loc.protocol === 'https:') {
	// cache all assets if browser supports serviceworker
	nav.serviceWorker.register('/service-worker.js').then(onSuccess).catch(onError);
}
