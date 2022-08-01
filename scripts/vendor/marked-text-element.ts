// From https://github.githubassets.com/assets/app/assets/modules/github/marked-text-element.ts

function defaultPositions(query: string, text: string): number[] {
  const positions: number[] = []
  let lastIndex = 0
  for (let i = 0; i < query.length; i++) {
    const char = query[i]
    const index = text.indexOf(char, lastIndex)
    if (index === -1) return positions
    lastIndex = index + 1
    positions.push(index)
  }
  return positions
}

class MarkedTextElement extends HTMLElement {
  #lastText = ''
  #lastQuery = ''
  // @ts-expect-error
  #observer: MutationObserver
  // @ts-expect-error
  #timer: number
  positions?: typeof defaultPositions

  static observedAttributes = ['query', 'data-owner-input']

  get query(): string {
    if (this.ownerInput) return this.ownerInput.value
    return this.getAttribute('query') || ''
  }

  set query(query: string) {
    this.setAttribute('query', query)
  }

  get ownerInput(): HTMLInputElement | null {
    const el = this.ownerDocument.getElementById(this.getAttribute('data-owner-input') || '')
    return el instanceof HTMLInputElement ? el : null
  }

  connectedCallback(): void {
    this.handleEvent()
    this.ownerInput?.addEventListener('input', this)
    this.#observer = new MutationObserver(() => this.handleEvent())
  }

  handleEvent(): void {
    if (this.#timer) cancelAnimationFrame(this.#timer)
    this.#timer = requestAnimationFrame(() => this.mark())
  }

  disconnectedCallback(): void {
    this.ownerInput?.removeEventListener('input', this)
    this.#observer.disconnect()
  }

  mark() {
    const text = this.textContent || ''
    const query = this.query
    if (text === this.#lastText && query === this.#lastQuery) return
    this.#lastText = text
    this.#lastQuery = query
    this.#observer.disconnect()
    let lastPosition = 0
    const frag = document.createDocumentFragment()
    for (const i of (this.positions || defaultPositions)(query, text)) {
      if (Number(i) !== i || i < lastPosition || i > text.length) continue
      const slice = text.slice(lastPosition, i)
      if (slice !== '') {
        frag.appendChild(document.createTextNode(text.slice(lastPosition, i)))
      }
      lastPosition = i + 1
      const mark = document.createElement('mark')
      mark.textContent = text[i]
      frag.appendChild(mark)
    }
    frag.appendChild(document.createTextNode(text.slice(lastPosition)))
    this.replaceChildren(frag)
    this.#observer.observe(this, {
      attributes: true,
      childList: true,
      subtree: true
    })
  }
}

declare global {
  interface Window {
    MarkedTextElement: typeof MarkedTextElement
  }
}

export default MarkedTextElement

if (!window.customElements.get('marked-text')) {
  window.MarkedTextElement = MarkedTextElement
  window.customElements.define('marked-text', MarkedTextElement)
}
