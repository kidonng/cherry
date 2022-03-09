import { colors, esbuild, path } from './deps.ts'
import { plugins } from './esbuild.ts'

for (const script of ['scripts/github-theme-switch.user.tsx']) {
    console.log(`Building ${colors.bold(script)} as bookmarklet`)

    await esbuild
        .build({
            entryPoints: [script],
            outfile: `scripts/generated/${path.basename(
                script,
                path.extname(script)
            )}.bookmarklet.js`,
            bundle: true,
            minify: true,
            write: false,
            legalComments: 'none',
            plugins,
        })
        .then((result) => {
            for (const { path, contents } of result.outputFiles) {
                Deno.writeTextFileSync(
                    path,
                    'javascript:' + new TextDecoder().decode(contents)
                )
            }
        })
}

esbuild.stop()
