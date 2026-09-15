import { randomUUID } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

export function createDepthTemplates(home) {
  const root = join(home, 'agent-pi', 'professional-depth-templates')
  const pathFor = (id) => {
    if (!/^[a-f0-9-]{36}$/.test(id)) throw new Error('模板编号无效。')
    return join(root, `${id}.md`)
  }
  const read = (id) => {
    const content = readFileSync(pathFor(id), 'utf8')
    return { id, title: content.split('\n')[0].replace(/^#\s*/, ''), content, path: pathFor(id) }
  }
  return {
    list: () => existsSync(root) ? readdirSync(root).filter((name) => /^[a-f0-9-]{36}\.md$/.test(name))
      .map((name) => { const { id, title } = read(name.slice(0, -3)); return { id, title } }) : [],
    read,
    save({ id, title, content }) {
      if (typeof title !== 'string' || !title.trim() || title.length > 120 || /[\r\n]/.test(title)) throw new Error('请输入 1–120 字的模板名称。')
      if (typeof content !== 'string' || !content.trim() || content.length > 24000) throw new Error('模板内容需要为 1–24000 字。')
      const target = id || randomUUID()
      const path = pathFor(target)
      mkdirSync(root, { recursive: true })
      const temp = `${path}.${randomUUID()}.tmp`
      writeFileSync(temp, `# ${title.trim()}\n\n${content.replace(/^# [^\n]*\n+/, '').trim()}\n`, { mode: 0o600, flag: 'wx' })
      renameSync(temp, path)
      return read(target)
    },
  }
}
