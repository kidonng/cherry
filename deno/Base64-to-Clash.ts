/* eslint-disable unicorn/filename-case */
import {decode} from 'https://deno.land/std@0.145.0/encoding/base64.ts'
// eslint-disable-next-line import/no-unassigned-import
import type {} from 'https://esm.sh/@kidonng/typed-json@1.2.0'
import type {JsonObject} from 'type-fest/source/basic.d.ts'
import {generateConfig} from './utils/clash.ts'

const vmess = (url: URL) => {
	try {
		const decodedData = JSON.parse<JsonObject>(
			new TextDecoder().decode(decode(url.hostname)),
		)
		// To be serialized into YAML, basically the same as JSON
		const proxy: JsonObject = {
			name: decodedData.ps,
			type: 'vmess',
			server: decodedData.add,
			port: decodedData.port,
			uuid: decodedData.id,
			alterId: decodedData.aid,
			cipher: 'auto',
			'ws-opts': {},
		}
		if (decodedData.tls === 'tls') proxy.tls = true
		if (decodedData.net) proxy.network = decodedData.net
		if (decodedData.path)
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
			(proxy['ws-opts'] as JsonObject).path = decodedData.path
		if (decodedData.host)
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/naming-convention
			(proxy['ws-opts'] as JsonObject).headers = {Host: decodedData.host}
		return proxy
	} catch {
		console.error('Failed to parse:', url)
	}
}

const trojan = (url: URL) => ({
	name: decodeURIComponent(url.hash.slice(1)),
	type: 'trojan',
	server: url.hostname,
	port: Number(url.port),
	password: url.username,
})

export function convertSub(rawSub: string) {
	const decodedSub = new TextDecoder().decode(decode(rawSub))

	const proxies: Array<Record<string, unknown>> = []
	for (const sub of decodedSub.split('\n')) {
		if (sub === '') continue
		const url = new URL(sub)

		if (url.protocol === 'vmess:') {
			const proxy = vmess(url)
			if (proxy) proxies.push(proxy)
		}

		if (url.protocol === 'trojan:') proxies.push(trojan(url))
	}

	return {
		proxies,
		'proxy-groups': [
			{
				name: 'PROXY',
				type: 'select',
				proxies: proxies.map((proxy) => proxy.name),
			},
		],
	}
}

if (import.meta.main) {
	const [url] = Deno.args
	const response = await fetch(url)
	const rawSub = await response.text()
	const proxies = convertSub(rawSub)
	console.log(generateConfig(proxies))
}
