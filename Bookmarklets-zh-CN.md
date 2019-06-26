<h1 align="center">书签小程序</h1>

<div align="center">

![](https://img.shields.io/badge/%E6%80%BB%E6%95%B0-2-blue.svg?style=for-the-badge)

[English](README.md) | 简体中文

</div>

要保存书签小程序，将代码保存成书签/拖动到书签栏。

要使用书签小程序，打开相应书签即可。

## 网站时光机

在[互联网档案馆](https://archive.org/web/)查看当前网页的存档。

```js
javascript:window.open(`https://web.archive.org/web/${new Date().toISOString().replace(/-|T|:/g, '').substring(0, 14)}/${location.href}`); void 0
```

## 移除图片 referrer

绕过服务器的 referrer 检查。你可以在[这里](https://luyilin.github.io/Aoba/)测试。

```js
javascript:document.querySelectorAll('img').forEach(el => {el.referrerPolicy = 'no-referrer'; el.src = el.src}); void 0
```
