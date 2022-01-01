# User Scripts

English | [简体中文](README-zh-CN.md)

A user script manager such as [Violentmonkey](https://violentmonkey.github.io/get-it/) is required to use user scripts.

If you like my GitHub user scripts, be sure to check out [Refined GitHub](https://github.com/refined-github/refined-github).

---

## [YouTube Screenshot](youtube-screenshot.user.js?raw=true)

![Screenshot](../screenshots/youtube-screenshot.png)

Add a screenshot button to YouTube (shortcut: <kbd>s</kbd>).

-   Click to save. Video title and timestamp will be used as file name
-   Use context menu to copy and more
-   Press <kbd>Esc</kbd> to cancel

**NOTE** Due to implementation limits, the screenshot's color may not be the same as the video's.

## [YouTube Mini Player](youtube-mini-player.user.js?raw=true)

![Screenshot](../screenshots/youtube-mini-player.png)

Floating YouTube mini player like Bilibili, for conveniently reading comments and more.

-   Drag to move
-   Known issues:
    -   Can't resize
    -   Doesn't work in Theater mode and Full screen
    -   Some controls (progress bar, volume, etc.) doesn't follow cursor. This is due to implementation limits.

## [Notion Localization](https://kidonng.github.io/cherry/notion-localization.user.js)

Enable Notion's native localization for more languages.

Notes:

-   You must be logged in for it to work
-   The script may not work if Notion's code happen to run before it. Open Notion with [`https://www.notion.so`](https://www.notion.so) or keep refreshing if the issue happens.

![Screenshot](../screenshots/notion-localization.png)

---

Usage for macOS app: run the following command in your terminal

```sh
curl https://kidonng.github.io/cherry/notion-localization.user.js >> /Applications/Notion.app/Contents/Resources/app/renderer/preload.js
```

## [NCU Net](ncu-net.user.js?raw=true)

A campus network helper for Nanchang University. Supports `NCU-5G/NCU-2.4G` & `NCUWLAN`.

_Also check out [NCU Net](https://github.com/kidonng/ncu-net) CLI._

### Features

-   Jump-free login
-   Remember username & password
-   Auto reconnect
-   Connection logs

**NOTE** You can [configure timeout and retry interval](ncu-net.user.js#L14-L20) in the script.

## [GitHub Hovercards](https://kidonng.github.io/cherry/github-hovercards.user.js)

_Implementation of [refined-github#5052](https://github.com/refined-github/refined-github/issues/5052)_

Enable native hovercards for most GitHub links of the following types:

-   Repository file trees
-   Conversations (issues & pull requests)
-   Commits
-   Profiles (users & organizations)

## [GitHub hide public badge](https://kidonng.github.io/cherry/github-hide-public-badge.user.js)

_Ported from [refined-github#4770](https://github.com/refined-github/refined-github/pull/4770)_

Hides "Public" repository badge or removes "Public" prefix.

![Screenshot](https://user-images.githubusercontent.com/44045911/132693134-ffa6a0fa-5366-447f-8e49-deda12884bd7.png)

## [GitHub conversation list avatars](https://kidonng.github.io/cherry/github-conversation-list-avatars.user.js)

_Implementation of [refined-github#4906](https://github.com/refined-github/refined-github/issues/4906#issuecomment-940602726)_

Add avatars in GitHub's conversation list.

![Screenshot](https://user-images.githubusercontent.com/44045911/136884098-5bc4a22b-2891-47cd-bcbf-07fdb84d8a1c.png)

## [~~GitHub icon tweaks~~](https://kidonng.github.io/cherry/github-icon-tweaks.user.js)

**⚠️ No longer maintained. GitHub has implemented most changes.**

_Implementation of [refined-github#5007](https://github.com/refined-github/refined-github/issues/5007)_

Tweak certain GitHub icons' color and style.

| Before                                                  | After                                                 |
| ------------------------------------------------------- | ----------------------------------------------------- |
| ![Before](../screenshots/github-icon-tweaks-before.png) | ![After](../screenshots/github-icon-tweaks-after.png) |

## [Pages Source](https://kidonng.github.io/cherry/pages-source.user.js)

Display a logo in the bottom right corner linked to the source repository when visiting a site hosted on the following Git hosting services:

-   [GitHub Pages](https://pages.github.com/)
-   [GitLab Pages](https://docs.gitlab.com/ee/user/project/pages/)
-   [Gitee Pages](https://gitee.com/help/articles/4136)
-   [SourceForge Project Web](https://sourceforge.net/p/forge/documentation/Project%20Web%20Services/)

## [Camo Detective](camo-detective.user.js?raw=true)

_Implementation of [refined-github#4132](https://github.com/refined-github/refined-github/issues/4132#issuecomment-904022040)_

Replace `camo.githubusercontent.com` image links on GitHub with image's `data-canonical-src` attribute.

## [Clean GitHub Subscriptions](clean-github-subscriptions.user.js?raw=true)

Automatically unsubscribe from all closed/merged issues/PR.

Just install the script and head to [Subscriptions](https://github.com/notifications/subscriptions).

**NOTE**

-   **There is no way for the script to figure out what thread you want to keep subscribing to, proceed with caution.** Use the "Reason" dropdown if you only want to clean selective subscriptions.
-   If the script becomes dumb and only unsubscribe one thread at a time, then manually turn to next page first.
-   If the script stops working, you may have an server error or hit a rate limit. Try again later.

## [GitHub Precise Counters](github-precise-counters.user.js?raw=true)

_Implementation of [refined-github#3382](https://github.com/refined-github/refined-github/issues/3382)_

![Screenshot](../screenshots/github-precise-counters.gif)

Show precise watch/star/fork counts on hover. Compatible with [Refined GitHub](https://github.com/refined-github/refined-github)'s `hide-watch-and-fork-count` feature.

## [GitHub profile README link](github-profile-readme-link.user.js?raw=true)

_Implementation of [refined-github#3426](https://github.com/refined-github/refined-github/issues/3426#issuecomment-671077874)_

Make profile README's header link to the README instead of the repository.

## [~~GitHub theme switch~~](https://kidonng.github.io/cherry/github-theme-switch.user.js)

**⚠️ No longer maintained. Use [GitHub's Command palette](https://github.com/refined-github/refined-github/issues/3802#issuecomment-966471452) instead.**

_Ported from [refined-github#3804](https://github.com/refined-github/refined-github/pull/3804)._

![Screenshot](./../screenshots/github-theme-switch.png)

Add theme preferences dropdown to GitHub header.

Also available as a [bookmarklet](https://kidonng.github.io/cherry/github-theme-switch.bookmarklet.js).

## [GitHub Star history](github-star-history.user.js?raw=true)

_Implementation of [refined-github#4097](https://github.com/refined-github/refined-github/issues/4097)_

Adds a button to Stargazers page to view star history on https://star-history.t9t.io/.

## [Reposition Octotree bookmark icon](https://kidonng.github.io/cherry/reposition-octotree-bookmark-icon.user.js)

_Implementation of [octotree#992](https://github.com/ovity/octotree/issues/992)_

Before:

![Screenshot of before](https://user-images.githubusercontent.com/44045911/89754890-12d30380-db10-11ea-9534-f2e704c94012.png)

After:

![Screenshot of after](https://user-images.githubusercontent.com/44045911/89754891-14043080-db10-11ea-86ed-b2316fed36cf.png)

## [Telegram Raw Media](https://kidonng.github.io/cherry/telegram-raw-media.user.js)

Show media on `t.me` as regular elements. Make context menu, drag and drop, etc. work on them.

## [Auto fix sinaimg](auto-fix-sinaimg.user.js?raw=true)

Auto fix loading of `sinaimg.cn` images by using `no-referrer` referrer policy.

[Test Page](https://luyilin.github.io/Aoba/)

## Redirects

-   [Wikiwand](wikiwand.user.js?raw=true): Redirect Wikipedia to Wikiwand. Can replace Wikiwand browser extension.
-   [Origin Finder](https://kidonng.github.io/cherry/origin-finder.user.js): Redirect to resources' origin version, such as the original size version of images.
-   [HTTPS Everywhere](https-everywhere.user.js?raw=true): Redirect to HTTPS version if available
-   [Google Bang](google-bang.user.js?raw=true): Add support for [!Bang Search Shortcuts](https://duckduckgo.com/bang) to Google
