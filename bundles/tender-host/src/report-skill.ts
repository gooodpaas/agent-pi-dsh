/** Only a direct human request can activate the report-writing guidance. */
export function isReportWritingRequest(message: any): boolean {
  if (message?.source?.kind !== 'user') return false
  const text = (message.content || []).filter((part: any) => part.type === 'text').map((part: any) => part.text).join('\n')
    .replace(/```[\s\S]*?```/g, '').replace(/^\s*>.*$/gm, '')
  if (/(?:不要|不用|无需|不需要|别).{0,12}(?:写|编制|生成|报告|huashu)|\b(?:do not|don't)\s+(?:write|create|draft)/i.test(text)) return false
  if (/^(?:请)?(?:解释|介绍|讲解|如何|怎么|怎样)|^\s*(?:how\s+(?:do|to|can)|explain)\b/i.test(text.trim())) return false
  return /(?:编制|撰写|起草|生成|制作|出具|修订|完善|重写|写|做).{0,80}(?:报告|白皮书|调研|研究论文|投标文件|技术标)/u.test(text)
    || /\b(?:write|draft|prepare|create|revise|produce)\b.{0,80}\b(?:report|white\s*paper|research\s*paper|technical\s*proposal)\b/i.test(text)
    || /(?:使用|调用|启用|用)\s*huashu-report/i.test(text)
}

export const REPORT_SKILL_GUIDANCE = '用户本次要求编制专业报告。执行前使用 DSH 原生 skill 工具加载 huashu-report，并读取其 AGENT-PI-ADAPTATION.md；按需读取参考资料。先明确用途和证据口径，再写作、制作图表并检查实际交付物。已有用户要求和招标文件格式优先，不强制套用研究报告模板。不启用额外投标流程、不自动加载知识库、不自动保存复用模板。'

export function registerReportSkillRouting(ctx: any) {
  const active = new WeakMap<object, boolean>()
  ctx.on('agent/inbox/claimed', ({ agent, message }: any) => {
    if (message?.source?.kind === 'user') active.set(agent, isReportWritingRequest(message))
  })
  ctx.systemPrompt?.context?.({
    name: 'agent-pi:report-skill', order: 46,
    text: ({ agent }: any) => agent && active.get(agent) ? REPORT_SKILL_GUIDANCE : '',
  })
}
