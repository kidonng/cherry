# 书签小程序

![](https://img.shields.io/badge/%E6%80%BB%E6%95%B0-2-blue.svg?style=for-the-badge)

[English](README.md) | 简体中文

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
