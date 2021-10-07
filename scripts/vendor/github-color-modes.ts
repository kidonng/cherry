// Modified from https://github.githubassets.com/assets/app/assets/modules/github/color-modes.ts

export type ColorMode = 'light' | 'dark'
export type ColorModeWithAuto = ColorMode | 'auto'

export function getPreferredColorMode(): ColorMode | undefined {
  if (prefersColorScheme('dark')) {
    return 'dark'
  } else if (prefersColorScheme('light')) {
    return 'light'
  }

  return undefined
}

function prefersColorScheme(scheme: ColorMode): boolean {
  return window.matchMedia && window.matchMedia(`(prefers-color-scheme: ${scheme})`).matches
}

/**
 * Set the `data-color-mode` attribute on the html element of the page.
 */
export function setClientMode(mode: ColorModeWithAuto) {
  const rootEl = document.querySelector('html[data-color-mode]')
  if (!rootEl) {
    // Color modes are not active on this page
    return
  }
  rootEl.setAttribute('data-color-mode', mode)
}

export function setClientTheme(theme: string, type: ColorMode) {
  const rootEl = document.querySelector('html[data-color-mode]')
  if (!rootEl) {
    // Color modes are not active on this page
    return
  }
  const stylesheet = document.querySelector<HTMLLinkElement>(`[data-color-theme="${theme}"]`)
  if (stylesheet && !stylesheet.href) stylesheet.href = stylesheet.dataset['href']!
  rootEl.setAttribute(`data-${type}-theme`, theme)
}

/**
 * Returns the user theme as defined by the `data-light-theme` or
 * `data-dark-theme` attribute.
 */
export function getClientTheme(type: ColorMode) {
  const rootEl = document.querySelector('html[data-color-mode]')
  if (!rootEl) {
    // Color modes are not active on this page
    return
  }
  return rootEl.getAttribute(`data-${type}-theme`)
}
