# AI智能报价系统

一个基于AI的留学生服务报价网站，使用Gemini API自动生成个性化报价单。

## 在线演示

🚀 **快速部署**: 
- **Vercel**: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/HecreReed/ai-quote-website&root-directory=frontend)
- **Railway (后端)**: [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/ai-quote-website)

## 功能特性

- 🤖 **AI智能报价**: 基于Gemini API生成个性化报价
- 📄 **文档解析**: 支持PDF、DOCX、图片等文件格式
- 💰 **多级定价**: 根据客户类型、地区、价格偏好智能调整
- ⚡ **加急服务**: 支持当日/次日交付的加急选项
- 📊 **报价导出**: 一键导出精美的PDF报价单
- 📱 **响应式设计**: 完美适配PC和移动设备

## 技术栈

### 前端
- React 18 + TypeScript
- Vite (构建工具)
- Tailwind CSS (样式框架)
- React Dropzone (文件上传)
- jsPDF + html2canvas (PDF导出)
- Axios (HTTP客户端)

### 后端
- Node.js + Express + TypeScript
- Google Gemini API (AI服务)
- Multer (文件上传处理)
- pdf-parse (PDF解析)
- mammoth (DOCX解析)

## 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn
- Google Gemini API Key

### 安装与运行

1. **克隆项目**
```bash
git clone https://github.com/HecreReed/ai-quote-website.git
cd ai-quote-website
```

2. **安装依赖**
```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

3. **配置环境变量**

后端配置 (`backend/.env`):
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

前端配置 (`frontend/.env`):
```env
VITE_API_URL=http://localhost:3001
```

4. **启动服务**

```bash
# 启动后端服务
cd backend
npm run dev

# 新开终端，启动前端服务
cd frontend
npm run dev
```

5. **访问应用**
- 前端地址: http://localhost:5173
- 后端API: http://localhost:3001

## 项目结构

```
ai-quote-website/
├── frontend/                 # React前端应用
│   ├── src/
│   │   ├── components/      # React组件
│   │   ├── services/        # API服务
│   │   ├── types/          # TypeScript类型定义
│   │   └── ...
│   ├── public/
│   └── package.json
├── backend/                  # Node.js后端应用
│   ├── src/
│   │   ├── routes/         # 路由处理
│   │   ├── services/       # 业务逻辑
│   │   ├── types/          # TypeScript类型定义
│   │   └── server.ts       # 服务器入口
│   ├── uploads/            # 文件上传目录
│   └── package.json
└── README.md
```

## API接口

### 生成报价
- **POST** `/api/quotation/generate`
- **Content-Type**: `multipart/form-data`
- **参数**:
  - `customerType`: 客户类型 (domestic/international)
  - `clientType`: 客户身份 (student/individual/enterprise)
  - `pricePreference`: 价格偏好 (low/medium/high)
  - `taskDescription`: 任务描述
  - `wordCount`: 字数 (可选)
  - `deadline`: 交付时间
  - `isUrgent`: 是否加急 (boolean)
  - `urgentType`: 加急类型 (same_day/next_day)
  - `files`: 上传文件 (可选)
  - `additionalRequirements`: 其他要求 (可选)

### 健康检查
- **GET** `/api/quotation/health`
- **响应**: `{ "status": "OK", "service": "quotation" }`

### 获取Gemini API Key

1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 登录Google账号并创建新的API密钥
3. 将API密钥复制到环境变量中

> **注意**: Gemini API目前在某些地区可能需要科学上网才能访问

## 部署说明

### 前端部署

**推荐: Vercel (免费)**
1. 访问 [Vercel](https://vercel.com)
2. 导入GitHub仓库: `https://github.com/HecreReed/ai-quote-website`
3. 设置构建配置:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. 添加环境变量: `VITE_API_URL=your_backend_url`

**Netlify**
1. 访问 [Netlify](https://netlify.com)
2. 连接GitHub仓库
3. 设置:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`

### 后端部署

**推荐: Railway (免费额度)**
1. 访问 [Railway](https://railway.app)
2. 导入GitHub仓库
3. 设置环境变量:
   - `GEMINI_API_KEY`: 你的Gemini API密钥
   - `PORT`: Railway自动设置
   - `NODE_ENV`: production
   - `CORS_ORIGIN`: 你的前端域名

**Render**
1. 访问 [Render](https://render.com)
2. 创建Web Service
3. 设置:
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

### 环境变量配置
确保在生产环境中正确配置所有环境变量，特别是 `GEMINI_API_KEY`。

## 开发指南

### 添加新功能
1. 在 `types/` 目录中定义相关类型
2. 在 `services/` 目录中实现业务逻辑
3. 在 `components/` 目录中创建UI组件
4. 在 `routes/` 目录中添加API路由

### 文件上传支持
目前支持的文件格式:
- PDF文档
- Word文档 (.docx, .doc)
- 图片文件 (.png, .jpg, .jpeg, .gif)
- 最大文件大小: 10MB

### AI提示词定制
可以在 `backend/src/services/geminiService.ts` 中的 `buildPrompt` 方法中自定义AI提示词。

## 常见问题

### 1. Gemini API调用失败
- 检查API Key是否正确配置
- 确认网络连接正常
- 查看API配额是否充足

### 2. 文件上传失败
- 检查文件格式是否支持
- 确认文件大小不超过10MB
- 检查服务器磁盘空间

### 3. PDF导出异常
- 确保浏览器支持现代Web API
- 检查报价内容是否包含特殊字符
- 尝试刷新页面重新生成

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证。

## 联系方式

- **GitHub**: [HecreReed/ai-quote-website](https://github.com/HecreReed/ai-quote-website)
- **Issues**: [提交问题](https://github.com/HecreReed/ai-quote-website/issues)

---

> 💡 **提示**: 这是一个开源项目，欢迎贡献代码或提供建议！