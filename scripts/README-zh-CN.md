# 用户脚本

[English](README.md) | 简体中文

---

你的浏览器需要安装一个用户脚本管理器。

推荐安装 Tampermonkey ([Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) 或 [Firefox](https://addons.mozilla.org/firefox/addon/tampermonkey/))，因为在其他用户脚本管理器上脚本可能失效。

## [NCU Net](ncu-net.user.js?raw=true)

**南昌大学校园网络接入认证系统**助手。支持 `NCU-5G/NCU-2.4G` 和 `NCUWLAN`。

_另见 [NCU Net](https://github.com/kidonng/ncu-net/blob/master/README-zh-CN.md) 命令行程序。_

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

在右下角显示一个链接到 GitHub Pages 源码仓库的 GitHub logo。示例：[1](https://edwardtufte.github.io/) [2](https://edwardtufte.github.io/tufte-css/)

## [GitHub 精确数据](github-precise-counters.user.js?raw=true)

![截图](../screenshots/gitHub-precise-counters.user.gif)

鼠标悬浮时显示精确的 watch/star/fork 数据。与 [Refined GitHub](https://github.com/sindresorhus/refined-github) 的 `hide-watch-and-fork-count` 功能兼容。

## [GitHub 个人 README 链接](github-profile-readme-link.user.js?raw=true)

使个人 README 的顶部链接指向 README 而非仓库。

## [重新放置 Octotree 书签图标](generated/reposition-octotree-bookmark-icon.user.js?raw=true)

启用前：

![启用前的截图](https://user-images.githubusercontent.com/44045911/89754890-12d30380-db10-11ea-9534-f2e704c94012.png)

启用后

![启用后的截图](https://user-images.githubusercontent.com/44045911/89754891-14043080-db10-11ea-86ed-b2316fed36cf.png)

## [自动修复 sinaimg](auto-fix-sinaimg.user.js?raw=true)

使用 `no-referrer` referrer 政策自动修复 `sinaimg.cn` 图片加载。

_另见 [移除图片 referrer](../Bookmarklets.md#user-content-remove-images-referrer)。_

## 重定向

- [贴吧](tieba-redirect.user.js?raw=true)：重定向贴吧的各种域名变体到 `tieba.baidu.com`，并且无需登录即可查看楼中楼。
- [知乎](zhihu-redirect.user.js?raw=true)：重定向知乎的各种域名变体到 `www.zhihu.com`。
- [Wikiwand](wikiwand.user.js?raw=true)：重定向维基百科到 Wikiwand。可替代 Wikiwand 浏览器扩展。
- [Origin Finder](origin-finder.user.js?raw=true)：重定向至资源的原始版本，例如原始尺寸的图像。
