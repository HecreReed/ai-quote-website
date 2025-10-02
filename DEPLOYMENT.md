# GitHub部署指南

## 创建GitHub仓库并推送代码

1. **在GitHub上创建新仓库**
   - 访问 https://github.com/new
   - 仓库名: `ai-quote-website`
   - 设为Public
   - 不要初始化README（我们已经有了）

2. **关联远程仓库并推送**
```bash
# 在项目根目录执行
git remote add origin https://github.com/YOUR_USERNAME/ai-quote-website.git
git branch -M main
git push -u origin main
```

## 部署说明

### 前端部署 (Vercel/Netlify)

**Vercel部署:**
1. 访问 https://vercel.com
2. 导入GitHub仓库
3. 设置构建配置:
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

**Netlify部署:**
1. 访问 https://netlify.com
2. 从Git导入项目
3. 设置构建配置:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`

### 后端部署 (Railway/Render)

**Railway部署:**
1. 访问 https://railway.app
2. 连接GitHub仓库
3. 添加环境变量:
   - `GEMINI_API_KEY`: 你的Gemini API密钥
   - `PORT`: 3001
   - `NODE_ENV`: production

**Render部署:**
1. 访问 https://render.com
2. 创建新的Web Service
3. 连接GitHub仓库
4. 设置:
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

### 环境变量配置

确保在部署平台设置以下环境变量:

**后端:**
- `GEMINI_API_KEY`: 从Google AI Studio获取
- `PORT`: 通常由平台自动设置
- `NODE_ENV`: production
- `CORS_ORIGIN`: 前端域名

**前端:**
- `VITE_API_URL`: 后端API地址

## 本地开发

1. **启动后端:**
```bash
cd backend
cp .env.example .env
# 编辑 .env 文件，添加你的 GEMINI_API_KEY
npm install
npm run dev
```

2. **启动前端:**
```bash
cd frontend
npm install
npm run dev
```

3. **访问应用:**
- 前端: http://localhost:5173
- 后端: http://localhost:3001

## 获取Gemini API Key

1. 访问 https://makersuite.google.com/app/apikey
2. 创建新的API密钥
3. 将密钥添加到环境变量中

## 注意事项

- 确保Gemini API配额充足
- 生产环境中要设置正确的CORS域名
- 定期备份上传的文件
- 监控API使用量和成本