# 更新日志

本项目所有重要的更改都会记录在这个文件中。

本项目遵循 [语义化版本](https://semver.org/zh-CN/) 规范。

---

## [6.0.0] - 2025-01-23

### 新增 (Added)

#### 设置系统 ⚙️
- **设置模态框**: 完整的设置面板UI
  - 显示坐标开关：在棋盘上显示坐标标识（A-O, 1-15）
  - 动画效果开关：全局启用/禁用所有动画和过渡效果
  - 音效开关：音效功能占位（暂未实现）
  - 自动提示禁手：在可能的禁手位置显示红色标记
- **设置持久化**: LocalStorage自动保存和加载设置
- **设置管理**: 保存设置、恢复默认值功能
- **实时应用**: 设置变更立即生效

#### 帮助系统 ❓
- **帮助模态框**: 完整的帮助文档UI
  - 📖 游戏规则：五子棋基本规则说明
  - ⚖️ 禁手规则：详细的黑方禁手规则（长连、三三、四四）
  - 🎮 游戏模式：四种模式介绍（PvP/PvE/EvE/VCF练习）
  - 🤖 AI难度：四个AI难度等级说明
  - 🎯 VCF练习模式：VCF题库和练习说明
  - ⌨️ 快捷功能：提示、悔棋、存档、回放功能说明
  - 📱 关于项目：技术栈和项目特色介绍
- **响应式设计**: 移动端和桌面端自适应布局

#### 响应式优化 📱
- **触摸事件支持**: 完整的触摸屏交互
  - touchstart、touchmove、touchend、touchcancel事件处理
  - 触摸位置精确计算
  - 防止默认滚动行为
- **移动端布局优化**: 模态框在移动端全屏显示
- **更好的字体和按钮尺寸**: 自适应显示

#### 坐标显示功能
- **棋盘坐标**: 在棋盘边缘显示坐标（横向A-O，纵向1-15）
- **动态切换**: 通过设置开关控制显示/隐藏
- **渲染优化**: 集成到Canvas渲染流程

### 修改 (Changed)

#### 模块升级
- **demo.js**: v5.0.0 → v6.0.0（+250行）
  - 新增设置系统完整逻辑
  - 新增帮助系统模态框管理
  - 新增设置加载/保存/应用方法
  - 新增模态框打开/关闭动画
  - 完整的设置项管理（4个设置选项）
- **board-renderer.js**: v2.0.0 → v2.1.0（+80行）
  - 新增触摸事件支持
  - 新增坐标显示功能（drawCoordinates方法）
  - 新增setShowCoordinates、setAutoForbiddenHint方法
  - 新增updateLayout方法支持动态调整布局
  - 优化事件处理器结构
- **index.html**: v5.0.0 → v6.0.0（+140行）
  - 新增设置模态框UI
  - 新增帮助模态框UI
  - Footer新增设置和帮助按钮
  - 更新版本信息
- **style.css**: +200行
  - 新增模态框样式系统
  - 新增设置项样式
  - 新增帮助文档样式
  - Footer链接按钮样式
  - 移动端响应式优化
- **animations.css**: +5行
  - 新增.no-animations类支持禁用动画

### 技术细节 (Technical)

#### 设置系统架构
```javascript
// 设置数据结构
{
  showCoordinates: false,      // 显示坐标
  enableAnimations: true,      // 启用动画
  soundEnabled: false,         // 音效（占位）
  autoForbiddenHint: true     // 自动禁手提示
}

// 设置流程
加载设置 → 应用到UI → 用户修改 → 保存到LocalStorage → 实时生效
```

#### 模态框系统
- 淡入淡出动画（modalFadeIn/modalFadeOut）
- 点击遮罩层关闭
- ESC键关闭（可扩展）
- 优雅的closing动画

#### 触摸事件处理
- 检测event.touches获取触摸坐标
- passive: false允许preventDefault
- 统一handlePlacement和updateHoverPosition逻辑
- 触摸结束自动清除悬停状态

### ✅ 已完成 (Completed)

- ✅ 设置系统完全可用
- ✅ 帮助文档完整详尽
- ✅ 模态框动画流畅自然
- ✅ 设置持久化正常工作
- ✅ 触摸事件支持完善
- ✅ 响应式布局优化
- ✅ 坐标显示功能正常
- ✅ 动画开关正确工作

### 验收状态
- ✅ 设置面板可正常打开/关闭
- ✅ 所有设置选项正常工作
- ✅ 设置保存后刷新页面仍生效
- ✅ 帮助文档内容完整清晰
- ✅ 移动端触摸操作流畅
- ✅ 响应式布局在各尺寸下表现良好
- ✅ 无横向滚动条
- ✅ 模态框动画自然流畅

---

## [5.0.0] - 2025-01-22

### 新增 (Added)

#### VCF练习模式 ✨
- **40道VCF题库**: 完整的VCF（Victory by Continuous Four）练习题库
  - Level 1 入门：10道题（2-3步必胜）
  - Level 2 初级：10道题（3-4步必胜）
  - Level 3 中级：10道题（5-7步必胜）
  - Level 4 高级：10道题（8-12步必胜）
- **VCFPracticeManager类**: 新增VCF练习管理器模块
  - 题目加载和管理
  - 走法验证系统
  - 进度追踪和LocalStorage持久化
  - 随机题目选择算法
  - 详细的题目描述和提示系统
- **VCF练习UI**: 新增专用的VCF练习界面
  - VCF模式按钮
  - 难度选择器（Level 1-4）
  - VCF操作按钮组（开始、重新开始、提示、解法）
  - VCF状态卡片（题目信息、进度显示、提示面板）
  - HUD自动更新（下一关键点、提示、完成度）
- **VCF交互逻辑**: 完整的练习体验
  - Canvas点击捕获 + 自定义落子处理
  - 走法验证 + 错误提示 + 正确反馈
  - AI自动防守、连锁响应与自动跳题
  - 按钮状态管理、模式切换、控件显示/隐藏
- **进度统计**: 完整的进度追踪系统
  - 分难度统计完成情况
  - 总体完成度百分比
  - 进度持久化保存

#### 增强功能
- InterfaceDemo类完整集成VCF模式
  - 9个VCF专用方法（startVCFPuzzle、restartVCFPuzzle、handleVCFPracticeMove等）
  - VCF模式切换逻辑（updateVCFVisibility）
  - 完整的Canvas点击事件拦截
- VCF专用CSS样式系统（~160行）
  - vcf-status-card：美观的状态卡片样式
  - vcf-metrics：数据指标展示
  - vcf-hint-box：提示框样式
  - vcf-badge：难度徽章
  - 响应式适配

### 修改 (Changed)

#### 模块升级
- **demo.js**: v4.0.0 → v5.0.0（+250行）
  - 完整VCF模式实现（9个方法）
  - VCF UI显示/隐藏逻辑
  - Canvas点击事件拦截（capture phase）
  - 模式切换逻辑增强
  - 更新依赖列表包含VCFPracticeManager
- **index.html**: 版本 v4.0.0 → v5.0.0（+80行）
  - 新增VCF相关UI元素
  - 新增VCF控制按钮组
  - 新增VCF状态卡片组件
  - 更新模块加载顺序包含vcf-practice.js
  - 更新footer版本信息
- **style.css**: 新增VCF专用样式（+160行）
  - vcf-level-wrapper样式
  - vcf-actions按钮组样式
  - vcf-status-card卡片样式
  - vcf-metrics指标样式
  - vcf-hint-box提示框样式

#### UI改进
- 模式选择新增"VCF练习"按钮
- VCF难度选择器（Level 1-4）
- VCF状态卡片完整展示
- 模式切换时自动显示/隐藏相关UI
- VCF模式下隐藏存档回放控件

### 技术细节 (Technical)

#### 新增文件
- `js/vcf-practice.js`: VCF练习管理器（~1100行）
- `CHANGELOG.md`: 项目更新日志文档

#### 模块依赖关系
```
VCFPracticeManager
  └── GameUtils (LocalStorage, 工具函数)

InterfaceDemo
  ├── ...
  └── VCFPracticeManager (VCF练习)
```

#### 数据结构
**题目数据格式**:
```javascript
{
  id: 'L1-01',                    // 题目ID
  level: 1,                       // 难度等级
  name: '简单冲四',               // 题目名称
  description: '...',             // 题目描述
  initialState: [...],            // 初始局面
  solution: [...],                // 正确走法序列
  hints: [...]                   // 提示列表
}
```

**进度数据格式**:
```javascript
{
  completed: {                    // 已完成题目Map
    'L1-01': true,
    ...
  },
  totalCompleted: 15,             // 总完成数
  byLevel: {                      // 分难度统计
    1: 10, 2: 5, 3: 0, 4: 0
  }
}
```

### ✅ 已完成 (Completed)

- ✅ VCF题库完整（40道题，4个难度）
- ✅ VCF管理器模块完整实现
- ✅ 数据验证和进度保存功能正常
- ✅ UI完整集成和交互逻辑实现
- ✅ VCF专用CSS样式完成
- ✅ 模式切换和UI显示/隐藏逻辑
- ✅ 走法验证和AI自动防守
- ✅ 题目完成检测和自动跳转

### 验收状态
- ✅ VCF练习模式完全可用
- ✅ 40道题目全部可以练习
- ✅ 进度追踪正常工作
- ✅ UI交互流畅自然
- ✅ CSS样式美观一致

---

## [4.0.0] - 2025-01-20

### 新增 (Added)

#### 存档回放系统 ✨
- **GameSaveLoad类**: 完整的存档管理系统
  - 保存游戏为JSON文件
  - 从JSON文件加载游戏
  - 自动保存功能（LocalStorage）
  - 数据验证和错误处理
- **GameReplay类**: 完整的回放系统
  - 播放/暂停/停止控制
  - 单步前进/后退
  - 跳转到指定步骤
  - 速度调节（0.5x-3x）
  - 进度条拖动
- **存档回放UI**: 完整的用户界面
  - 保存/加载/自动保存按钮
  - 回放控制器（类似视频播放器）
  - 进度条和进度显示
  - 速度选择器

#### 增强功能
- 游戏数据导入/导出
- 对局历史记录保存
- 回放状态回调系统
- 回放模式下禁用落子

### 修改 (Changed)

#### 模块升级
- **game-core.js**: v3.0.0 → v4.0.0
  - 新增`setGameMode()`和`getGameMode()`方法
- **demo.js**: v3.0.0 → v4.0.0
  - 集成存档管理器
  - 集成回放管理器
  - 新增存档/回放相关方法
  - 优化控制按钮状态管理
- **index.html**: 版本 v3.0.0 → v4.0.0
  - 新增存档按钮组
  - 新增回放控制器
  - 新增进度条
  - 更新模块加载顺序

### 技术细节
- 数据格式：完整的游戏状态序列化
- 兼容性：支持版本号验证
- 性能：回放流畅度达到60fps

---

## [3.0.0] - 2025-01-20

### 新增 (Added)

#### AI系统 🤖
- **AI难度系统**: 4级智能AI
  - BEGINNER（新手）：随机落子
  - NORMAL（普通）：基础评分算法
  - HARD（困难）：高级评分+威胁分析
  - HELL（地狱）：极限搜索+VCF
- **AdvancedAI类**: 高级AI决策引擎（预留）
- **AI评分系统**: 完整的局面评分算法
  - 五连、活四、冲四、活三等棋型识别
  - 进攻防守平衡
  - 位置权重评估

#### 游戏模式
- **PvE模式**: 人机对战
- **EvE模式**: AI演示对局
- **AI难度选择器**: UI控件

### 修改 (Changed)
- **game-core.js**: v2.0.0 → v3.0.0
  - 新增`getAIMove()`方法
  - 新增`getAIMoveNormal()`等AI算法
  - 新增`evaluatePosition()`局面评估
  - 新增`findPattern()`棋型识别
- **demo.js**: v2.0.0 → v3.0.0
  - 新增`executeAIMove()`异步AI执行
  - 新增模式切换逻辑
  - 新增AI难度管理
  - AI思考状态显示

---

## [2.0.0] - 2025-01-20

### 新增 (Added)

#### 禁手规则系统 ⚖️
- **完整禁手检测**: 严格遵守五子棋规范
  - 长连禁手（≥6子）
  - 三三禁手（两个或以上活三）
  - 四四禁手（两个或以上冲四）
- **五连优先**: 五连判胜优先于禁手
- **仅黑方禁手**: 白方不受限制
- **禁手可视化**: 红色圆圈+叉号高亮

#### 棋盘增强
- **天元标记**: 棋盘中心点特殊标记
- **星位标记**: 四个角和中心的星位
- **悬停预览**: 半透明棋子预览
- **胜利线高亮**: 黄色线条标记获胜五子

### 修改 (Changed)
- **game-core.js**: v1.0.0 → v2.0.0
  - 新增`checkForbidden()`禁手检测
  - 新增`checkLongLine()`长连检测
  - 新增`countOpenThrees()`活三统计
  - 新增`countOpenFours()`冲四统计
  - 修改`placePiece()`集成禁手逻辑
- **board-renderer.js**: v1.0.0 → v2.0.0
  - 新增`drawForbiddenHighlight()`禁手高亮
  - 新增`highlightForbiddenPosition()`禁手标记
  - 优化`drawWinHighlight()`胜利线显示
  - 优化星位和天元绘制

---

## [1.0.0] - 2025-01-20

### 新增 (Added)

#### 核心游戏功能 🎮
- **GomokuGame类**: 完整的游戏逻辑引擎
  - 15x15棋盘初始化
  - 落子验证（边界、占用、状态）
  - 五连判胜算法（四方向检测）
  - 悔棋功能
  - 历史记录（含时间戳）
  - 游戏状态管理
- **SimpleBoardRenderer类**: Canvas渲染系统
  - 棋盘网格绘制
  - 棋子绘制（光泽效果）
  - 鼠标交互（点击/悬停）
  - 坐标转换（Canvas↔Board）
  - 胜利线高亮
- **InterfaceDemo类**: UI控制器
  - 新游戏/悔棋按钮
  - 状态面板（当前玩家、步数）
  - 依赖检查
  - 事件绑定
  - 游戏流程控制
- **GameUtils类**: 工具模块
  - 消息提示系统（4种类型+动画）
  - 时间格式化
  - 数据深拷贝
  - 坐标验证
  - LocalStorage操作
  - JSON文件下载

#### UI/UX
- **响应式布局**: 适配桌面/平板/手机
- **渐变背景**: 紫色系渐变
- **卡片式设计**: 白色圆角卡片
- **动画效果**: 按钮悬停、消息滑入滑出
- **消息提示**: 4种类型（success/error/warning/info）

---

## [0.1.0] - 2025-01-20

### 新增 (Added)
- 项目初始化
- 目录结构搭建
- 开发文档（DEVELOPMENT_PLAN.md, ACCEPTANCE_PLAN.md, PROGRESS_LOG.md）
- HTML骨架（index.html）
- 基础CSS样式（style.css, animations.css）
- .gitignore配置
- vercel.json部署配置

---

## 版本号说明

本项目使用 [语义化版本](https://semver.org/zh-CN/) 格式：`主版本号.次版本号.修订号`

- **主版本号(X)**：大的里程碑阶段完成（Stage完成）
- **次版本号(Y)**：新增功能或重要特性
- **修订号(Z)**：Bug修复和小的改进

### 版本历史
- `6.0.0` - Stage 6: UX优化（设置、帮助、响应式）
- `5.0.0` - Stage 5: VCF练习模式
- `4.0.0` - Stage 4: 存档回放系统
- `3.0.0` - Stage 3: AI智能系统
- `2.0.0` - Stage 2: 禁手规则
- `1.0.0` - Stage 1: 核心功能
- `0.1.0` - Stage 0: 环境准备

---

## 链接

- [项目主页](./README.md)
- [开发计划](./DEVELOPMENT_PLAN.md)
- [进度日志](./PROGRESS_LOG.md)
- [技术文档](./doc/README.md)
