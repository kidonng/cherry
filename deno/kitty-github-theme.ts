/* eslint-disable @typescript-eslint/restrict-plus-operands */
import stripIndent from 'https://esm.sh/strip-indent'

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

	// Template: https://github.com/kovidgoyal/kitty-themes/blob/master/template.conf
	// Color references: https://github.com/primer/github-vscode-theme/blob/main/src/theme.js
	let conf = stripIndent(`
		# vim:ft=kitty

		## name: GitHub ${theme}
		## author: GitHub
		## license: MIT

		#: The basic colors

		foreground ${colors.fg.default /* editor.foreground */}
		background ${colors.canvas.default /* editor.background */}
		selection_foreground ${
			colors.canvas.default /* Do inversion ourselves as kitty do it badly */
		}
		selection_background ${
			colors.accent.fg /* Alpha-less editor.selectionBackground */
		}


		#: Cursor colors

		cursor ${colors.accent.fg /* editorCursor.foreground */}


		#: Tab bar colors

		tab_bar_background ${colors.canvas.inset /* editorGroupHeader.tabsBackground */}
		active_tab_foreground ${colors.fg.default /* tab.activeForeground */}
		active_tab_background ${colors.canvas.default /* tab.activeBackground */}
		inactive_tab_foreground ${colors.fg.muted /* tab.inactiveForeground */}
		inactive_tab_background ${colors.canvas.inset /* tab.inactiveBackground */}


		#: The basic 16 colors
	`).trim()
	conf += '\n'

	for (const [index, color] of Object.entries(ansi)) {
		conf += stripIndent(`
			#: ${color}
			color${index} ${colors.ansi[color] /* terminal.<color> */}
			color${Number(index) + 8} ${colors.ansi[`${color}Bright`]}
		`).trimEnd()
		conf += '\n'
	}

	return conf
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
