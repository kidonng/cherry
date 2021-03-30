import { encode } from 'https://deno.land/std@0.75.0/encoding/base64.ts'
// @deno-types="https://cdn.jsdelivr.net/npm/is-ip@3.1.0/index.d.ts"
import { default as isIp } from 'https://jspm.dev/is-ip@3.1.0'
// @deno-types="https://cdn.jsdelivr.net/npm/ky@0.27.0/index.d.ts"
import ky from 'https://cdn.jsdelivr.net/npm/ky@0.27.0/index.js'

export interface Config {
  version: number
  servers: Server[]
  [key: string]: unknown
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
  [key: string]: unknown
}

export function convertServer(entry: Server): string {
  let { server, server_port, password, method, remarks } = entry
  if (isIp.v6(server)) server = `[${server}]`
  return `ss://${encode(
    `${method}:${password}`
  )}@${server}:${server_port}#${remarks}`
}

if (import.meta.main) {
  const [url] = Deno.args
  const { servers } = await ky(url).json<Config>()
  console.log(servers.map(convertServer).join('\n'))
}
