import {existsSync} from 'https://deno.land/std@0.145.0/fs/exists.ts'
import {parse, stringify} from 'https://deno.land/std@0.145.0/encoding/yaml.ts'

export function generateConfig(proxies: Record<string, unknown>): string {
	const config = `${Deno.env.get('HOME')!}/.config/clash/config.yaml`
	const rules = ['GEOIP,CN,DIRECT', 'MATCH,PROXY']
	if (existsSync(config)) {
		const parsed = parse(Deno.readTextFileSync(config))
		if (parsed) rules.push(...(parsed as {rules: string[]}).rules)
	}

	return stringify({...proxies, rules})
}
