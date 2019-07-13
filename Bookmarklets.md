<h1 align="center">Bookmarklets</h1>

<div align="center">

![Count: 3](https://img.shields.io/badge/COUNT-3-blue.svg?style=for-the-badge)

</div>

To save a bookmarklet, save the code as a bookmark/drag the code into browser's bookmarks bar.

To use a bookmarklet, just open the bookmark.

## Wayback Machine (Internet Archive)

View current page's archive on [Internet Archive](https://archive.org/web/).

```js
javascript:window.open(`https://web.archive.org/web/${new Date().toISOString().replace(/-|T|:/g, '').substring(0, 14)}/${location.href}`); void 0
```

## Archive.today/Archive.is

View current page's archive on [Archive.today/Archive.is](https://archive.fo/).

```js
javascript:window.open(`https://archive.fo/${location.href}`); void 0
```

## Remove image's referrer

Bypass image referrer check (e.g. Weibo). Test it [here](https://luyilin.github.io/Aoba/).

```js
javascript:document.querySelectorAll('img').forEach(el => {el.referrerPolicy = 'no-referrer'; el.src = el.src}); void 0
```
