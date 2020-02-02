# Bookmarklets

[Bookmarklets](https://en.wikipedia.org/wiki/Bookmarklet) are like bookmarks, except the link is JavaScript code.

To save a bookmarklet, save the code as a bookmark or drag the code into bookmark bar.

## Wayback Machine

View current page's archives on [Wayback Machine](https://web.archive.org/).

```js
javascript:window.open(`https://web.archive.org/${location.href}`); void 0
```

## Archive.today

View current page's archives on [Archive.today](https://archive.today/).

```js
javascript:window.open(`https://archive.today/${location.href}`); void 0
```

## Remove image's referrer

Bypass image referrer check (e.g. Weibo). [Test page](https://luyilin.github.io/Aoba/)

```js
javascript:document.querySelectorAll('img').forEach(el => {el.referrerPolicy = 'no-referrer'; el.src = el.src}); void 0
```
