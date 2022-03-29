// From https://github.githubassets.com/assets/app/assets/modules/github/virtual-list-element.ts

/**
 * A list component that keeps only visible items in DOM.
 * The items that do not fit in the viewport will be detached from DOM and reattached on scroll.
 *
 * Important:
 * - Virtual List will use the first item in the dataset to calculate assumed visual height for all items
 * - There is no error correction for items having different visual height
 * - It extends Set to be compatible with virtual-filter-input-element - to be "controllable" from the outside
 */
 class VirtualListElement<V> extends HTMLElement implements Set<V> {
  #sorted = false
  #items: Set<V> = new Set()

  // Heights is used to track the rendered height
  // of a list element. This is useful because the
  // height may vary from item to item, and so each
  // height must be tracked.
  #heights: Map<V, number> = new Map()
  #assumedHeight = Infinity

  #rangeCache = new Map<string, [number, number]>()
  #renderCache = new Map<V, Element>()

  #animationFrameId = 0

  static get observedAttributes() {
    return ['data-updating']
  }

  get updating(): 'eager' | 'lazy' {
    if (this.getAttribute('data-updating') === 'lazy') return 'lazy'
    return 'eager'
  }

  set updating(value: 'eager' | 'lazy') {
    this.setAttribute('data-updating', value)
  }

  get size(): number {
    return this.#items.size
  }

  get range(): [number, number] {
    const visibleHeight = this.getBoundingClientRect().height
    const {scrollTop} = this
    const key = `${scrollTop}-${visibleHeight}`
    if (this.#rangeCache.has(key)) return this.#rangeCache.get(key)!
    let rowStart = 0
    let rowEnd = 0
    let startHeight = 0
    let endHeight = 0
    const heights = this.#heights
    for (const item of this.#items) {
      const height = heights.get(item) || this.#assumedHeight
      if (startHeight + height < scrollTop) {
        startHeight += height
        rowStart += 1
        rowEnd += 1
      } else if (endHeight - height < visibleHeight) {
        endHeight += height
        rowEnd += 1
      } else if (endHeight >= visibleHeight) {
        break
      }
    }
    return [rowStart, rowEnd]
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue || !this.isConnected) return
    const nowEager = name === 'data-updating' && newValue === 'eager'
    const nowSorted = name === 'data-sorted' && this.hasAttribute('data-sorted')
    if (nowEager || nowSorted) {
      this.update()
    }
  }

  connectedCallback(): void {
    // eslint-disable-next-line github/prefer-observers
    this.addEventListener('scroll', () => this.update())
    this.updateSync = this.updateSync.bind(this)
  }

  update(): void {
    if (this.#animationFrameId) cancelAnimationFrame(this.#animationFrameId)
    if (!this.#sorted && this.hasAttribute('data-sorted')) {
      this.#animationFrameId = requestAnimationFrame(() => {
        if (this.dispatchEvent(new CustomEvent('virtual-list-sort', {cancelable: true}))) {
          this.sort()
        }
      })
    } else {
      this.#animationFrameId = requestAnimationFrame(this.updateSync)
    }
  }

  private renderItem(item: V): Element {
    const detail = {item, fragment: document.createDocumentFragment()}
    this.dispatchEvent(new CustomEvent('virtual-list-render-item', {detail}))
    return detail.fragment.children[0]
  }

  private recalculateHeights(value: V) {
    const list = this.querySelector('ul, ol, tbody')
    if (list) {
      list.append(this.renderItem(value))
      this.#assumedHeight = list.children[0].getBoundingClientRect().height
      this.#heights.set(value, this.#assumedHeight)
      list.replaceChildren()
    }
  }

  private updateSync(): void {
    const list = this.querySelector<HTMLElement>('ul, ol')
    if (!list) return

    const [rowStart, rowEnd] = this.range
    if (rowEnd < rowStart) return
    const cancelled = !this.dispatchEvent(new CustomEvent('virtual-list-update', {cancelable: true}))
    if (cancelled) return
    const itemsRows = new Map<V, Element>()
    const renderCache = this.#renderCache
    let i = -1
    let renderEnd = true
    let startHeight = 0
    for (const item of this.#items) {
      if (i === -1 && (!Number.isFinite(this.#assumedHeight) || this.#assumedHeight === 0)) {
        // When virtual list is visually hidden, it still can accept and render data
        // This branch handles the case when virtual list was shown after the data was rendered (with item height === 0)
        this.recalculateHeights(item)
      }
      i += 1
      if (i < rowStart) {
        startHeight += this.#heights.get(item) || this.#assumedHeight
        continue
      }
      if (i > rowEnd) {
        renderEnd = false
        break
      }
      let row = null
      if (renderCache.has(item)) {
        row = renderCache.get(item)!
      } else {
        row = this.renderItem(item)
        if (!row) continue
        renderCache.set(item, row)
      }
      itemsRows.set(item, row)
    }
    list.replaceChildren(...itemsRows.values())
    list.style.paddingTop = `${startHeight}px`
    const totalHeight = this.size * this.#assumedHeight
    list.style.height = `${totalHeight || 0}px`

    // The itemsRows list must be iterated after all rows have been rendered to get accurate heights
    let renderedPastBottom = false
    const scrollBottom = this.getBoundingClientRect().bottom
    for (const [item, row] of itemsRows) {
      const {height, bottom} = row.getBoundingClientRect()
      renderedPastBottom = renderedPastBottom || bottom >= scrollBottom
      this.#heights.set(item, height)
    }

    const moreItemsToRender = !renderEnd && this.size > itemsRows.size
    if (moreItemsToRender && !renderedPastBottom) {
      this.#rangeCache.delete(`${this.scrollTop}-${this.getBoundingClientRect().height}`)
      return this.update()
    }
    this.dispatchEvent(new CustomEvent('virtual-list-updated'))
  }

  has(value: V): boolean {
    return this.#items.has(value)
  }

  add(value: V): this {
    this.#items.add(value)
    this.#sorted = false
    // If this is the first item added we need to render it to get an estimate for the row height of an entity.
    if (!Number.isFinite(this.#assumedHeight)) {
      this.recalculateHeights(value)
    }
    if (this.updating === 'eager') this.update()
    return this
  }

  delete(value: V): boolean {
    const ret = this.#items.delete(value)
    this.#sorted = false
    this.#heights.delete(value)
    if (this.updating === 'eager') this.update()
    return ret
  }

  clear(): void {
    this.#items.clear()
    this.#heights.clear()
    // Resetting the assumedHeight attribute, as the fresh data may contain completely different items.
    // This will lead to height recalculation for a fresh dataset.
    // Otherwise, the size of the list container will be incorrectly estimated.
    this.#assumedHeight = Infinity
    this.#sorted = true
    if (this.updating === 'eager') this.update()
  }

  forEach(callbackfn: (value: V, value2: V, set: Set<V>) => void, thisArg?: unknown): void {
    for (const item of this) callbackfn.call(thisArg, item, item, this)
  }

  entries(): IterableIterator<[V, V]> {
    return this.#items.entries()
  }

  values(): IterableIterator<V> {
    return this.#items.values()
  }

  keys(): IterableIterator<V> {
    return this.#items.keys()
  }

  [Symbol.iterator](): IterableIterator<V> {
    return this.#items[Symbol.iterator]()
  }

  sort(compareFn?: (a: V, b: V) => number): this {
    this.#items = new Set(Array.from(this).sort(compareFn))
    this.#sorted = true
    if (this.updating === 'eager') this.update()
    return this
  }
}

declare global {
  interface Window {
    VirtualListElement: typeof VirtualListElement
  }
  // @ts-fixme HTMLElement doesn't expose `Symbol.toStringTag`
  interface HTMLElement {
    [Symbol.toStringTag]: 'HTMLElement'
  }
}

export default VirtualListElement

if (!window.customElements.get('virtual-list')) {
  window.VirtualListElement = VirtualListElement
  window.customElements.define('virtual-list', VirtualListElement)
}
