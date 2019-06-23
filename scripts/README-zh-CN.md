# 用户脚本

![](https://img.shields.io/badge/%E5%8E%9F%E5%88%9B-4-blue.svg?style=for-the-badge)
![](https://img.shields.io/badge/%E6%94%B9%E7%89%88-2-orange.svg?style=for-the-badge)

[English](README.md) | 简体中文

你的浏览器需要安装一个用户脚本管理器。

推荐安装 Tampermonkey ([Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) 或 [Firefox](https://addons.mozilla.org/firefox/addon/tampermonkey/))，因为在其他用户脚本管理器上脚本可能失效。

## 原创

### [NCU Net](https://github.com/kidonng/cherry/raw/master/scripts/ncu-net.user.js)

**南昌大学校园网络接入认证系统**助手。支持 `NCU-5G/NCU-2.4G` 和 `NCUWLAN`。

> 同时也有[独立版本](https://github.com/kidonng/ncu-net/blob/master/README-zh-CN.md)。

#### 特点

- 无跳转/弹窗进行登录/注销
- 记忆用户名和密码
- 自动连接和重连
- 连接日志

#### 使用方法

1. 连接网络。
2. 打开认证页面 ([NCU-5G/NCU-2.4G](http://222.204.3.154/) or [NCUWLAN](http://aaa.ncu.edu.cn/)) 并输入你的用户名和密码。
3. 点击登录/注销按钮并见证奇迹！
4. 你可以在脚本中设置[语言和更多](./ncu-net.user.js#L12-L31)。

### [Tieba Redirect](https://github.com/kidonng/cherry/raw/master/scripts/tieba-redirect.user.js)

将贴吧的其他版本 (包括移动版) 重定向至 `tieba.baidu.com`。同时使你无需登录即可查看楼中楼。

### [Pages Source](https://github.com/kidonng/cherry/raw/master/scripts/pages-source.user.js)

在右下角显示一个链接到 GitHub Pages 源码仓库的 GitHub logo。示例 [a](https://edwardtufte.github.io/) [b](https://edwardtufte.github.io/tufte-css/)

### [Wikiwand](https://github.com/kidonng/cherry/raw/master/scripts/wikiwand.user.js)

替代 Wikiwand 浏览器扩展。

## 改版

### [Smooth Scroll](https://github.com/kidonng/cherry/raw/master/scripts/smoothscroll.user.js)

用 [Smooth Scroll for Websites](https://github.com/gblazex/smoothscroll-for-websites) 替代 Smooth Scroll 浏览器扩展。

### [View Image](https://github.com/kidonng/cherry/raw/master/scripts/viewimage.user.js)

基于[用户脚本 2.0.1 版](https://gist.github.com/bijij/58cc8cfc859331e4cf80210528a7b255/b2def8f34acc55906402bfed6922b20fa7c45607)并与 [Chrome 扩展](https://github.com/bijij/ViewImage/blob/5c6269a9f56f22fdc4ce3c93449fb4d163923927/js/content-script.js)同步。
