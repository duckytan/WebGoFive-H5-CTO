# 系统架构设计文档

> **版本**: v2.0.0  
> **文档类型**: AI开发文档 - 架构设计  
> **最后更新**: 2025年1月

---

## 📌 架构概述

H5五子棋采用**模块化API架构**，基于事件驱动设计，所有核心功能模块化为独立的API单元，支持同步和异步调用，便于集成、测试和扩展。

### 核心设计原则

1. **模块独立性**: 每个模块都是独立的API单元，可单独使用
2. **接口一致性**: 统一的API设计模式，易于学习和使用
3. **异步优先**: 关键操作支持异步调用，提升用户体验
4. **事件解耦**: 使用事件系统实现模块间松耦合
5. **状态可追溯**: 完整的状态管理和历史记录
6. **错误可控**: 统一的错误处理和恢复机制

---

## 🏗️ 系统分层架构

```
┌─────────────────────────────────────────────────────────┐
│                    UI Layer (UI层)                        │
│          demo.js - 界面控制和用户交互                      │
└───────────────────────┬─────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
┌───────▼───────┐ ┌────▼─────┐ ┌──────▼───────┐
│  Rendering    │ │   Core   │ │  Auxiliary   │
│   (渲染层)     │ │  (核心层) │ │   (辅助层)    │
│               │ │          │ │              │
│ BoardRenderer │ │ GameCore │ │ SaveLoad     │
│               │ │    AI    │ │ Replay       │
│               │ │          │ │ VCF          │
└───────┬───────┘ └────┬─────┘ └──────┬───────┘
        │              │               │
        └──────────────┼───────────────┘
                       │
            ┌──────────▼──────────┐
            │   Foundation Layer   │
            │   (基础设施层)        │
            │     Utils            │
            │  Event System        │
            │  State Manager       │
            └─────────────────────┘
```

---

## 🔧 模块化API设计

### 1. API模块定义规范

每个模块都遵循统一的API模块规范：

```javascript
/**
 * API模块标准结构
 */
class ModuleAPI {
    /**
     * 构造函数 - 依赖注入
     * @param {Object} options - 配置选项
     * @param {Object} dependencies - 依赖模块
     */
    constructor(options = {}, dependencies = {}) {
        this.options = options;
        this.dependencies = dependencies;
        this.eventEmitter = new EventEmitter();
        this.state = this.initState();
        
        this._validateDependencies();
        this._initModule();
    }
    
    /**
     * [Sync] 同步API示例
     * @returns {Object} 返回结果
     */
    syncMethod() {
        try {
            // 同步处理逻辑
            return { success: true, data: result };
        } catch (error) {
            return this._handleError(error);
        }
    }
    
    /**
     * [Async] 异步API示例
     * @returns {Promise<Object>} 返回Promise
     */
    async asyncMethod() {
        try {
            // 异步处理逻辑
            const result = await this._asyncOperation();
            return { success: true, data: result };
        } catch (error) {
            return this._handleError(error);
        }
    }
    
    /**
     * 事件监听
     * @param {string} event - 事件名称
     * @param {Function} handler - 事件处理函数
     * @returns {this} 支持链式调用
     */
    on(event, handler) {
        this.eventEmitter.on(event, handler);
        return this;
    }
    
    /**
     * 触发事件
     * @param {string} event - 事件名称
     * @param {Object} data - 事件数据
     */
    emit(event, data) {
        this.eventEmitter.emit(event, data);
    }
    
    /**
     * 获取模块信息
     * @returns {Object} 模块信息
     */
    getModuleInfo() {
        return {
            name: 'ModuleAPI',
            version: '2.0.0',
            dependencies: ['dependency1', 'dependency2'],
            apiVersion: '2.0'
        };
    }
}

// 模块导出
if (typeof window !== 'undefined') {
    window.ModuleAPI = ModuleAPI;
}
```

### 2. API返回值规范

所有API方法必须返回统一格式：

```javascript
// 成功返回
{
    success: true,
    data: any,              // 返回数据
    timestamp: number,      // 时间戳（可选）
    metadata: Object        // 元数据（可选）
}

// 失败返回
{
    success: false,
    error: string,          // 错误描述
    code: string,           // 错误码
    details: Object,        // 详细信息（可选）
    stack: string           // 堆栈信息（开发模式）
}
```

### 3. 错误码系统

