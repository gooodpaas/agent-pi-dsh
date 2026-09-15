# Agent Pi DSH 3.6.7

<!-- agent-pi-release-meta: {"schema":1,"appVersion":"3.6.7","kernel":{"releaseTag":"dsh-v0.1.6-alpha.1","commit":"0a15e36e7f82b6ed45af6fa9759f29b40dcd965d"}} -->

升级至官方 DSH `dsh-v0.1.6-alpha.1`，产品扩展保持在官方源码之外。

- 专业深度开关只保存选择，用户真正发送任务后才开始；明确需求直接执行，关键对象或用途缺失时集中澄清。新对话默认关闭。
- 修复旧专业深度事件引起的历史加载失败：启动前保留原始日志备份，仅标记本产品旧事件可忽略，并将专业深度状态迁至独立存储。
- 增加可编辑 Markdown 复用模板，由用户主动保存、主动选用；不自动积累或召回模板。
- 内置 MIT 技能 huashu-report，普通对话识别到报告编制或实质修订需求时引导原生 skill 工具按需加载。遵循证据、来源、图表和逐页检查流程；用户模板及招标文件格式优先，不自动启用投标流程或加载全部知识库。
- 报告渲染脚本适配 Windows 文件路径与 UTF-8，并提供本地依赖检查。PDF 渲染需要 Python Playwright、Chromium 和 Poppler；不会在应用启动时安装或调用云端渲染。
- Agent Teams 继续由用户主动开启，适配新官方预设，禁用相冲突的普通子智能体工具；Codex 执行保持独立。
- 默认关闭新增的会话日志与插件清单上传组件。保留现有桌面通信、Linux 打包、Univer Office 完整插件、CAD、文件栏、按需知识库和精简过程。

CAD 对应源码沿用已验证的 `Agent-Pi-DSH-3.6.2-CAD-corresponding-source.tar.gz`，来源提交 `1aef6820ebc450125788158a4b2d1706115cdd10`。
项目及发行物采用 `GPL-3.0-only`，第三方组件保留原始条款。正式 SHA256 以同一 Release 中的 `.sha256` 资产为准。
