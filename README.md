# ZenLog - Personal AI Blog System / 个人 AI 博客系统

[English](#english) | [中文](#chinese)

---

<a name="english"></a>
## English

ZenLog is a modern, minimalist personal blog platform built with React and Google Gemini API. It is not just a content showcase but a digital sanctuary integrated with AI creative assistance.

### 🌟 Core Features

- **Minimalist Design**: Responsive sidebar layout, fresh visual experience, focus on content.
- **AI-Powered**:
  - **Writing Assistant**: Enter a topic, and AI automatically generates a blog outline.
  - **Mood Analysis**: Automatically identifies diary content and matches it with a corresponding mood Emoji.
  - **Cover Generation**: Automatically generates minimalist cover photos based on post content.
- **Multi-language Support**: Seamless switching between Chinese and English.
- **Rich Media Display**: Includes long-form Thoughts, short Moments, and an Image/Video Gallery.
- **Management Console**: Integrated admin panel to manage blog content (CRUD).

### 🚀 Future Roadmap

1. **Database Integration**:
   - Currently uses `localStorage`. Plan to integrate Firebase or Supabase for cloud storage.
2. **Authentication**:
   - Add login verification for the admin console to ensure only the owner can edit content.
3. **Rich Text Editor**:
   - Introduce Markdown rendering or TipTap editor for richer content formatting.
4. **Comment System**:
   - Integrate Giscus or a custom comment module for visitor interaction.
5. **SEO Optimization**:
   - Use React Helmet to manage metadata for better search engine friendliness.

### 🛠️ Tech Stack

- **Frontend**: React 19, Tailwind CSS, React Router 7
- **AI**: Google Gemini SDK (@google/genai)
- **Icons**: Font Awesome 6
- **Build**: ESM-based modular loading

---

<a name="chinese"></a>
## 中文

ZenLog 是一个基于 React 和 Google Gemini API 构建的现代化、极简主义个人博客平台。它不仅是一个内容展示窗口，更是一个集成了 AI 创作辅助的数字避难所。

### 🌟 核心特性

- **极简设计**: 响应式侧边栏布局，清新的视觉体验，专注于内容。
- **AI 赋能**:
  - **创作助手**: 输入主题，AI 自动生成博客大纲。
  - **情绪分析**: 自动识别日记内容并匹配相应的心情 Emoji。
  - **封面生成**: 根据博文内容自动生成极简风格的封面图。
- **多语言支持**: 完美支持中英文无缝切换。
- **富媒体展示**: 包含长篇思考 (Thoughts)、短动态 (Moments) 以及图片/视频画廊 (Gallery)。
- **管理后台**: 集成的管理面板，支持增删改查博客内容。

### 🚀 后续开发计划

1. **数据库集成**:
   - 当前使用 `localStorage` 进行持久化。后续计划接入 Firebase 或 Supabase 实现真正的云端存储。
2. **身份验证**:
   - 增加管理后台的登录验证 (Auth)，确保只有博主可以编辑内容。
3. **富文本编辑器**:
   - 在后台引入 Markdown 渲染或 TipTap 编辑器，支持更丰富的内容排版。
4. **评论系统**:
   - 集成 Giscus 或自定义评论模块，增加访客互动。
5. **SEO 优化**:
   - 使用 React Helmet 管理元数据，提升搜索引擎友好度。

### 🛠️ 技术栈

- **前端**: React 19, Tailwind CSS, React Router 7
- **AI**: Google Gemini SDK (@google/genai)
- **图标**: Font Awesome 6
- **构建**: ESM 模块化加载