```javascript
const ERROR_CODES = {
    // 通用错误 (1xxx)
    UNKNOWN_ERROR: '1000',
    INVALID_PARAM: '1001',
    MODULE_NOT_READY: '1002',
    
    // 游戏逻辑错误 (2xxx)
    INVALID_POSITION: '2001',
    POSITION_OCCUPIED: '2002',
    FORBIDDEN_MOVE: '2003',
    GAME_FINISHED: '2004',
    
    // AI错误 (3xxx)
    AI_TIMEOUT: '3001',
    AI_NO_MOVE: '3002',
    
    // 存档错误 (4xxx)
    SAVE_FAILED: '4001',
    LOAD_FAILED: '4002',
    INVALID_DATA: '4003',
    
    // 网络错误 (5xxx) - 预留
    NETWORK_ERROR: '5001'
};
```

---

## 📦 核心模块详解

### 模块1: GameCore (游戏核心引擎)

**职责**: 游戏规则、状态管理、数据持久化

**公共API**:

```javascript
class GomokuGame {
    // === 生命周期管理 ===
    
    /**
     * [Sync] 初始化游戏
     * @returns {this} 支持链式调用
     */
    init() { }
    
    /**
     * [Sync] 重置游戏
     * @returns {this} 支持链式调用
     */
    reset() { }
    
    /**
     * [Sync] 销毁游戏实例
     */
    destroy() { }
    
    // === 游戏操作 ===
    
    /**
     * [Sync] 落子
     * @param {number} x - X坐标 (0-14)
     * @param {number} y - Y坐标 (0-14)
     * @returns {Object} 落子结果
     */
    placePiece(x, y) { }
    
    /**
     * [Sync] 悔棋
     * @param {number} steps - 悔棋步数，默认1
     * @returns {Object} 悔棋结果
     */
    undo(steps = 1) { }
    
    // === 游戏规则 ===
    
    /**
     * [Sync] 检查胜负
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     * @returns {Object} 胜负结果
     */
    checkWin(x, y) { }
    
    /**
     * [Sync] 检查禁手
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     * @returns {Object} 禁手结果
     */
    checkForbidden(x, y) { }
    
    // === 状态查询 ===
    
    /**
     * [Sync] 获取棋盘状态
     * @param {boolean} clone - 是否返回副本，默认true
     * @returns {Array} 棋盘二维数组
     */
    getBoardState(clone = true) { }
    
    /**
     * [Sync] 获取游戏状态
     * @returns {Object} 游戏状态对象
     */
    getGameState() { }
    
    /**
     * [Sync] 获取历史记录
     * @returns {Array} 落子历史
     */
    getMoves() { }
    
    // === 模式控制 ===
    
    /**
     * [Sync] 设置游戏模式
     * @param {string} mode - 游戏模式: 'PvP', 'PvE', 'EvE', 'VCF_PRACTICE'
     * @returns {this} 支持链式调用
     */
    setMode(mode) { }
    
    /**
     * [Sync] 设置AI难度
     * @param {string} difficulty - AI难度: 'BEGINNER', 'NORMAL', 'HARD', 'HELL'
     * @returns {this} 支持链式调用
     */
    setDifficulty(difficulty) { }
    
    // === 数据导入导出 ===
    
    /**
     * [Sync] 导出游戏数据
     * @returns {Object} 游戏数据
     */
    exportData() { }
    
    /**
     * [Sync] 导入游戏数据
     * @param {Object} data - 游戏数据
     * @returns {Object} 导入结果
     */
    loadFromData(data) { }
    
    // === 事件 ===
    
    /**
     * 事件: piecePlace - 落子事件
     * @event piecePlace
     * @param {Object} data - {x, y, player, timestamp}
     */
    
    /**
     * 事件: gameOver - 游戏结束事件
     * @event gameOver
     * @param {Object} data - {winner, reason, winLine}
     */
    
    /**
     * 事件: stateChange - 状态变化事件
     * @event stateChange
     * @param {Object} data - {oldState, newState}
     */
}
```

### 模块2: AI (人工智能)

**职责**: AI决策、算法实现

**公共API**:

```javascript
class AdvancedAI {
    /**
     * [Sync] 获取AI移动（同步版本，可能阻塞）
     * @param {string} difficulty - AI难度
     * @returns {Object} 移动坐标 {x, y, score, reason}
     */
    getMove(difficulty) { }
    
    /**
     * [Async] 获取AI移动（异步版本，推荐）
     * @param {string} difficulty - AI难度
     * @param {Object} options - 配置选项
     * @returns {Promise<Object>} 移动坐标
     */
    async getMoveAsync(difficulty, options = {}) { }
    
    /**
     * [Async] 分析棋盘形势
     * @returns {Promise<Object>} 形势分析结果
     */
    async analyzeSituation() { }
    
    /**
     * [Sync] 获取提示
     * @param {string} difficulty - 提示强度
     * @returns {Object} 提示坐标
     */
    getHint(difficulty = 'NORMAL') { }
    
    /**
     * [Async] VCF搜索
     * @param {number} player - 玩家
     * @param {number} maxDepth - 最大深度
     * @returns {Promise<Object>} VCF结果
     */
    async searchVCF(player, maxDepth = 10) { }
}
```

