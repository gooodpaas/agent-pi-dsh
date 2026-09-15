import assert from 'node:assert/strict'
import { test } from 'node:test'
import { isReportWritingRequest, registerReportSkillRouting } from '../src/report-skill.ts'

const user = (text: string) => ({ source: { kind: 'user' }, content: [{ type: 'text', text }] })
test('report creation and revision route only from actual human requests', () => {
  for (const text of ['帮我编制本项目可研报告', '请修订附件中的调研报告，补上依据', '为这个工程编制技术标', 'Draft a research report on this project', '使用 huashu-report 写作']) assert.equal(isReportWritingRequest(user(text)), true, text)
  for (const text of ['总结这份报告', '如何撰写专业报告？', '请解释怎么写调研报告', '报告打不开', '不要写报告，只检查文件', 'How do I write a report?', '> 编制专业报告', '```\n编制专业报告\n```', '查询天气']) assert.equal(isReportWritingRequest(user(text)), false, text)
  assert.equal(isReportWritingRequest({ ...user('编制报告'), source: { kind: 'tool' } }), false)
})
test('report guidance resets on the next unrelated user task and never activates depth or templates', () => {
  let claim: any, prompt: any
  registerReportSkillRouting({ on: (_name: string, fn: any) => { claim = fn }, systemPrompt: { context: (value: any) => { prompt = value } } })
  const agent = {}
  assert.equal(prompt.text({ agent }), '')
  claim({ agent, message: user('编制专业报告') })
  assert.match(prompt.text({ agent }), /skill 工具加载 huashu-report/)
  claim({ agent, message: { ...user('done'), source: { kind: 'tool' } } })
  assert.match(prompt.text({ agent }), /huashu-report/)
  claim({ agent, message: user('你好') })
  assert.equal(prompt.text({ agent }), '')
})
