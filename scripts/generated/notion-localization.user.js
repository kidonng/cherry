// ==UserScript==
// @name         Notion Localization
// @version      4
// @description  Enable Notion's native localization for more languages
// @author       kidonng
// @namespace    https://github.com/kidonng/cherry
// @match        https://www.notion.so/*
// @run-at       document-start
// ==/UserScript==
(()=>{var s=t=>{if(t==null)return new DocumentFragment;let e=document.createElement("template");return e.innerHTML=t,e.content};s.one=t=>{var e;return(e=s(t).firstElementChild)!==null&&e!==void 0?e:void 0};var l=s;(async()=>{let t=localStorage.getItem("ajs_user_traits");if(!t)return;let{app_version:e,locale:o,is_desktop:m}=JSON.parse(t),a=`messages-${e}-${o}`,c=localStorage.getItem(a);if(!c)try{let n=await fetch("/api/v3/getAssetsJsonV2",{method:"POST",headers:{"content-type":"application/json","notion-client-version":e},body:JSON.stringify({hash:""})}),{localeHtml:r}=await n.json();if(!(o in r))return;let d=r[o],u=await(await fetch(d)).text(),p=l(u),{textContent:f}=p.querySelector("#messages");localStorage.setItem(a,f),alert(`[Notion Localization]
${o} messages updated successfully \u2728`),location.pathname="/"}catch(n){alert(`[Notion Localization]
${o} messages failed to update \u{1F622}`)}finally{return}let i=()=>{let n=document.createElement("script");n.id="messages",n.type="application/json",n.dataset.locale="en-US",n.innerHTML=c,document.documentElement.prepend(n)};m?document.addEventListener("readystatechange",i,{once:!0}):i()})();})();
