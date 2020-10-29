# Deno Scripts

## [SIP008 to SIP002](SIP008-to-SIP002.ts)

Convert Shadowsocks [SIP008 Online Config](https://github.com/shadowsocks/shadowsocks-org/issues/89) to [SIP002 URI Scheme](https://shadowsocks.org/en/spec/SIP002-URI-Scheme.html) (`ss://`) links.

### Usage

[API Reference](https://doc.deno.land/https/cdn.jsdelivr.net/gh/kidonng/cherry/deno/SIP008-to-SIP002.ts)

```
deno run --allow-net https://cdn.jsdelivr.net/gh/kidonng/cherry/deno/SIP008-to-SIP002.ts <Online Config URL>
```