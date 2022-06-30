import { join } from 'https://deno.land/std@0.145.0/path/mod.ts'
import { existsSync } from 'https://deno.land/std@0.145.0/fs/exists.ts'
import {
    parse,
    stringify,
} from 'https://deno.land/std@0.145.0/encoding/yaml.ts'

export function generateConfig(proxies: Record<string, unknown>): string {
    const config = join(
        Deno.env.get('HOME')!,
        '.config',
        'clash',
        'config.yaml'
    )
    const rules = (existsSync(config) &&
        (parse(Deno.readTextFileSync(config)) as any)?.rules) || [
        'GEOIP,CN,DIRECT',
        'MATCH,PROXY',
    ]

    return stringify({ ...proxies, rules })
}
