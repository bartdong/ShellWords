# 🐚 ShellWords - 单词拼写大挑战

一款面向少儿英语学习的单词拼写练习 Web 应用，基于 **YLE Starters（剑桥少儿英语）** 词汇表，帮助孩子通过趣味挑战掌握英语单词和短语拼写。

## ✨ 功能特色

- 🎯 **多种挑战模式** — 支持单词挑战、短语挑战、混合挑战，可选智能20题或全量出题
- 🧠 **智能出题** — 根据历史答题记录，优先推送薄弱单词，科学复习
- 🖼️ **图片+音频辅助** — 每个单词配有图片和发音，看图听音拼写
- 📊 **学习统计** — 实时追踪挑战次数、正确率、已掌握单词数
- 🏆 **排行榜** — 支持多用户登录，查看排行榜
- 📱 **移动端优先** — 针对手机端优化，支持 PWA 添加到主屏幕
- ☁️ **云端同步** — 通过后端 API 同步学习数据，多设备进度互通

## 📚 词汇来源

基于 **YLE Starters Word List & Phrases 2021**，包含：
- 📖 **204 个核心单词**
- 📝 **80 个常用短语**

## 🛠️ 技术栈

- **前端**：纯 HTML/CSS/JavaScript 单文件应用（无框架依赖）
- **后端**：Node.js + Express（学习数据存储 API）
- **部署**：Nginx + HTTPS + systemd

## 🚀 快速开始

### 前端

直接在浏览器中打开 `index.html` 即可使用（离线模式下数据存储在本地 localStorage）。

### 后端（可选，用于云端同步）

```bash
cd server
npm install
npm start
```

后端默认运行在 `http://localhost:3001`。

### 部署

项目已配置 Nginx 反向代理和 systemd 服务文件，详见：
- `nginx.conf` — Nginx 配置（HTTPS + API 代理）
- `shellwords-api.service` — systemd 服务配置

## 📁 项目结构

```
ShellWords/
├── index.html              # 主应用（前端单文件）
├── favicon.png             # 网站图标
├── nginx.conf              # Nginx 部署配置
├── shellwords-api.service  # systemd 服务文件
├── extracted_data_final/   # 单词数据和图片资源
│   ├── words.json          # 单词数据
│   ├── phrases.json        # 短语数据
│   └── *.png               # 单词配图（204张）
└── server/                 # 后端服务
    ├── server.js           # Express API 服务
    └── package.json        # 依赖配置
```

## 📄 License

MIT
