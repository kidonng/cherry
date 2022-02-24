import { join } from 'https://deno.land/std@0.91.0/path/mod.ts'
import { existsSync } from 'https://deno.land/std@0.91.0/fs/exists.ts'
import yaml from 'https://cdn.skypack.dev/js-yaml'

export function generateConfig(proxies: Record<string, unknown>): string {
  const config = join(Deno.env.get('HOME')!, '.config', 'clash', 'config.yaml')
  const rules = (existsSync(config)
    && yaml.load(Deno.readTextFileSync(config))?.rules)
    || ['GEOIP,CN,DIRECT', 'MATCH,PROXY']

  return yaml.dump({ ...proxies, rules })
}
