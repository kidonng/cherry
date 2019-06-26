<h1 align="center">User Scripts</h1>

<div align="center">

![](https://img.shields.io/badge/ORIGINAL-4-blue.svg?style=for-the-badge)
![](https://img.shields.io/badge/MODIFIED-2-orange.svg?style=for-the-badge)

English | [简体中文](README-zh-CN.md)

</div>

A user script manager must be installed on your browser.

We recommend Tampermonkey for [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) or [Firefox](https://addons.mozilla.org/firefox/addon/tampermonkey/), as on other user script manager the scripts may not work.

## Original

### [NCU Net](https://github.com/kidonng/cherry/raw/master/scripts/ncu-net.user.js)

*NCU Campus Network Access Authentication System* Helper. Works on `NCU-5G/NCU-2.4G` & `NCUWLAN`.

> There is a [standalone version](https://github.com/kidonng/ncu-net) as well.

#### Features

- Jump- & popup-free login/logout
- Remember username and password
- Auto (re)connect
- Connection logs

#### Usage

1. Connect to the network.
2. Open the authentication page ([NCU-5G/NCU-2.4G](http://222.204.3.154/) or [NCUWLAN](http://aaa.ncu.edu.cn/)) and enter your username & password.
3. Click the login/logout button and watch the magic happen!
4. You can [config language & more](./ncu-net.user.js#L12-L31) in the script.

### [Tieba Redirect](https://github.com/kidonng/cherry/raw/master/scripts/tieba-redirect.user.js)

Redirect all variants of Tieba site (including mobile version) to `tieba.baidu.com`. Also enable you to see sub-replies without login.

### [Pages Source](https://github.com/kidonng/cherry/raw/master/scripts/pages-source.user.js)

Display a GitHub logo in the lower right linked to GitHub Pages' source repository. e.g. [a](https://edwardtufte.github.io/) [b](https://edwardtufte.github.io/tufte-css/)

### [Wikiwand](https://github.com/kidonng/cherry/raw/master/scripts/wikiwand.user.js)

Replace Wikiwand browser extension.

## Modified

### [Smooth Scroll](https://github.com/kidonng/cherry/raw/master/scripts/smoothscroll.user.js)

Replace Smooth Scroll browser extension.

### [View Image](https://github.com/kidonng/cherry/raw/master/scripts/viewimage.user.js)

Based on [Userscript Version 2.0.1](https://gist.github.com/bijij/58cc8cfc859331e4cf80210528a7b255/b2def8f34acc55906402bfed6922b20fa7c45607) & synced with [Chrome Extension](https://github.com/bijij/ViewImage/blob/5c6269a9f56f22fdc4ce3c93449fb4d163923927/js/content-script.js).
