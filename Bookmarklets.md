<h1 align="center">Bookmarklets</h1>

<div align="center">

![](https://img.shields.io/badge/COUNT-2-blue.svg?style=for-the-badge)

English | [简体中文](README-zh-CN.md)

</div>

To save a bookmarklet, save the code as a bookmark/drag the code into browser's bookmarks bar.

To use a bookmarklet, just open the bookmark.

## Wayback Machine

View current pages's archive on [Internet Archive](https://archive.org/web/).

```js
javascript:window.open(`https://web.archive.org/web/${new Date().toISOString().replace(/-|T|:/g, '').substring(0, 14)}/${location.href}`); void 0
```

## Remove image's referrer

Bypass server's referrer check. You can test it [here](https://luyilin.github.io/Aoba/).

```js
javascript:document.querySelectorAll('img').forEach(el => {el.referrerPolicy = 'no-referrer'; el.src = el.src}); void 0
```
