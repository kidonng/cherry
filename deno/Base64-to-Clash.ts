import { decode } from 'https://deno.land/std@0.145.0/encoding/base64.ts'
import { generateConfig } from './utils/clash.ts'

const vmess = (url: URL) => {
    try {
        const decodedData = JSON.parse(
            new TextDecoder().decode(decode(url.hostname))
        )
        const proxy: Record<string, any> = {
            name: decodedData.ps,
            type: 'vmess',
            server: decodedData.add,
            port: decodedData.port,
            uuid: decodedData.id,
            alterId: decodedData.aid,
            cipher: 'auto',
            'ws-opts': {},
        }
        if (decodedData?.tls === 'tls') proxy.tls = true
        if (decodedData?.net) proxy.network = decodedData.net
        if (decodedData?.path) proxy['ws-opts'].path = decodedData.path
        if (decodedData?.host)
            proxy['ws-opts'].headers = { Host: decodedData.host }
        return proxy
    } catch {}
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

    const proxies: Record<string, unknown>[] = []
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
    const res = await fetch(url)
    const rawSub = await res.text()
    const proxies = convertSub(rawSub)
    console.log(generateConfig(proxies))
}
