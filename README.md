# H5 五子棋游戏

> 纯JavaScript ES6+ · 模块化架构 · Canvas渲染 · 无构建依赖

---

## 📌 项目简介

H5五子棋是一个完全使用原生JavaScript、HTML5和CSS3开发的五子棋游戏，无需任何构建工具或外部依赖。采用模块化API设计，代码清晰易懂，适合学习和二次开发。

### 核心特性

- ✅ **多种游戏模式**: PvP（双人对战）、PvE（人机对战）、EvE（AI演示）、VCF练习
- ✅ **智能AI系统**: 4级难度，支持VCF搜索和威胁序列分析
- ✅ **完整禁手规则**: 严格遵守五子棋规范（长连、三三、四四禁手）
- ✅ **存档回放功能**: 保存棋局、加载棋谱、回放对局
- ✅ **响应式设计**: 适配桌面和移动端
- ✅ **模块化架构**: 独立可测试的API模块

---

## 🚀 快速开始

### 环境要求

- 现代浏览器（Chrome 60+, Firefox 55+, Safari 12+）
- Python 3.x（用于本地开发服务器）

### 运行项目

```bash
# 克隆仓库
git clone <your-repo-url>
cd gomoku-game

# 启动本地服务器
python3 -m http.server 8080

# 浏览器访问
# http://localhost:8080
```

---

## 📊 开发进度

### 总体进度: 12.5% (1/8 阶段完成)

| 阶段 | 内容 | 状态 | 完成时间 |
|------|------|------|----------|
| **阶段0** | 环境准备 | ✅ 已完成 | 2025-01-20 |
| **阶段1** | 核心功能 | ⏳ 待开始 | - |
| **阶段2** | 规则完善 | ⏳ 待开始 | - |
| **阶段3** | AI系统 | ⏳ 待开始 | - |
| **阶段4** | 存档回放 | ⏳ 待开始 | - |
| **阶段5** | VCF练习 | ⏳ 待开始 | - |
| **阶段6** | UX优化 | ⏳ 待开始 | - |
| **阶段7** | 测试部署 | ⏳ 待开始 | - |

查看详细进度: [PROGRESS_LOG.md](./PROGRESS_LOG.md)

---

## 📁 项目结构

```
gomoku-game/
├── index.html              # 主页面
├── js/                     # JavaScript模块
│   ├── utils.js           # 工具函数模块 ✅
│   ├── game-core.js       # 游戏核心引擎 🚧
│   ├── board-renderer.js  # Canvas渲染器 🚧
│   ├── demo.js            # UI控制器 ✅
│   ├── ai-advanced.js     # 高级AI (待开发)
│   ├── game-save-load.js  # 存档管理 (待开发)
│   ├── game-replay.js     # 回放系统 (待开发)
│   └── vcf-practice.js    # VCF练习 (待开发)
├── css/                    # 样式文件
│   ├── style.css          # 主样式表 ✅
│   └── animations.css     # 动画样式 ✅
├── assets/                 # 静态资源 (预留)
├── doc/                    # 项目文档
│   ├── README.md          # 文档总览
│   ├── API_REFERENCE.md   # API参考
│   ├── ARCHITECTURE.md    # 架构设计
│   ├── GAME_RULES.md      # 游戏规则
│   └── ...
├── DEVELOPMENT_PLAN.md     # 开发计划
├── ACCEPTANCE_PLAN.md      # 验收方案
├── PROGRESS_LOG.md         # 进度日志
└── vercel.json             # 部署配置
```

**图例**:
- ✅ 已完成
- 🚧 开发中
- ⏳ 待开发

---

## 🎯 核心模块

### GameUtils - 工具模块

提供通用工具函数：消息提示、时间格式化、数据操作、LocalStorage等。

```javascript
// 示例
GameUtils.showMessage('落子成功', 'success');
GameUtils.formatTime(Date.now()); // "2025-01-20 12:34:56"
GameUtils.deepClone(obj); // 深拷贝对象
```

### GomokuGame - 游戏核心

管理棋盘状态、落子逻辑、胜负判定、禁手检测。

```javascript
// 示例 (Stage 1 将实现)
const game = new GomokuGame();
game.placePiece(7, 7);  // 落子
game.checkWin(7, 7);     // 检查胜负
game.checkForbidden(7, 7); // 检查禁手
```

### SimpleBoardRenderer - 渲染器

Canvas棋盘渲染、鼠标交互、动画效果。

