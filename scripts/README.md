# User Scripts

English | [简体中文](README-zh-CN.md)

---

A user script manager must be installed on your browser.

We recommend Tampermonkey for [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) or [Firefox](https://addons.mozilla.org/firefox/addon/tampermonkey/), as on other user script manager the scripts may not work.

## [NCU Net](ncu-net.user.js?raw=true)

**NCU Campus Network Access Authentication System** Helper. Works on `NCU-5G/NCU-2.4G` & `NCUWLAN`.

*Also check out [NCU Net](https://github.com/kidonng/ncu-net) CLI.*

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

Display a GitHub logo in the lower right linked to GitHub Pages' source repository. e.g. [1](https://edwardtufte.github.io/) [2](https://edwardtufte.github.io/tufte-css/)

## [GitHub Precise Counters](github-precise-counters.user.js?raw=true)

![Screenshot](../screenshots/gitHub-precise-counters.user.gif)

Show precise watch/star/fork counts on hover. Compatible with [Refined GitHub](https://github.com/sindresorhus/refined-github)'s `hide-watch-and-fork-count` feature.

## [Auto fix sinaimg](auto-fix-sinaimg.user.js?raw=true)

Auto fix loading of `sinaimg.cn` images by using `no-referrer` referrer policy.

*Also check out [Remove image's referrer](../Bookmarklets.md#user-content-remove-images-referrer).*

## Redirects

- [Tieba](tieba-redirect.user.js?raw=true): Redirect all variants of Tieba domain to `tieba.baidu.com`, and enable viewing sub-replies without login.
- [Zhihu](zhihu-redirect.user.js?raw=true): Redirect all variants of Zhihu domain to `www.zhihu.com`.
- [Wikiwand](wikiwand.user.js?raw=true): Redirect Wikipedia to Wikiwand. Can replace Wikiwand browser extension.
- [Origin Finder](origin-finder.user.js?raw=true): Redirect to resources' origin version, such as the original size version of images.
