import { esbuild } from './deps.ts'
import { config } from './esbuild.ts'

for (const options of config) {
    const result = await esbuild.build({ ...options, metafile: true })
    console.log(
        await esbuild.analyzeMetafile(result.metafile!, {
            color: true,
        })
    )
}

esbuild.stop()
