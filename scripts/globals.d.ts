declare namespace JSX {
	// https://github.com/refined-github/refined-github/blob/90ad3b20c70681ca0ee85ef341e1818a887f9462/source/globals.d.ts#L39-L49
	interface IntrinsicElements {
		'details-menu': IntrinsicElements['div'] & {src?: string; preload?: boolean};
	}
}