```javascript
// 示例 (Stage 1 将实现)
const renderer = new SimpleBoardRenderer(canvas, game);
renderer.render(); // 渲染棋盘
```

### InterfaceDemo - UI控制器

协调各模块、处理用户交互、更新界面。

```javascript
// 自动初始化
// window.demoInstance 可用
```

---

## 📚 文档

### 开发文档

- [开发计划](./DEVELOPMENT_PLAN.md) - 详细的开发任务和时间规划
- [验收方案](./ACCEPTANCE_PLAN.md) - 分阶段验收标准和流程
- [进度日志](./PROGRESS_LOG.md) - 实时更新的开发进度
- [阶段0验收报告](./STAGE0_ACCEPTANCE.md) - 环境准备验收结果

### 技术文档

- [架构设计](./doc/ARCHITECTURE.md) - 系统架构和模块设计
- [API参考](./doc/API_REFERENCE.md) - 完整的API文档
- [游戏规则](./doc/GAME_RULES.md) - 五子棋规则和禁手算法
- [开发指南](./doc/DEVELOPMENT_GUIDE.md) - 编码规范和最佳实践

---

## 🔧 技术栈

- **前端**: 纯JavaScript ES6+
- **渲染**: HTML5 Canvas
- **样式**: CSS3
- **构建**: 无（零依赖）
- **部署**: Vercel / GitHub Pages

---

## 📈 性能指标

| 指标 | 目标 | 当前 |
|------|------|------|
| 页面加载 | <2s | ✅ ~1s |
| Canvas渲染 | ≥60fps | 🚧 待测 |
| AI响应 | <3s | 🚧 待开发 |
| 内存占用 | <50MB | 🚧 待测 |

---

## 🎮 游戏模式

### PvP - 双人对战 (待开发)
两名玩家轮流落子，体验传统五子棋对局。

### PvE - 人机对战 (待开发)
与AI对战，支持4种难度：
- **BEGINNER** - 新手（随机落子）
- **NORMAL** - 普通（基础评分）
- **HARD** - 困难（威胁序列）
- **HELL** - 地狱（VCF搜索）

### EvE - AI演示 (待开发)
观看两个AI自动对弈。

### VCF练习 (待开发)
40道VCF题库，分4个难度等级，提升连续冲四技巧。

---

## 🛠️ 开发规范

### 命名约定

- 类名: `PascalCase` (如: `GomokuGame`)
- 函数/方法: `camelCase` (如: `placePiece`)
- 常量: `UPPER_SNAKE_CASE` (如: `BOARD_SIZE`)
- CSS类: `kebab-case` (如: `game-board`)

### API返回值规范

```javascript
// 成功
{ success: true, data: any }

// 失败
{ success: false, error: string, code: string }
```

### 模块加载顺序

```
utils.js → game-core.js → ai-advanced.js → board-renderer.js → 
game-save-load.js → game-replay.js → vcf-practice.js → demo.js
```

---

## 📝 更新日志

### v0.1.0 (2025-01-20) - Stage 0 完成

**新增**:
- ✅ 项目目录结构
- ✅ index.html 页面骨架
- ✅ GameUtils 工具模块
- ✅ GomokuGame 核心引擎骨架
- ✅ SimpleBoardRenderer 渲染器骨架
- ✅ InterfaceDemo UI控制器
- ✅ 基础CSS样式
- ✅ 开发文档和计划

**验收**:
- ✅ 环境准备阶段验收通过
- ✅ Python HTTP服务器正常运行
- ✅ 所有模块正确加载
- ✅ 控制台无错误

---

## 👥 贡献指南

本项目目前由AI团队独立开发，遵循严格的阶段化开发流程。

### 开发流程

1. 查看 [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) 了解当前阶段
2. 查看 [PROGRESS_LOG.md](./PROGRESS_LOG.md) 了解实时进度
3. 每个阶段完成后进行验收
4. 记录验收结果到 [ACCEPTANCE_PLAN.md](./ACCEPTANCE_PLAN.md)

---

## 📄 许可证

（待添加）

---

## 🔗 相关链接

- [在线演示](#) (待部署)
- [文档站点](./doc/README.md)
- [问题反馈](#)

---

## ✨ 致谢

感谢所有为五子棋算法和规则研究做出贡献的开发者和棋手。

---

**当前版本**: v0.1.0 (Stage 0)  
**最后更新**: 2025-01-20  
**开发团队**: AI Development Team
