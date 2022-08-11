/* eslint-disable capitalized-comments */
// https://sw.kovidgoyal.net/kitty/conf/#the-color-table
const ansi = [
	'black',
	'red',
	'green',
	'yellow',
	'blue',
	'magenta',
	'cyan',
	'white',
]

async function convertTheme(theme: string) {
	const file = `${theme.toLowerCase().replaceAll(' ', '_')}.json`
	const response = await fetch(
		`https://unpkg.com/@primer/primitives/dist/json/colors/${file}`,
	)
	const colors = await response.json()

	// https://github.com/primer/github-vscode-theme/blob/main/src/theme.js
	const conf = [
		`## name: GitHub ${theme}`,
		`## author: GitHub`,
		'',
		'# Basic',
		// editor.foreground
		`foreground ${colors.fg.default}`,
		// editor.background
		`background ${colors.canvas.default}`,
		// Do inversion ourselves because kitty do it badly
		`selection_foreground ${colors.canvas.default}`,
		// editor.selectionBackground, without alpha
		`selection_background ${colors.accent.fg}`,
		// editorCursor.foreground
		`cursor ${colors.accent.fg}`,
		'',
		'# Tab',
		// editorGroupHeader.tabsBackground
		`tab_bar_background ${colors.canvas.inset}`,
		// tab.activeForeground
		`active_tab_foreground ${colors.fg.default}`,
		// tab.activeBackground
		`active_tab_background ${colors.canvas.default}`,
		// tab.inactiveForeground
		`inactive_tab_foreground ${colors.fg.muted}`,
		// tab.inactiveBackground
		`inactive_tab_background ${colors.canvas.inset}`,
		'',
		'# ANSI colors',
	]

	for (const [index, color] of Object.entries(ansi)) {
		// terminal.*
		conf.push(
			`# ${color}`,
			`color${index} ${colors.ansi[color]}`,
			`color${Number(index) + 8} ${colors.ansi[`${color}Bright`]}`,
			'',
		)
	}

	return conf.join('\n')
}

const themes = [
	'Light',
	'Light High Contrast',
	'Light Colorblind',
	'Dark',
	'Dark High Contrast',
	'Dark Colorblind',
	'Dark Dimmed',
]

for (const theme of themes) {
	const file = `GitHub_${theme.replaceAll(' ', '_')}.conf`
	// eslint-disable-next-line no-await-in-loop
	const conf = await convertTheme(theme)
	console.log(`Writing ${file}`)
	Deno.writeTextFileSync(file, conf)
}
