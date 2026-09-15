import { createHash, randomUUID } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

// Product preferences live outside the canonical DSH event vocabulary.
export function createDepthStore(home) {
  const root = join(home, 'agent-pi', 'professional-depth')
  const pathFor = (id) => join(root, `${createHash('sha256').update(id).digest('hex')}.json`)
  return {
    read(id) {
      const path = pathFor(id)
      if (!existsSync(path)) return undefined
      const state = JSON.parse(readFileSync(path, 'utf8'))
      if (state.sessionId !== id) throw new Error('专业深度状态与当前对话不匹配。')
      return state
    },
    write(state) {
      mkdirSync(root, { recursive: true })
      const path = pathFor(state.sessionId)
      const temp = `${path}.${randomUUID()}.tmp`
      writeFileSync(temp, `${JSON.stringify(state, null, 2)}\n`, { mode: 0o600, flag: 'wx' })
      renameSync(temp, path)
    },
  }
}
