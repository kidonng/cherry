# Deno Scripts

## [SIP008 to SIP002](scripts/SIP008-to-SIP002.ts)

Convert Shadowsocks [SIP008 Online Config](https://shadowsocks.org/en/wiki/SIP008-Online-Configuration-Delivery.html) to [SIP002 URI Scheme](https://shadowsocks.org/en/wiki/SIP002-URI-Scheme.html) (`ss://`) links.

### Usage

[API Reference](https://doc.deno.land/https/cdn.jsdelivr.net/gh/kidonng/cherry/scripts/SIP008-to-SIP002.ts)

```
deno run --allow-net https://cdn.jsdelivr.net/gh/kidonng/cherry/scripts/SIP008-to-SIP002.ts <Online Config URL>
```

## [NCU COVID Sign](scripts/ncu-covid-sign.ts)

### Usage

```sh
export NCU_TOKEN <TOKEN>
deno run --allow-net --allow-env https://cdn.jsdelivr.net/gh/kidonng/cherry/scripts/ncu-covid-sign.ts
```
