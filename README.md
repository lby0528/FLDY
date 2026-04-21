# 《飞梁叠韵》- 中国传统营造之美 部署说明

本游戏是为“2026年中国大学生计算机设计大赛”开发的数媒游戏与交互设计类作品。

## 一、 项目简介
《飞梁叠韵》是一款以中国古代民居建筑为主题的节奏点击类网页游戏。玩家扮演“大匠”，通过节奏点击搭建8种各具特色的传统民居，学习建筑构件知识，并能通过AI大匠实时请教营造技法。

## 二、 技术栈
- **前端**: React 19, Tailwind CSS 4, Canvas API, Web Audio API
- **动画**: Motion (framer-motion)
- **AI**: Google Gemini 2.0 Flash API
- **部署**: 推荐使用 Vercel 或 GitHub Pages

## 三、 部署步骤

### 1. 获取 Gemini API Key
1. 访问 [Google AI Studio](https://aistudio.google.com/)。
2. 创建一个新的 API Key。
3. 将该 Key 保存好，稍后配置到环境变量中。

### 2. 配置环境变量
在项目根目录创建 `.env` 文件（或在部署平台的 Dashboard 中设置）：
```env
GEMINI_API_KEY=你的_API_KEY
VITE_USE_MOCK_AI=false
```

### 3. 部署到 Vercel (推荐，支持 AI 代理)
1. 将代码上传至 GitHub 仓库。
2. 在 Vercel 中导入该项目。
3. 在 "Environment Variables" 中添加 `GEMINI_API_KEY`。
4. 点击 "Deploy"。Vercel 会自动识别 `api/chat.js` 并将其部署为 Serverless Function。

### 4. 部署到 GitHub Pages (仅前端)
1. 如果部署到 GitHub Pages，由于其不支持后端函数，建议将 `VITE_USE_MOCK_AI` 设置为 `true`。
2. 使用 `npm run build` 生成静态文件。
3. 将 `dist` 目录下的内容推送到 `gh-pages` 分支。

## 四、 核心玩法说明
- **节奏点击**: 构件到达底部虚线框时点击，越精准得分越高，增加稳固度。
- **榫卯合鸣**: 连续正确5次触发，进入知识问答。
- **古法秘技**: 答对问题获得增益（减速、容错、双倍分）。
- **请教大匠**: 通关后可与 AI 大匠对话，深入了解民居背后的文化。

## 五、 开发者
- **参赛单位**: 2026年中国大学生计算机设计大赛参赛团队
- **设计风格**: 传统水墨淡彩国风
