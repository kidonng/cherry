// ==UserScript==
// @name         Reposition Octotree bookmark icon
// @version      1.0.0
// @description  https://github.com/ovity/octotree/issues/992
// @license      MIT
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://github.com/*
// @grant        unsafeWindow
// ==/UserScript==
unsafeWindow.process = { env: {} }
function createCommonjsModule(fn, basedir, module) {
	return module = {
	  path: basedir,
	  exports: {},
	  require: function (path, base) {
      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
    }
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var manyKeysMap = createCommonjsModule(function (module) {

const getInternalKeys = Symbol('getInternalKeys');
const getPrivateKey = Symbol('getPrivateKey');
const publicKeys = Symbol('publicKeys');
const objectHashes = Symbol('objectHashes');
const symbolHashes = Symbol('symbolHashes');
const nullKey = Symbol('null'); // `objectHashes` key for null

let keyCounter = 0;
function checkKeys(keys) {
	if (!Array.isArray(keys)) {
		throw new TypeError('The keys parameter must be an array');
	}
}

module.exports = class ManyKeysMap extends Map {
	constructor() {
		super();

		this[objectHashes] = new WeakMap();
		this[symbolHashes] = new Map(); // https://github.com/tc39/ecma262/issues/1194
		this[publicKeys] = new Map();

		// eslint-disable-next-line prefer-rest-params
		const [pairs] = arguments; // Map compat
		if (pairs === null || pairs === undefined) {
			return;
		}

		if (typeof pairs[Symbol.iterator] !== 'function') {
			throw new TypeError(typeof pairs + ' is not iterable (cannot read property Symbol(Symbol.iterator))');
		}

		for (const [keys, value] of pairs) {
			this.set(keys, value);
		}
	}

	[getInternalKeys](keys, create = false) {
		const privateKey = this[getPrivateKey](keys, create);

		let publicKey;
		if (privateKey && this[publicKeys].has(privateKey)) {
			publicKey = this[publicKeys].get(privateKey);
		} else if (create) {
			publicKey = [...keys]; // Regenerate keys array to avoid external interaction
			this[publicKeys].set(privateKey, publicKey);
		}

		return {privateKey, publicKey};
	}

	[getPrivateKey](keys, create = false) {
		const privateKeys = [];
		for (let key of keys) {
			if (key === null) {
				key = nullKey;
			}

			const hashes = typeof key === 'object' || typeof key === 'function' ? objectHashes : typeof key === 'symbol' ? symbolHashes : false;

			if (!hashes) {
				privateKeys.push(key);
			} else if (this[hashes].has(key)) {
				privateKeys.push(this[hashes].get(key));
			} else if (create) {
				const privateKey = `@@mkm-ref-${keyCounter++}@@`;
				this[hashes].set(key, privateKey);
				privateKeys.push(privateKey);
			} else {
				return false;
			}
		}

		return JSON.stringify(privateKeys);
	}

	set(keys, value) {
		checkKeys(keys);
		const {publicKey} = this[getInternalKeys](keys, true);
		return super.set(publicKey, value);
	}

	get(keys) {
		checkKeys(keys);
		const {publicKey} = this[getInternalKeys](keys);
		return super.get(publicKey);
	}

	has(keys) {
		checkKeys(keys);
		const {publicKey} = this[getInternalKeys](keys);
		return super.has(publicKey);
	}

	delete(keys) {
		checkKeys(keys);
		const {publicKey, privateKey} = this[getInternalKeys](keys);
		return Boolean(publicKey && super.delete(publicKey) && this[publicKeys].delete(privateKey));
	}

	clear() {
		super.clear();
		this[symbolHashes].clear();
		this[publicKeys].clear();
	}

	get [Symbol.toStringTag]() {
		return 'ManyKeysMap';
	}

	get size() {
		return super.size;
	}
};

if (process.env.NODE_ENV === 'test') {
	Object.assign(module.exports, {publicKeys, symbolHashes});
}
});

const pDefer = () => {
	const deferred = {};

	deferred.promise = new Promise((resolve, reject) => {
		deferred.resolve = resolve;
		deferred.reject = reject;
	});

	return deferred;
};

var pDefer_1 = pDefer;

const cache = new manyKeysMap();
const isDomReady = () => document.readyState === 'interactive' || document.readyState === 'complete';

const elementReady = (selector, {
	target = document,
	stopOnDomReady = true,
	timeout = Infinity
} = {}) => {
	const cacheKeys = [target, selector, stopOnDomReady, timeout];
	const cachedPromise = cache.get(cacheKeys);
	if (cachedPromise) {
		return cachedPromise;
	}

	let rafId;
	const deferred = pDefer_1();
	const {promise} = deferred;

	cache.set(cacheKeys, promise);

	const stop = () => {
		cancelAnimationFrame(rafId);
		cache.delete(cacheKeys, promise);
		deferred.resolve();
	};

	if (timeout !== Infinity) {
		setTimeout(stop, timeout);
	}

	// Interval to keep checking for it to come into the DOM.
	(function check() {
		const element = target.querySelector(selector);

		if (element) {
			deferred.resolve(element);
			stop();
		} else if (stopOnDomReady && isDomReady()) {
			stop();
		} else {
			rafId = requestAnimationFrame(check);
		}
	})();

	return Object.assign(promise, {stop});
};

var elementReady_1 = elementReady;

// ==UserScript==
(async () => {
  const icon = await elementReady_1('.gh-header-title .octotree-btn', {
    stopOnDomReady: false,
  });
  icon.parentElement.prepend(icon);
  icon.style.position = 'relative';
  icon.style.left = '-25px';
  icon.style.marginRight = '-25px';
})();
