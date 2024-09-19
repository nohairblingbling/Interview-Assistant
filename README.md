# Interview Assistant

Interview Assistant 是一款基于 Electron 的应用，可以捕获系统音频(在线会议)，并实施提供面试中回答建议。

## 为什么是Interview Assistant

1. **实时语音转文字**: 利用 Deepgram API 实现实时语音识别。
2. **智能 GPT 回答**: 集成 OpenAI 的 GPT 模型，为面试问题提供即时、智能的回答建议。(支持带转发地址的第三方API)
3. **那内容管理**: 用户可以上传自己的文件，包括文本、图片和 PDF 文件，和你自己定制的提示词，可以极大的定制你想要GPT回应的风格，这些资料将用于个性化 GPT 的回答。
4. **统一上下文**: 在实时回答页面中，对话基于知识页面的配置，都在同一个上下文中进行，确保回答的连贯性和相关性。
5. **跨平台支持**: 作为 Electron 应用，可以在 Windows、macOS系统上运行。

## 与其他工具的对比

Interview Assistant 相比其他面试辅助工具有以下优势：

1. **实时语音识别**: 利用 Deepgram API(新用户有200美元额度)，我们提供比传统语音识别更快、更准确的实时转录。
2. **个性化知识库**: 用户可以上传自己的简历、个人信息等文档，GPT 模型会基于这些信息提供更加个性化的回答建议。
3. **跨平台支持**: 作为 Electron 应用，支持 Windows、macOS。
4. **隐私保护**: 所有数据都在本地处理，不会上传到云端，保护用户的隐私信息。
5. **开源透明**: 我的代码完全开源，可以自由查看、修改和贡献。

下面是 Interview Assistant 与其他面试辅助工具的功能对比表：

|                                                      | Windows | Mac  | 个性定制prompt/上传个人文件 |
| ---------------------------------------------------- | ------- | ---- | ----------- |
| [cheetah](https://github.com/leetcode-mafia/cheetah) |         | ✅    |             |
| [ecoute](https://github.com/SevaSk/ecoute)           | ✅       |      |             |
| Interview Copilot                                    | ✅       | ✅    | ✅          |



这个对比表格清晰地展示了 Interview Assistant 相比其他工具的优势，特别是跨平台和定制prompt。

## 安装和使用

1. 从 Release 页面下载适合您操作系统的安装包。
2. 运行 Interview Assistant。
3. 在设置页面配置您的 OpenAI API 密钥和 Deepgram API 密钥。
4. 开始使用实时面试辅助功能或管理您的知识库。

## 配置说明

要使用 Interview Assistant，您需要：

1. OpenAI API 密钥: 可以从 https://platform.openai.com 获取
2. Deepgram API 密钥: 请访问 https://deepgram.com 注册并获取

## 开发

本项目基于 Electron 和 React 开发。请按以下步骤操作：

1. 克隆仓库: `git clone https://github.com/nohairblingbling/Interview-Assistant`
2. 安装依赖: `npm install`
3. 安装 Electron: `npm install electron`
4. 启动开发服务器: `npm start`
5. 构建应用: `npm run make`


## 许可证

本项目采用 MIT 许可证。详情请见 LICENSE 文件。

