# 用户脚本

[English](README.md) | 简体中文

---

你的浏览器需要安装一个用户脚本管理器。

推荐安装 Tampermonkey ([Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) 或 [Firefox](https://addons.mozilla.org/firefox/addon/tampermonkey/))，因为在其他用户脚本管理器上脚本可能失效。

## [NCU Net](ncu-net.user.js?raw=true)

**南昌大学校园网络接入认证系统**助手。支持 `NCU-5G/NCU-2.4G` 和 `NCUWLAN`。

> 同时也有[独立版本](https://github.com/kidonng/ncu-net/blob/master/README-zh-CN.md)。

### 特点

- 无跳转/弹窗进行登录/注销
- 记忆用户名和密码
- 自动连接和重连
- 连接日志

### 使用方法

1. 连接网络。
2. 打开认证页面 ([NCU-5G/NCU-2.4G](http://222.204.3.154/) or [NCUWLAN](http://aaa.ncu.edu.cn/)) 并输入你的用户名和密码。
3. 点击登录/注销按钮并见证奇迹！
4. 你可以在脚本中设置[语言和更多](./ncu-net.user.js#L12-L31)。

## [Pages 源码](pages-source.user.js?raw=true)

在右下角显示一个链接到 GitHub Pages 源码仓库的 GitHub logo。示例 [a](https://edwardtufte.github.io/) [b](https://edwardtufte.github.io/tufte-css/)

## 重定向

- [贴吧](tieba-redirect.user.js?raw=true)：重定向贴吧的各种域名变体到 `tieba.baidu.com`，并且无需登录即可查看楼中楼。
- [知乎](zhihu-redirect.user.js?raw=true)：重定向知乎的各种域名变体到 `www.zhihu.com`。
- [Wikiwand](wikiwand.user.js?raw=true)：重定向维基百科到 Wikiwand。可替代 Wikiwand 浏览器扩展。
- [Origin Finder](origin-finder.user.js?raw=true)：重定向至资源的原始版本，例如原始尺寸的图像。
