// ==UserScript==
// @name         GitHub hide public badge
// @version      4
// @description  Hides "Public" repository badge or removes "Public" prefix
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://github.com/*
// ==/UserScript==
function e(){if(!(this instanceof e))return new e;this.size=0,this.uid=0,this.selectors=[],this.selectorObjects={},this.indexes=Object.create(this.indexes),this.activeIndexes=[]}var t=window.document.documentElement,r=t.matches||t.webkitMatchesSelector||t.mozMatchesSelector||t.oMatchesSelector||t.msMatchesSelector;e.prototype.matchesSelector=function(e,t){return r.call(e,t)},e.prototype.querySelectorAll=function(e,t){return t.querySelectorAll(e)},e.prototype.indexes=[];var n=/^#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/g;e.prototype.indexes.push({name:"ID",selector:function(e){var t;if(t=e.match(n))return t[0].slice(1)},element:function(e){if(e.id)return[e.id]}});var o=/^\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/g;e.prototype.indexes.push({name:"CLASS",selector:function(e){var t;if(t=e.match(o))return t[0].slice(1)},element:function(e){var t=e.className;if(t){if("string"==typeof t)return t.split(/\s/);if("object"==typeof t&&"baseVal"in t)return t.baseVal.split(/\s/)}}});var i,s=/^((?:[\w\u00c0-\uFFFF\-]|\\.)+)/g;e.prototype.indexes.push({name:"TAG",selector:function(e){var t;if(t=e.match(s))return t[0].toUpperCase()},element:function(e){return[e.nodeName.toUpperCase()]}}),e.prototype.indexes.default={name:"UNIVERSAL",selector:function(){return!0},element:function(){return[!0]}},i="function"==typeof window.Map?window.Map:function(){function e(){this.map={}}return e.prototype.get=function(e){return this.map[e+" "]},e.prototype.set=function(e,t){this.map[e+" "]=t},e}();var a=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g;function l(e,t){var r,n,o,i,s,l,c=(e=e.slice(0).concat(e.default)).length,u=t,d=[];do{if(a.exec(""),(o=a.exec(u))&&(u=o[3],o[2]||!u))for(r=0;r<c;r++)if(s=(l=e[r]).selector(o[1])){for(n=d.length,i=!1;n--;)if(d[n].index===l&&d[n].key===s){i=!0;break}i||d.push({index:l,key:s});break}}while(o);return d}function c(e,t){var r,n,o;for(r=0,n=e.length;r<n;r++)if(o=e[r],t.isPrototypeOf(o))return o}function u(e,t){return e.id-t.id}e.prototype.logDefaultIndexUsed=function(){},e.prototype.add=function(e,t){var r,n,o,s,a,u,d,f,h=this.activeIndexes,v=this.selectors,p=this.selectorObjects;if("string"==typeof e){for(p[(r={id:this.uid++,selector:e,data:t}).id]=r,d=l(this.indexes,e),n=0;n<d.length;n++)s=(f=d[n]).key,(a=c(h,o=f.index))||((a=Object.create(o)).map=new i,h.push(a)),o===this.indexes.default&&this.logDefaultIndexUsed(r),(u=a.map.get(s))||(u=[],a.map.set(s,u)),u.push(r);this.size++,v.push(e)}},e.prototype.remove=function(e,t){if("string"==typeof e){var r,n,o,i,s,a,c,u,d=this.activeIndexes,f=this.selectors=[],h=this.selectorObjects,v={},p=1===arguments.length;for(r=l(this.indexes,e),o=0;o<r.length;o++)for(n=r[o],i=d.length;i--;)if(a=d[i],n.index.isPrototypeOf(a)){if(c=a.map.get(n.key))for(s=c.length;s--;)(u=c[s]).selector!==e||!p&&u.data!==t||(c.splice(s,1),v[u.id]=!0);break}for(o in v)delete h[o],this.size--;for(o in h)f.push(h[o].selector)}},e.prototype.queryAll=function(e){if(!this.selectors.length)return[];var t,r,n,o,i,s,a,l,c={},d=[],f=this.querySelectorAll(this.selectors.join(", "),e);for(t=0,n=f.length;t<n;t++)for(i=f[t],r=0,o=(s=this.matches(i)).length;r<o;r++)c[(l=s[r]).id]?a=c[l.id]:(a={id:l.id,selector:l.selector,data:l.data,elements:[]},c[l.id]=a,d.push(a)),a.elements.push(i);return d.sort(u)},e.prototype.matches=function(e){if(!e)return[];var t,r,n,o,i,s,a,l,c,d,f,h=this.activeIndexes,v={},p=[];for(t=0,o=h.length;t<o;t++)if(l=(a=h[t]).element(e))for(r=0,i=l.length;r<i;r++)if(c=a.map.get(l[r]))for(n=0,s=c.length;n<s;n++)!v[f=(d=c[n]).id]&&this.matchesSelector(e,d.selector)&&(v[f]=!0,p.push(d));return p.sort(u)};var d=null,f=null,h=[];function v(e,t){var r=[];function n(){var e=r;r=[],t(e)}return function(){for(var t=arguments.length,o=Array(t),i=0;i<t;i++)o[i]=arguments[i];r.push(o),1===r.length&&p(e,n)}}function p(e,t){f||(f=new MutationObserver(m)),d||(d=e.createElement("div"),f.observe(d,{attributes:!0})),h.push(t),d.setAttribute("data-twiddle",""+Date.now())}function m(){var e=h;h=[];for(var t=0;t<e.length;t++)try{e[t]()}catch(e){setTimeout((function(){throw e}),0)}}var b=new WeakMap,g=new WeakMap,y=new WeakMap,w=new WeakMap;function S(e,t){for(var r=0;r<t.length;r++){var n=t[r],o=n[0],i=n[1],s=n[2];o===k?(x(s,i),A(s,i)):o===L?O(s,i):o===q&&M(e.observers,i)}}function x(e,t){if(t instanceof e.elementConstructor){var r=b.get(t);if(r||(r=[],b.set(t,r)),-1===r.indexOf(e.id)){var n=void 0;if(e.initialize&&(n=e.initialize.call(void 0,t)),n){var o=g.get(t);o||(o={},g.set(t,o)),o[""+e.id]=n}r.push(e.id)}}}function A(e,t){if(t instanceof e.elementConstructor){var r=w.get(t);if(r||(r=[],w.set(t,r)),-1===r.indexOf(e.id)){e.elements.push(t);var n=g.get(t),o=n?n[""+e.id]:null;if(o&&o.add&&o.add.call(void 0,t),e.subscribe){var i=e.subscribe.call(void 0,t);if(i){var s=y.get(t);s||(s={},y.set(t,s)),s[""+e.id]=i}}e.add&&e.add.call(void 0,t),r.push(e.id)}}}function O(e,t){if(t instanceof e.elementConstructor){var r=w.get(t);if(r){var n=e.elements.indexOf(t);if(-1!==n&&e.elements.splice(n,1),-1!==(n=r.indexOf(e.id))){var o=g.get(t),i=o?o[""+e.id]:null;if(i&&i.remove&&i.remove.call(void 0,t),e.subscribe){var s=y.get(t),a=s?s[""+e.id]:null;a&&a.unsubscribe&&a.unsubscribe()}e.remove&&e.remove.call(void 0,t),r.splice(n,1)}0===r.length&&w.delete(t)}}}function M(e,t){var r=w.get(t);if(r){for(var n=r.slice(0),o=0;o<n.length;o++){var i=e[n[o]];if(i){var s=i.elements.indexOf(t);-1!==s&&i.elements.splice(s,1);var a=g.get(t),l=a?a[""+i.id]:null;l&&l.remove&&l.remove.call(void 0,t);var c=y.get(t),u=c?c[""+i.id]:null;u&&u.unsubscribe&&u.unsubscribe(),i.remove&&i.remove.call(void 0,t)}}w.delete(t)}}var C=null;function N(e){return"matches"in e||"webkitMatchesSelector"in e||"mozMatchesSelector"in e||"oMatchesSelector"in e||"msMatchesSelector"in e}var k=1,L=2,q=3;function D(e,t,r){for(var n=0;n<r.length;n++){var o=r[n];"childList"===o.type?(F(e,t,o.addedNodes),z(e,t,o.removedNodes)):"attributes"===o.type&&E(e,t,o.target)}(function(e){if(null===C){var t=e.createElement("div"),r=e.createElement("div"),n=e.createElement("div");t.appendChild(r),r.appendChild(n),t.innerHTML="",C=n.parentNode!==r}return C})(e.ownerDocument)&&function(e,t){for(var r=0;r<e.observers.length;r++){var n=e.observers[r];if(n)for(var o=n.elements,i=0;i<o.length;i++){var s=o[i];s.parentNode||t.push([q,s])}}}(e,t)}function F(e,t,r){for(var n=0;n<r.length;n++){var o=r[n];if(N(o))for(var i=e.selectorSet.matches(o),s=0;s<i.length;s++){var a=i[s].data;t.push([k,o,a])}if("querySelectorAll"in o)for(var l=e.selectorSet.queryAll(o),c=0;c<l.length;c++)for(var u=l[c],d=u.data,f=u.elements,h=0;h<f.length;h++)t.push([k,f[h],d])}}function z(e,t,r){for(var n=0;n<r.length;n++){var o=r[n];if("querySelectorAll"in o){t.push([q,o]);for(var i=o.querySelectorAll("*"),s=0;s<i.length;s++)t.push([q,i[s]])}}}function E(e,t,r){if(N(r))for(var n=e.selectorSet.matches(r),o=0;o<n.length;o++){var i=n[o].data;t.push([k,r,i])}if("querySelectorAll"in r){var s=w.get(r);if(s)for(var a=0;a<s.length;a++){var l=e.observers[s[a]];l&&(e.selectorSet.matchesSelector(r,l.selector)||t.push([L,r,l]))}}}var T="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},j=0;function I(t){this.rootNode=9===t.nodeType?t.documentElement:t,this.ownerDocument=9===t.nodeType?t:t.ownerDocument,this.observers=[],this.selectorSet=new e,this.mutationObserver=new MutationObserver(P.bind(this,this)),this._scheduleAddRootNodes=v(this.ownerDocument,U.bind(this,this)),this._handleThrottledChangedTargets=v(this.ownerDocument,V.bind(this,this)),this.rootNode.addEventListener("change",R.bind(this,this),!1),function(e,t){var r=e.readyState;"interactive"===r||"complete"===r?p(e,t):e.addEventListener("DOMContentLoaded",p(e,t))}(this.ownerDocument,_.bind(this,this))}function _(e){e.mutationObserver.observe(e.rootNode,{childList:!0,attributes:!0,subtree:!0}),e._scheduleAddRootNodes()}function U(e){var t=[];F(e,t,[e.rootNode]),S(e,t)}function P(e,t){var r=[];D(e,r,t),S(e,r)}function R(e,t){e._handleThrottledChangedTargets(t.target)}function V(e,t){var r=[];!function(e,t,r){for(var n=0;n<r.length;n++)for(var o=r[n],i=o.form?o.form.elements:e.rootNode.querySelectorAll("input"),s=0;s<i.length;s++)E(e,t,i[s])}(e,r,t),S(e,r)}I.prototype.disconnect=function(){this.mutationObserver.disconnect()},I.prototype.observe=function(e,t){var r=void 0;"function"==typeof t?r={selector:e,initialize:t}:"object"===(void 0===t?"undefined":T(t))?(r=t).selector=e:r=e;var n=this,o={id:j++,selector:r.selector,initialize:r.initialize,add:r.add,remove:r.remove,subscribe:r.subscribe,elements:[],elementConstructor:r.hasOwnProperty("constructor")?r.constructor:this.ownerDocument.defaultView.Element,abort:function(){n._abortObserving(o)}};return this.selectorSet.add(o.selector,o),this.observers[o.id]=o,this._scheduleAddRootNodes(),o},I.prototype._abortObserving=function(e){for(var t=e.elements,r=0;r<t.length;r++)O(e,t[r]);this.selectorSet.remove(e.selector,e),delete this.observers[e.id]},I.prototype.triggerObservers=function(e){var t=[];!function(e,t,r){if("querySelectorAll"in r){E(e,t,r);for(var n=r.querySelectorAll("*"),o=0;o<n.length;o++)E(e,t,n[o])}}(this,t,e),S(this,t)};var W=void 0;function H(){return W||(W=new I(window.document)),W}document.head.insertAdjacentHTML("beforeend","<style>\n    .rgh-ci-link .Label[hidden] + .commit-build-statuses {\n      margin-left: 0;\n    }\n  </style>"),function(){var e;(e=H()).observe.apply(e,arguments)}
// ==UserScript==
(".Label.Label--secondary",{add(e){const t=e.textContent.trim().replace(/^Public ?/,"");var r;""===t?e.hidden=!0:e.textContent=(r=t).charAt(0).toUpperCase()+r.slice(1).toLowerCase()}});
