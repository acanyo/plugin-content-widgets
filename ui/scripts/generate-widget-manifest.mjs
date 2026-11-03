// 根据编辑器组件声明生成 build/manifest/content-widgets-manifest.json，
// 使 JVM 侧（MCP 工具）与 Console 编辑器使用同一份数据源。
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const here = dirname(fileURLToPath(import.meta.url))
const uiRoot = resolve(here, '..')
const output = resolve(uiRoot, 'build/manifest/content-widgets-manifest.json')

const server = await createServer({
  root: uiRoot,
  configFile: false,
  resolve: {
    alias: { '@': resolve(uiRoot, 'src') },
  },
  server: { middlewareMode: true },
  logLevel: 'warn',
})

try {
  const mod = await server.ssrLoadModule('/src/editor/widgets/index.ts')
  const widgets = mod.widgetModules.map(({ definition, editorFields }) => ({
    id: definition.id,
    title: definition.title,
    description: definition.description,
    category: definition.category,
    kind: definition.kind,
    tagName: definition.tagName,
    attributes: definition.attributes ?? {},
    innerHTML: definition.innerHTML ?? '',
    keywords: definition.keywords ?? [],
    fields: editorFields ?? [],
  }))
  await mkdir(dirname(output), { recursive: true })
  await writeFile(output, `${JSON.stringify({ widgets }, null, 2)}\n`, 'utf8')
  console.log(`Generated ${output} (${widgets.length} widgets)`)
} finally {
  await server.close()
}
