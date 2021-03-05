# 用户脚本

[English](README.md) | 简体中文

---

你的浏览器需要安装一个用户脚本管理器。

推荐安装 Tampermonkey ([Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) 或 [Firefox](https://addons.mozilla.org/firefox/addon/tampermonkey/))，因为在其他用户脚本管理器上脚本可能失效。

## [YouTube 截图](youtube-screenshot.user.js?raw=true)

![截图](../screenshots/youtube-screenshot.png)

向 YouTube 添加截图按钮（快捷键： <kbd>s</kbd>）。

- 点击以保存。文件名会使用视频标题和时间戳
- 使用右键菜单进行复制等
- 按 <kbd>Esc</kbd> 取消

**注** 由于实现限制，截图的颜色可能与视频不一致。

## [YouTube 迷你播放器](youtube-mini-player.user.js?raw=true)

![截图](../screenshots/youtube-mini-player.png)

为 YouTube 增加类似 Bilibili 的悬浮迷你播放器，用于便捷地阅读评论等。

- 拖拽以移动
- 已知问题：
  - 无法调整大小
  - 无法在剧场模式和全屏下使用
  - 部分控件（进度条、音量等） 不跟随光标。这是实现限制导致的。

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

![截图](../screenshots/github-precise-counters.gif)

鼠标悬浮时显示精确的 watch/star/fork 数据。与 [Refined GitHub](https://github.com/sindresorhus/refined-github) 的 `hide-watch-and-fork-count` 功能兼容。

## [GitHub 个人 README 链接](github-profile-readme-link.user.js?raw=true)

使个人 README 的顶部链接指向 README 而非仓库。

## [GitHub 主题切换](generated/github-theme-switch.user.js?raw=true)

![截图](https://user-images.githubusercontent.com/44045911/101625949-2a3ae280-3a57-11eb-9298-d1dde71806fc.png)

在 GitHub 的用户下拉菜单中添加主题配置切换。

另提供[书签](generated/github-theme-switch.user-bookmarklet.js?raw=true)版本。

## [重新放置 Octotree 书签图标](generated/reposition-octotree-bookmark-icon.user.js?raw=true)

启用前：

![启用前的截图](https://user-images.githubusercontent.com/44045911/89754890-12d30380-db10-11ea-9534-f2e704c94012.png)

启用后

![启用后的截图](https://user-images.githubusercontent.com/44045911/89754891-14043080-db10-11ea-86ed-b2316fed36cf.png)

## [自动修复 sinaimg](auto-fix-sinaimg.user.js?raw=true)

使用 `no-referrer` referrer 政策自动修复 `sinaimg.cn` 图片加载。

[测试页面](https://luyilin.github.io/Aoba/)

## 重定向

- [Wikiwand](wikiwand.user.js?raw=true)：重定向维基百科到 Wikiwand。可替代 Wikiwand 浏览器扩展
- [Origin Finder](origin-finder.user.js?raw=true)：重定向至资源的原始版本，例如原始尺寸的图像
- [HTTPS Everywhere](https-everywhere.user.js?raw=true)：重定向至 HTTPS 版本（如果网站支持）
- [Back to Notion](back-to-notion.user.js?raw=true): 重定向自定义 Notion 域名到 `www.notion.so`。[测试](https://anotioneer.com/)

  **注意** 该脚本仅检查 HTTPS URL 是否匹配 `/[0-9a-f]{32}$/`。可能会有误报。
