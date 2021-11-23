// ==UserScript==
// @name         Origin Finder
// @version      4
// @description  Redirect to resources' origin version
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        http*://*
// @run-at       document-start
// ==/UserScript==
(()=>{(async()=>{let e=new URL(location.href),{hostname:a,pathname:i,searchParams:c}=e;function r(){return window.PageData?.user&&(window.PageData.user.is_login=!0),{hostname:"tieba.baidu.com",pathname:i.replace(/.*\/m/,"/f")}}let m={[a](){if(a.endsWith(".github.com")&&document.querySelector('a[href="https://github.blog/changelog/2021-01-29-github-pages-will-stop-redirecting-pages-sites-from-github-com-after-april-15-2021/"]'))return{hostname:a.replace(".github.com",".github.io")};if(a.endsWith(".m.wikipedia.org")&&!navigator.userAgentData?.mobile)return{hostname:a.replace(".m.wikipedia.org",".wikipedia.org")}},"img.moegirl.org.cn":()=>({pathname:i.replace(/(\/common\/avatars\/\d+\/)128\.png/,"$1original.png")}),"mzh.moegirl.org.cn":()=>!navigator.userAgentData?.mobile&&!c.has("mobileaction")&&{hostname:"zh.moegirl.org.cn"},"dynasty-scans.com"(){let t=/(tag_contents_covers\/(\d{3}\/){3})(medium|thumb)/,o=i.match(t);if(o){let n=i.replace(t,"$1original");fetch(n,{method:"HEAD"}).then(({ok:s})=>{s?(e.pathname=n,location.assign(e.href)):o[3]==="thumb"&&(e.pathname=i.replace(t,"$1medium"),location.assign(e.href))}).catch(()=>{})}},"www2.zhihu.com":()=>({hostname:"www.zhihu.com"}),...Object.fromEntries(["c.tieba.baidu.com","dq.tieba.com","jump2.bdimg.com","tieba.baidu.com","tiebac.baidu.com","wapp.baidu.com","wefan.baidu.com"].map(t=>[t,r]))}[a]();Object.assign(e,m),location.href!==e.href&&location.assign(e.href)})();})();
