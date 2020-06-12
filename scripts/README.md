# User Scripts

English | [简体中文](README-zh-CN.md)

---

A user script manager must be installed on your browser.

We recommend Tampermonkey for [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) or [Firefox](https://addons.mozilla.org/firefox/addon/tampermonkey/), as on other user script manager the scripts may not work.

## [NCU Net](ncu-net.user.js?raw=true)

**NCU Campus Network Access Authentication System** Helper. Works on `NCU-5G/NCU-2.4G` & `NCUWLAN`.

> There is a [standalone version](https://github.com/kidonng/ncu-net) as well.

### Features

- Jump- & popup-free login/logout
- Remember username and password
- Auto (re)connect
- Connection logs

### Usage

1. Connect to the network.
2. Open the authentication page ([NCU-5G/NCU-2.4G](http://222.204.3.154/) or [NCUWLAN](http://aaa.ncu.edu.cn/)) and enter your username & password.
3. Click the login/logout button and watch the magic happen!
4. You can [config language & more](./ncu-net.user.js#L12-L31) in the script.

## [Pages Source](pages-source.user.js?raw=true)

Display a GitHub logo in the lower right linked to GitHub Pages' source repository. e.g. [a](https://edwardtufte.github.io/) [b](https://edwardtufte.github.io/tufte-css/)

## Redirects

- [Tieba](tieba-redirect.user.js?raw=true): Redirect all variants of Tieba domain to `tieba.baidu.com`, and enable viewing sub-replies without login.
- [Zhihu](zhihu-redirect.user.js?raw=true): Redirect all variants of Zhihu domain to `www.zhihu.com`.
- [Wikiwand](wikiwand.user.js?raw=true): Redirect Wikipedia to Wikiwand. Can replace Wikiwand browser extension.
- [Origin Finder](origin-finder.user.js?raw=true): Redirect to resources' origin version, such as the original size version of images.
