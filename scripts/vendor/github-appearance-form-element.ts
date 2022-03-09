// Modified from https://github.githubassets.com/assets/app/assets/modules/github/settings/appearance-form-element.ts

import type {} from '../lib/@types/web.ts'
import {ColorMode, getClientTheme, getPreferredColorMode, setClientMode, setClientTheme} from './github-color-modes.ts'
import {controller, target, targets} from '../lib/@github/catalyst.ts'

@controller
export class AppearanceFormElement extends HTMLElement {
  // @ts-expect-error
  @target saveMessage: HTMLElement
  // @ts-expect-error
  @targets modePanels: HTMLElement[]

  modeSelectChange(event: Event) {
    const select = event.currentTarget as HTMLSelectElement
    const modeName = select.value
    const form = this.activatePanel(modeName)!
    this.activateForm(form)
  }

  activatePanel(modeName: string) {
    let activeForm
    for (const panel of this.modePanels) {
      const hidden = this.modePanels.length > 1 ? panel.getAttribute('data-mode-panel') !== modeName : false
      panel.hidden = hidden
      if (!hidden) {
        const form = panel.querySelector('form') as HTMLFormElement
        if (form) {
          activeForm = form
        }
      }
    }
    return activeForm
  }

  activateForm(form: HTMLFormElement) {
    const selectedInputs = form.querySelectorAll<HTMLInputElement>('input[type="radio"]:checked')
    if (selectedInputs.length === 0) {
      const currentMode = getPreferredColorMode()
      const userTheme = getClientTheme(currentMode as ColorMode)
      const input = form.querySelector<HTMLInputElement>(`input[value=${userTheme}]`)
      if (input) {
        input.checked = true
        this.changeTheme(input)
      }
    } else {
      for (const selectedInput of selectedInputs) {
        this.changeTheme(selectedInput)
      }
    }
    form.dispatchEvent(new Event('submit'))
  }

  themeClicked(event: Event) {
    const selectedInput = event.currentTarget as HTMLInputElement
    this.changeTheme(selectedInput)
  }

  changeTheme(input: HTMLInputElement) {
    this.statusReset()
    const theme = input.value
    const themeType = input.getAttribute('data-type')
    const mode = input.getAttribute('data-mode')

    if (theme && themeType && mode) {
      setClientMode(mode as ColorMode)
      setClientTheme(theme, themeType as ColorMode)
    }
  }

  async saveTheme(event: Event) {
    event.preventDefault()
    this.loading()

    const form = event.currentTarget as HTMLFormElement
    const formData = new FormData(form)
    const response = await fetch(form.action, {
      method: form.method,
      body: formData,
      headers: {'X-Requested-With': 'XMLHttpRequest'}
    })

    if (response.status === 200) {
      this.saved()
    } else {
      this.errored()
    }
  }

  statusReset() {
    this.saveMessage.classList.remove('status-indicator-success', 'status-indicator-loading', 'status-indicator-failed')
  }

  loading() {
    this.statusReset()
    this.saveMessage.classList.add('status-indicator-loading')
  }

  saved() {
    this.statusReset()
    this.saveMessage.classList.add('status-indicator-success')
  }

  errored() {
    this.statusReset()
    this.saveMessage.classList.add('status-indicator-failed')
  }
}
