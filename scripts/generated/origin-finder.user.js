// ==UserScript==
// @name         Origin Finder
// @version      5
// @description  Redirect to resources' origin version
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        http://*/*
// @match        https://*/*
// @run-at       document-start
// ==/UserScript==
(()=>{(async()=>{let o=new URL(location.href),{hostname:e,pathname:t,searchParams:c}=o,m=[[()=>e.endsWith(".github.com")&&document.querySelector(`a[href="//${e.replace(".com",".io")}/"]`),()=>({hostname:e.replace(".github.com",".github.io")})],[()=>e.endsWith(".m.wikipedia.org")&&!navigator.userAgentData?.mobile,()=>({hostname:e.replace(".m.wikipedia.org",".wikipedia.org")})],["img.moegirl.org.cn",()=>({pathname:t.replace(/(\/common\/avatars\/\d+\/)128\.png/,"$1original.png")})],[()=>e==="mzh.moegirl.org.cn"&&!navigator.userAgentData?.mobile&&!c.has("mobileaction"),{hostname:"zh.moegirl.org.cn"}],["dynasty-scans.com",()=>{let a=/(tag_contents_covers\/(\d{3}\/){3})(medium|thumb)/,i=t.match(a);if(i){let n=t.replace(a,"$1original");fetch(n,{method:"HEAD"}).then(({ok:r})=>{r?(o.pathname=n,location.assign(o.href)):i[3]==="thumb"&&(o.pathname=t.replace(a,"$1medium"),location.assign(o.href))}).catch(()=>{})}}],["www2.zhihu.com",{hostname:"www.zhihu.com"}],[()=>["c.tieba.baidu.com","dq.tieba.com","jump2.bdimg.com","tieba.baidu.com","tiebac.baidu.com","wapp.baidu.com","wefan.baidu.com"].includes(e),()=>(window.PageData?.user&&(window.PageData.user.is_login=!0),{hostname:"tieba.baidu.com",pathname:t.replace(/.*\/m/,"/f")})],["strongloop.com",{href:"https://github.com/strongloop"}]];for(let[a,i]of m){if(typeof a=="function"?!a():e!==a)continue;let n=typeof i=="function"?i():i;Object.assign(o,n),location.href!==o.href&&location.assign(o.href)}})();})();
