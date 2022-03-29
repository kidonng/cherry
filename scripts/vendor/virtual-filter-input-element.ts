// From https://github.githubassets.com/assets/app/assets/modules/github/virtual-filter-input-element.ts

function isSetAlike<V>(value: unknown): value is Set<V> {
    return Boolean(
      value instanceof Set ||
        (value && typeof value === 'object' && 'size' in value && 'add' in value && 'delete' in value && 'clear' in value)
    )
  }
  
  /**
   * An input component that fetches and filters items.
   *
   * Important:
   * - Uses src attribute to fetch items.
   * - Uses `data-property` attribute to load items from the response.
   */
  class VirtualFilterInputElement<V> extends HTMLElement {
    #abortController?: AbortController
    #animationFrameId = 0
    #lastQuery: string | null = null
    #timer?: number
    #items: Set<V> = new Set()
    #filtered: Set<V> | null = null
    filter: (item: V, query: string) => boolean | null = (item, query) => String(item).includes(query)
  
    static get observedAttributes() {
      return ['src', 'loading', 'data-property', 'aria-owns']
    }
  
    get filtered(): Set<V> {
      if (this.#filtered) return this.#filtered
  
      if (this.hasAttribute('aria-owns')) {
        const el = this.ownerDocument.getElementById(this.getAttribute('aria-owns') || '')
        if (el && isSetAlike<V>(el)) {
          this.#filtered = el
        }
      }
  
      return (this.#filtered ||= new Set())
    }
  
    set filtered(set: Set<V>) {
      this.#filtered = set
    }
  
    get input(): HTMLInputElement | HTMLTextAreaElement | null {
      return this.querySelector<HTMLInputElement | HTMLTextAreaElement>('input, textarea')
    }
  
    get src(): string {
      return this.getAttribute('src') || ''
    }
  
    set src(value: string) {
      this.setAttribute('src', value)
    }
  
    get loading(): 'eager' | 'lazy' {
      if (this.getAttribute('loading') === 'lazy') return 'lazy'
      return 'eager'
    }
  
    set loading(value: 'eager' | 'lazy') {
      this.setAttribute('loading', value)
    }
  
    get accept(): string {
      return this.getAttribute('accept') || ''
    }
  
    set accept(value: string) {
      this.setAttribute('accept', value)
    }
  
    get property(): string {
      return this.getAttribute('data-property') || ''
    }
  
    set property(value: string) {
      this.setAttribute('data-property', value)
    }
  
    reset() {
      this.filtered.clear()
      this.#items = new Set()
    }
  
    clear() {
      if (!this.input) return
      this.input.value = ''
      this.input.dispatchEvent(new Event('input'))
    }
  
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      const isReady = this.isConnected && this.src
      const eager = this.loading === 'eager'
      const isLoaderAttribute = name === 'src' || name === 'loading' || name === 'accept' || name === 'data-property'
      const isDataSourceAttribute = name === 'src' || name === 'data-property'
      const valueChanged = oldValue !== newValue
  
      // Reset the lastQuery in case src or property has changed.
      // This means that the data will be different and we don't want to preserve the same filtering query.
      if (isDataSourceAttribute && valueChanged) {
        this.#lastQuery = null
        // clear the debounce timer when value and datasource has changed
        // the new dataset will be filtered in load() method
        if (this.#timer) clearTimeout(this.#timer)
      }
  
      if (isReady && eager && isLoaderAttribute && valueChanged) {
        cancelAnimationFrame(this.#animationFrameId)
        this.#animationFrameId = requestAnimationFrame(() => this.load())
      } else if (name === 'aria-owns') {
        this.#filtered = null
      }
    }
  
    connectedCallback() {
      if (this.src && this.loading === 'eager') {
        cancelAnimationFrame(this.#animationFrameId)
        this.#animationFrameId = requestAnimationFrame(() => this.load())
      }
      const input = this.input
      if (!input) return
  
      // Trigger aria-owns behavior which does not always trigger from attributeChangedCallback
      const owns = this.getAttribute('aria-owns')
      if (owns !== null) {
        this.attributeChangedCallback('aria-owns', '', owns)
      }
  
      input.setAttribute('autocomplete', 'off')
      input.setAttribute('spellcheck', 'false')
  
      if (this.src && this.loading === 'lazy') {
        if (document.activeElement === input) {
          // If the input is focused, we want to load immediately
          this.load()
        } else {
          // Otherwise, we want to load when the input is focused
          input.addEventListener(
            'focus',
            () => {
              this.load()
            },
            {once: true}
          )
        }
      }
  
      // Dispatches to `handleEvent`.
      // See https://developer.mozilla.org/en-US/docs/Web/API/EventListener/handleEvent
      input.addEventListener('input', this)
    }
  
    disconnectedCallback() {
      this.input?.removeEventListener('input', this)
    }
  
    handleEvent(event: Event) {
      if (event.type === 'input') {
        if (this.#timer) clearTimeout(this.#timer)
        // We try to simulate a "sensible" debounce, assuming that we're
        // filtering a large number of items, we can debounce slightly longer
        // for shallow queries
        this.#timer = window.setTimeout(() => this.filterItems(), this.input?.value?.length || 0 < 3 ? 300 : 100)
      }
    }
  
    async load() {
      this.#abortController?.abort()
      this.#abortController = new AbortController()
      const {signal} = this.#abortController
      if (!this.src) throw new Error('missing src')
  
      // Functional stand in for the W3 spec "queue a task" paradigm
      await new Promise(resolve => setTimeout(resolve, 0))
      if (signal.aborted) return
  
      this.dispatchEvent(new Event('loadstart'))
  
      try {
        const response = await this.fetch(this.request(), {signal})
        if (location.origin + this.src !== response.url) {
          // If the response URL does not match the src we are ignoring it.
          return
        }
  
        if (!response.ok) {
          throw new Error(`Failed to load resource: the server responded with a status of ${response.status}`)
        }
        this.#items = new Set((await response.json())[this.property])
        // reset lastQuery, as the dataset has changed
        this.#lastQuery = null
        this.dispatchEvent(new Event('loadend'))
      } catch (e) {
        if (signal.aborted) {
          this.dispatchEvent(new Event('loadend'))
          return
        }
        // Dispatch `error` and `loadend` async to allow
        // the `load()` promise to resolve _before_ these
        // events are fired.
        ;(async () => {
          this.dispatchEvent(new Event('error'))
          this.dispatchEvent(new Event('loadend'))
        })()
        throw e
      }
  
      this.filtered.clear()
      this.filterItems()
    }
  
    request(): Request {
      return new Request(this.src, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          Accept: this.accept || 'application/json'
        }
      })
    }
  
    fetch(request: RequestInfo, init?: RequestInit): Promise<Response> {
      return fetch(request, init)
    }
  
    filterItems() {
      const query = this.input?.value.trim() ?? ''
      const lastQuery = this.#lastQuery
      this.#lastQuery = query
      if (query === lastQuery) return
      this.dispatchEvent(new CustomEvent('virtual-filter-input-filter'))
      let items: Set<V>
      // If the search is additive, we can filter the subset rather than the superset
      // as we know the subset must contain all items present in the last query
      if (lastQuery && query.includes(lastQuery)) {
        items = this.filtered
      } else {
        items = this.#items
        // If the search is not additive, we need to retain the original items order. To do that we need to repopulate the filtered set.
        this.filtered.clear()
      }
      for (const item of items) {
        if (this.filter(item, query)) {
          this.filtered.add(item)
        } else {
          this.filtered.delete(item)
        }
      }
      this.dispatchEvent(new CustomEvent('virtual-filter-input-filtered'))
    }
  }
  
  export default VirtualFilterInputElement
  
  declare global {
    interface Window {
      VirtualFilterInputElement: typeof VirtualFilterInputElement
    }
  }
  
  if (!window.customElements.get('virtual-filter-input')) {
    window.VirtualFilterInputElement = VirtualFilterInputElement
    window.customElements.define('virtual-filter-input', VirtualFilterInputElement)
  }
  