### 模块3: BoardRenderer (棋盘渲染器)

**职责**: Canvas渲染、用户交互

**公共API**:

```javascript
class SimpleBoardRenderer {
    /**
     * [Sync] 渲染棋盘
     * @param {boolean} force - 强制重绘
     */
    render(force = false) { }
    
    /**
     * [Sync] 高亮位置
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     * @param {Object} options - 高亮选项
     */
    highlightPosition(x, y, options = {}) { }
    
    /**
     * [Sync] 清除高亮
     */
    clearHighlight() { }
    
    /**
     * [Sync] 启用/禁用交互
     * @param {boolean} enabled - 是否启用
     */
    setInteractive(enabled) { }
    
    /**
     * [Sync] 设置主题
     * @param {string} theme - 主题名称
     */
    setTheme(theme) { }
}
```

### 模块4: GameSaveLoad (存档管理)

**职责**: 棋局保存、加载

**公共API**:

```javascript
class GameSaveLoad {
    /**
     * [Async] 保存游戏
     * @param {string} filename - 文件名（可选）
     * @returns {Promise<Object>} 保存结果
     */
    async saveGame(filename) { }
    
    /**
     * [Async] 加载游戏
     * @param {File} file - 文件对象
     * @returns {Promise<Object>} 加载结果
     */
    async loadGame(file) { }
    
    /**
     * [Async] 自动保存
     * @returns {Promise<Object>} 保存结果
     */
    async autoSave() { }
    
    /**
     * [Async] 恢复自动保存
     * @returns {Promise<Object>} 恢复结果
     */
    async restoreAutoSave() { }
}
```

### 模块5: GameReplay (回放系统)

**职责**: 棋局回放

**公共API**:

```javascript
class GameReplay {
    /**
     * [Async] 开始回放
     * @param {Object} data - 游戏数据
     * @returns {Promise<Object>} 结果
     */
    async startReplay(data) { }
    
    /**
     * [Sync] 播放/暂停
     */
    togglePlay() { }
    
    /**
     * [Sync] 跳转到指定步骤
     * @param {number} step - 步骤索引
     */
    jumpToStep(step) { }
    
    /**
     * [Sync] 设置播放速度
     * @param {number} speed - 速度倍数
     */
    setSpeed(speed) { }
}
```

### 模块6: VCFPracticeManager (VCF练习)

**职责**: VCF题库管理、练习验证

**公共API**:

```javascript
class VCFPracticeManager {
    /**
     * [Sync] 获取题目
     * @param {number} level - 难度等级 (1-4)
     * @returns {Object} 题目数据
     */
    getPuzzle(level) { }
    
    /**
     * [Sync] 验证移动
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     * @returns {Object} 验证结果
     */
    validateMove(x, y) { }
    
    /**
     * [Async] 执行AI防守
     * @returns {Promise<Object>} AI移动
     */
    async executeAIDefense() { }
    
    /**
     * [Sync] 获取进度
     * @returns {Object} 练习进度
     */
    getProgress() { }
}
```

---

## 🔄 模块间通信

### 1. 直接调用

```javascript
// 模块A直接调用模块B的API
const result = moduleB.publicMethod(params);
```

### 2. 事件驱动

```javascript
// 模块A发布事件
moduleA.emit('event', data);

// 模块B监听事件
moduleB.on('event', (data) => {
    // 处理事件
});
```

### 3. 依赖注入

```javascript
// 创建模块时注入依赖
const renderer = new BoardRenderer({
    game: gameInstance,
    canvas: canvasElement
});
```

---

## 📡 事件系统

### 事件命名规范

```
模块名:事件类型:具体事件
例如: game:state:changed
     ai:move:completed
     render:board:updated
```

### 核心事件列表

| 事件名 | 触发时机 | 数据结构 |
|--------|---------|---------|
| `game:piece:placed` | 落子后 | `{x, y, player, timestamp}` |
| `game:state:changed` | 状态变化 | `{oldState, newState}` |
| `game:over` | 游戏结束 | `{winner, reason, winLine}` |
| `ai:thinking:start` | AI开始思考 | `{difficulty, timeout}` |
| `ai:thinking:end` | AI完成思考 | `{move, duration}` |
| `render:complete` | 渲染完成 | `{timestamp}` |

