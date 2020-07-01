# Bookmarklets

[Bookmarklets](https://en.wikipedia.org/wiki/Bookmarklet) are like bookmarks, except the link is JavaScript code.

To save a bookmarklet, save the code as a bookmark or drag the code into bookmark bar.

## Archive.today

View current page's archives on [Archive.today](https://archive.today/).

```js
javascript:void(window.open(`https://archive.today/${location.href}`))
```

## Remove image's referrer

Bypass image referrer check (e.g. Weibo). [Test page](https://luyilin.github.io/Aoba/)

```js
javascript:void(document.querySelectorAll('img').forEach(el => {el.referrerPolicy = 'no-referrer'; el.src = el.src}))
```

*Also check out [Auto fix sinaimg](scripts/README.md#user-content-auto-fix-sinaimg)*.

## Design mode

Toggle `contenteditable` for all elements.

```js
javascript:document.designMode = document.designMode === 'off' ? 'on' : 'off'; void 0
```
