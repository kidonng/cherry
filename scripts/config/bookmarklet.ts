import * as esbuild from 'esbuild'
import { bookmarkletConfig } from './esbuild.ts'

for (const options of bookmarkletConfig) {
    const result = await esbuild.build(options)
    const [{ path, contents }] = result.outputFiles!
    await Deno.writeTextFile(
        path,
        'javascript:' + new TextDecoder().decode(contents)
    )
}

esbuild.stop()