---

## 🔐 状态管理

### 状态定义

```javascript
const GameState = {
    // 棋盘状态
    board: Array(15).fill().map(() => Array(15).fill(0)),
    
    // 游戏元数据
    meta: {
        status: 'ready',        // 'ready', 'playing', 'finished'
        mode: 'PvE',           // 'PvP', 'PvE', 'EvE', 'VCF_PRACTICE'
        currentPlayer: 1,      // 1=黑, 2=白
        winner: null,          // null | 0=平局 | 1=黑胜 | 2=白胜
        startTime: null,
        endTime: null
    },
    
    // 历史记录
    history: {
        moves: [],             // 落子历史
        states: []             // 状态快照
    },
    
    // AI配置
    ai: {
        difficulty: 'NORMAL',
        thinking: false
    },
    
    // UI状态
    ui: {
        highlight: null,
        interactive: true,
        theme: 'classic'
    }
};
```

### 状态更新机制

```javascript
// 不可变更新
const newState = {
    ...oldState,
    meta: {
        ...oldState.meta,
        currentPlayer: oldState.meta.currentPlayer === 1 ? 2 : 1
    }
};

// 触发状态变化事件
game.emit('state:changed', {
    oldState,
    newState,
    timestamp: Date.now()
});
```

---

## ⚡ 异步处理

### 异步API模式

```javascript
// 模式1: async/await
async function performAIMove() {
    try {
        const move = await ai.getMoveAsync('HELL');
        const result = game.placePiece(move.x, move.y);
        return result;
    } catch (error) {
        console.error('AI移动失败:', error);
        throw error;
    }
}

// 模式2: Promise链
ai.getMoveAsync('HELL')
    .then(move => game.placePiece(move.x, move.y))
    .then(result => renderer.render())
    .catch(error => handleError(error));

// 模式3: 并发处理
const [move, analysis] = await Promise.all([
    ai.getMoveAsync('HELL'),
    ai.analyzeSituation()
]);
```

### Web Worker支持（可选）

```javascript
// 将AI计算移到Worker
class AIWorker {
    async getMoveAsync(difficulty) {
        return new Promise((resolve, reject) => {
            const worker = new Worker('ai-worker.js');
            worker.postMessage({ difficulty, board: game.getBoardState() });
            worker.onmessage = (e) => {
                resolve(e.data);
                worker.terminate();
            };
            worker.onerror = reject;
        });
    }
}
```

---

## 📚 依赖管理

### 模块加载顺序

```html
<!-- 1. 基础设施 -->
<script src="js/utils.js"></script>
<script src="js/event-emitter.js"></script>

<!-- 2. 核心模块 -->
<script src="js/game-core.js"></script>
<script src="js/ai-advanced.js"></script>

<!-- 3. 功能模块 -->
<script src="js/board-renderer.js"></script>
<script src="js/game-save-load.js"></script>
<script src="js/game-replay.js"></script>
<script src="js/vcf-practice.js"></script>

<!-- 4. UI控制器（最后加载） -->
<script src="js/demo.js"></script>
```

### 依赖检查

```javascript
class ModuleDependencyChecker {
    static check(moduleName, dependencies) {
        const missing = dependencies.filter(dep => !window[dep]);
        if (missing.length > 0) {
            throw new Error(`${moduleName} 缺少依赖: ${missing.join(', ')}`);
        }
    }
}
```

---

## 🎨 扩展性设计

### 插件机制

```javascript
class PluginSystem {
    constructor() {
        this.plugins = new Map();
    }
    
    register(name, plugin) {
        if (plugin.install) {
            plugin.install(this.context);
        }
        this.plugins.set(name, plugin);
    }
    
    use(name, ...args) {
        const plugin = this.plugins.get(name);
        if (plugin && plugin.execute) {
            return plugin.execute(...args);
        }
    }
}

// 使用示例
const aiPlugin = {
    name: 'CustomAI',
    install(context) {
        // 初始化逻辑
    },
    execute(params) {
        // 执行逻辑
    }
};

pluginSystem.register('CustomAI', aiPlugin);
```

---

## 📖 参考资料

- [API参考文档](./API_REFERENCE.md) - 完整API列表
- [数据结构规范](./DATA_STRUCTURES.md) - 数据格式定义
- [开发指南](./DEVELOPMENT_GUIDE.md) - 开发最佳实践

---

**设计理念**: 模块化、API化、可扩展、易测试、AI友好
