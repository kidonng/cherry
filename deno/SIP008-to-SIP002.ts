import { encode } from 'https://deno.land/std@0.75.0/encoding/base64.ts'
// @deno-types="https://cdn.jsdelivr.net/npm/is-ip@3.1.0/index.d.ts"
import { default as isIp } from 'https://jspm.dev/is-ip@3.1.0'
import { ky } from 'https://cdn.jsdelivr.net/gh/kidonng/deno-utils@v0.2.0/mod.ts'

export interface Config {
  version: number
  servers: Server[]
  [key: string]: any
}

export interface Server {
  id: string
  server: string
  server_port: number
  password: string
  method: string
  remarks?: string
  plugin?: string
  plugin_opts?: string
  [key: string]: any
}

export function convertServer(entry: Server): string {
  let { server, server_port, password, method, remarks } = entry
  if (isIp.v6(server)) server = `[${server}]`
  return `ss://${encode(
    `${method}:${password}`
  )}@${server}:${server_port}#${remarks}`
}

export async function convertURL(url: string): Promise<string> {
  const { servers } = await ky(url).json<Config>()
  return servers.map(convertServer).join('\n')
}

if (import.meta.main) console.log(await convertURL(Deno.args[0]))
