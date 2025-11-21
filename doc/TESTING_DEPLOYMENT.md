# 测试与部署指南

> **版本**: v2.0.0  
> **来源**: 《08_测试与部署指南.md》  
> **✨ 新增**: Vercel 部署支持

[映射到原文档]

详细内容请参考: `08_测试与部署指南.md`

---

## 快速参考

### 功能测试清单
- [ ] 基础游戏功能（§1.1）
- [ ] 禁手规则（§1.1）
- [ ] AI系统（§1.1）
- [ ] 游戏模式（§1.1）
- [ ] 存档回放（§1.1）
- [ ] VCF练习（§1.1）

---

## 部署方案

### 🚀 方案1: Vercel 部署（推荐）

**优势**:
- ✅ 零配置，自动部署
- ✅ 全球 CDN 加速
- ✅ 自动 HTTPS
- ✅ 支持自定义域名
- ✅ 无需构建步骤

**快速部署**:

#### 方式A: 通过 Vercel CLI
```bash
# 1. 安装 Vercel CLI（仅首次）
npm i -g vercel

# 2. 登录 Vercel
vercel login

# 3. 部署项目
cd gomoku-game
vercel

# 4. 生产环境部署
vercel --prod
```

#### 方式B: 通过 Vercel 网站（最简单）
1. 访问 [vercel.com](https://vercel.com)
2. 点击 "Import Project"
3. 导入 GitHub 仓库
4. 保持默认配置
5. 点击 "Deploy"

#### 方式C: 拖放部署
1. 访问 [vercel.com/new](https://vercel.com/new)
2. 直接拖拽项目文件夹到页面
3. 自动部署

**配置说明**:
- **Framework Preset**: Other (或留空)
- **Root Directory**: `./` (项目根目录)
- **Build Command**: 留空（无需构建）
- **Output Directory**: `./` (当前目录)
- **Install Command**: 留空（无需安装依赖）

**部署后访问**:
```
https://your-project-name.vercel.app
```

**⚠️ 重要提醒**:
1. ✅ 项目根目录已包含 `vercel.json` 配置文件
2. ✅ 所有文件路径使用相对路径（`js/xxx.js` 而非 `/js/xxx.js`）
3. ✅ 无需构建步骤，Vercel 会直接托管静态文件
4. ✅ 自动启用 HTTPS 和全球 CDN
5. ✅ 支持 LocalStorage（浏览器本地存储）
6. ⚠️ 确保 `index.html` 在项目根目录

**常见问题**:
- **Q**: 部署后页面空白？
  - **A**: 检查浏览器控制台，确认所有JS文件路径正确（使用相对路径）
- **Q**: LocalStorage 数据丢失？
  - **A**: LocalStorage 是浏览器本地存储，不会因部署而丢失，但换浏览器/设备会丢失
- **Q**: 如何自定义域名？
  - **A**: 在 Vercel 项目设置中添加自定义域名，配置 DNS 解析

---

### 📦 方案2: GitHub Pages
```bash
git init
git add .
git commit -m "Initial commit"
git push -u origin main
# Settings → Pages → Source: main branch
```

---

### 💻 方案3: 本地测试
```bash
python3 -m http.server 8080
# 访问 http://localhost:8080
```

---

## 性能指标

| 指标 | 目标 |
|------|------|
| 首屏加载 | < 3秒 |
| Canvas FPS | ≥ 60 |
| AI思考时间 | BEGINNER <0.5s, HELL <3s |
| 内存占用 | < 50MB |

---

## 兼容性测试

| 浏览器 | 版本 | 状态 |
|--------|------|------|
| Chrome | 60+ | ✅ 主要支持 |
| Firefox | 55+ | ✅ 完全兼容 |
| Safari | 12+ | ✅ 需测试 |
| Edge | 79+ | ✅ Chromium |
| IE11 | - | ❌ 不支持 |

---

**详细指南**: 参见 `08_测试与部署指南.md`
