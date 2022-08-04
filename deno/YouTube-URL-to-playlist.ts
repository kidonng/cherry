/* eslint-disable unicorn/filename-case */
import {readLine} from 'https://deno.land/x/deno_extras@v0.5.0/mod.ts'

const url =
	Deno.args[0] ||
	(Deno.isatty(Deno.stdin.rid)
		? // eslint-disable-next-line no-alert
		  prompt('Enter YouTube URL:')
		: await readLine())
if (!url) Deno.exit(1)

console.log(
	`https://www.youtube.com/playlist?list=${new URL(url).searchParams.get(
		'list',
	)}`,
)
