/* eslint-disable unicorn/filename-case */
import {encode} from 'https://deno.land/std@0.145.0/encoding/base64.ts'
import {isIPv6} from 'https://esm.sh/is-ip@4.0.0'

export interface Config {
	[key: string]: unknown
	version: number
	servers: Server[]
}

export interface Server {
	[key: string]: unknown
	id: string
	server: string
	server_port: number
	password: string
	method: string
	remarks?: string
	plugin?: string
	plugin_opts?: string
}

export function convertServer(entry: Server): string {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	let {server, server_port, password, method, remarks} = entry
	if (isIPv6(server)) server = `[${server}]`
	return `ss://${encode(
		`${method}:${password}`,
	)}@${server}:${server_port}#${remarks}`
}

if (import.meta.main) {
	const [url] = Deno.args
	const response = await fetch(url)
	const {servers}: Config = await response.json()
	console.log(servers.map((server) => convertServer(server)).join('\n'))
}
