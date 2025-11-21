# API参考文档

> **版本**: v2.0.0  
> **文档类型**: AI开发文档 - API参考  
> **最后更新**: 2025年1月

---

## 📌 文档说明

本文档提供所有模块的完整API参考，包括方法签名、参数说明、返回值格式、使用示例等。

### API状态标识
- `[Stable]` - 稳定API，不会变更
- `[Beta]` - 测试API，可能变更  
- `[Async]` - 异步API，返回Promise
- `[Sync]` - 同步API，立即返回
- `[Event]` - 事件API

---

## 📚 目录

1. [GameUtils - 工具函数库](#gameutils)
2. [GomokuGame - 游戏核心引擎](#gomokugame)
3. [AdvancedAI - AI决策系统](#advancedai)
4. [SimpleBoardRenderer - 棋盘渲染器](#simpleboardrenderer)
5. [GameSaveLoad - 存档管理](#gamesaveload)
6. [GameReplay - 回放系统](#gamereplay)
7. [VCFPracticeManager - VCF练习](#vcfpracticemanager)

---

<a name="gameutils"></a>
## 1. GameUtils - 工具函数库

### 概述

提供通用的工具函数，所有模块都可以使用。

### API列表

#### `[Stable] [Sync] showMessage(message, type, duration)`

显示消息提示。

**参数**:
- `message` (string) - 消息内容
- `type` (string) - 消息类型: 'info' | 'success' | 'warning' | 'error'
- `duration` (number) - 显示时长（毫秒），默认3000

**返回**: void

**示例**:
```javascript
GameUtils.showMessage('落子成功', 'success');
GameUtils.showMessage('禁手位置', 'error', 5000);
```

---

#### `[Stable] [Sync] formatTime(timestamp)`

格式化时间戳为可读格式。

**参数**:
- `timestamp` (number) - Unix时间戳

**返回**: string - 格式化后的时间 (HH:MM:SS)

**示例**:
```javascript
const time = GameUtils.formatTime(Date.now());
// "14:30:25"
```

---

#### `[Stable] [Sync] formatDuration(seconds)`

格式化时长为可读格式。

**参数**:
- `seconds` (number) - 秒数

**返回**: string - 格式化后的时长 (MM:SS)

**示例**:
```javascript
const duration = GameUtils.formatDuration(125);
// "02:05"
```

---

#### `[Stable] [Sync] positionToNotation(x, y)`

将棋盘坐标转换为棋谱记号。

**参数**:
- `x` (number) - X坐标 (0-14)
- `y` (number) - Y坐标 (0-14)

**返回**: string - 棋谱记号 (如 "H8")

**示例**:
```javascript
const notation = GameUtils.positionToNotation(7, 7);
// "H8"
```

---

#### `[Stable] [Sync] deepClone(obj)`

深度克隆对象。

**参数**:
- `obj` (any) - 要克隆的对象

**返回**: any - 克隆后的对象

**示例**:
```javascript
const board = game.getBoardState();
const clonedBoard = GameUtils.deepClone(board);
```

---

#### `[Stable] [Async] downloadAsJSON(data, filename)`

下载数据为JSON文件。

**参数**:
- `data` (Object) - 要下载的数据
- `filename` (string) - 文件名（可选）

**返回**: Promise<Object> - 下载结果

**示例**:
```javascript
await GameUtils.downloadAsJSON(gameData, 'save-game.json');
```

---

#### `[Stable] [Sync] isValidPosition(x, y, size)`

验证坐标是否有效。

**参数**:
- `x` (number) - X坐标
- `y` (number) - Y坐标
- `size` (number) - 棋盘大小，默认15

**返回**: boolean

**示例**:
```javascript
if (GameUtils.isValidPosition(x, y)) {
    // 坐标有效
}
```

---

<a name="gomokugame"></a>
## 2. GomokuGame - 游戏核心引擎

### 概述

游戏核心引擎，负责游戏规则、状态管理、数据持久化。

### 构造函数

```javascript
const game = new GomokuGame(options);
```

**参数**:
- `options` (Object) - 配置选项
  - `boardSize` (number) - 棋盘大小，默认15
  - `mode` (string) - 游戏模式，默认'PvE'
  - `difficulty` (string) - AI难度，默认'NORMAL'

**示例**:
```javascript
const game = new GomokuGame({
    boardSize: 15,
    mode: 'PvE',
    difficulty: 'HARD'
});
```

---

### 游戏操作

#### `[Stable] [Sync] placePiece(x, y)`

在指定位置落子。

**参数**:
- `x` (number) - X坐标 (0-14)
- `y` (number) - Y坐标 (0-14)

**返回**: Object
```javascript
{
    success: boolean,
    error?: string,           // 错误信息（失败时）
    code?: string,            // 错误码（失败时）
    gameOver: boolean,        // 游戏是否结束
    winner?: number,          // 获胜方（结束时）
    winLine?: Array,          // 胜利连线（获胜时）
    nextPlayer?: number       // 下一个玩家
}
```

**错误码**:
- `INVALID_POSITION` - 坐标无效
- `POSITION_OCCUPIED` - 位置已有棋子
- `FORBIDDEN_MOVE` - 禁手位置
- `GAME_FINISHED` - 游戏已结束
- `NOT_YOUR_TURN` - 不是该玩家回合

**示例**:
```javascript
const result = game.placePiece(7, 7);
if (result.success) {
    if (result.gameOver) {
        console.log('游戏结束，获胜方:', result.winner);
    } else {
        console.log('下一个玩家:', result.nextPlayer);
    }
} else {
    console.error('落子失败:', result.error);
}
```

---

#### `[Stable] [Sync] undo(steps)`

悔棋。

**参数**:
- `steps` (number) - 悔棋步数，默认1

**返回**: Object
```javascript
{
    success: boolean,
    error?: string,
    stepsUndone: number      // 实际悔棋步数
}
```

**示例**:
```javascript
const result = game.undo();    // 悔一步
const result2 = game.undo(2);  // 悔两步
```

---

#### `[Stable] [Sync] reset()`

重置游戏。

**返回**: this (支持链式调用)

**示例**:
```javascript
game.reset().setMode('PvP').start();
```

---

### 游戏规则

#### `[Stable] [Sync] checkWin(x, y)`

检查指定位置是否形成五连。

**参数**:
- `x` (number) - X坐标
- `y` (number) - Y坐标

**返回**: Object
```javascript
{
    isWin: boolean,
    winLine?: Array<{x, y}>,  // 胜利连线坐标
    direction?: Object         // 方向 {dx, dy}
}
```

**示例**:
```javascript
const result = game.checkWin(7, 7);
if (result.isWin) {
    console.log('形成五连:', result.winLine);
}
```

---

#### `[Stable] [Sync] checkForbidden(x, y)`

检查指定位置是否为禁手（仅对黑棋）。

**参数**:
- `x` (number) - X坐标
- `y` (number) - Y坐标

**返回**: Object
```javascript
{
    isForbidden: boolean,
    type?: string,            // 禁手类型: '三三禁手' | '四四禁手' | '长连禁手'
    details: Object           // 详细信息
}
```

**示例**:
```javascript
const result = game.checkForbidden(7, 7);
if (result.isForbidden) {
    console.log('禁手类型:', result.type);
}
```

---

### 状态查询

#### `[Stable] [Sync] getBoardState(clone)`

获取棋盘状态。

**参数**:
- `clone` (boolean) - 是否返回副本，默认true

**返回**: Array<Array<number>> - 15x15二维数组，0=空 1=黑 2=白

**示例**:
```javascript
const board = game.getBoardState();
console.log('中心位置:', board[7][7]);
```

---

#### `[Stable] [Sync] getGameState()`

获取完整游戏状态。

**返回**: Object
```javascript
{
    board: Array,
    meta: {
        status: string,      // 'ready' | 'playing' | 'finished'
        mode: string,        // 'PvP' | 'PvE' | 'EvE' | 'VCF_PRACTICE'
        currentPlayer: number,
        winner: number | null,
        startTime: number,
        endTime: number | null
    },
    history: {
        moves: Array,
        states: Array
    },
    ai: {
        difficulty: string,
        thinking: boolean
    }
}
```

**示例**:
```javascript
const state = game.getGameState();
console.log('游戏状态:', state.meta.status);
console.log('当前玩家:', state.meta.currentPlayer);
```

---

#### `[Stable] [Sync] getMoves()`

获取落子历史。

**返回**: Array
```javascript
[
    {
        x: number,
        y: number,
        player: number,
        timestamp: number,
        step: number
    },
    ...
]
```

**示例**:
```javascript
const moves = game.getMoves();
console.log(`共 ${moves.length} 步`);
```

---

### 模式控制

#### `[Stable] [Sync] setMode(mode)`

设置游戏模式。

**参数**:
- `mode` (string) - 'PvP' | 'PvE' | 'EvE' | 'VCF_PRACTICE'

**返回**: this (支持链式调用)

**示例**:
```javascript
game.setMode('PvE').setDifficulty('HARD');
```

---

#### `[Stable] [Sync] setDifficulty(difficulty)`

设置AI难度。

**参数**:
- `difficulty` (string) - 'BEGINNER' | 'NORMAL' | 'HARD' | 'HELL'

**返回**: this (支持链式调用)

---

### 数据导入导出

#### `[Stable] [Sync] exportData()`

导出游戏数据。

**返回**: Object
```javascript
{
    version: string,
    boardState: Array,
    moves: Array,
    meta: Object,
    timestamp: number
}
```

**示例**:
```javascript
const data = game.exportData();
await GameUtils.downloadAsJSON(data, 'game-save.json');
```

---

#### `[Stable] [Sync] loadFromData(data)`

从数据恢复游戏。

**参数**:
- `data` (Object) - 游戏数据（由exportData导出）

**返回**: Object
```javascript
{
    success: boolean,
    error?: string
}
```

**示例**:
```javascript
const result = game.loadFromData(savedData);
if (result.success) {
    console.log('游戏恢复成功');
}
```

---

### 事件

#### `[Event] piecePlace`

落子事件。

**数据**:
```javascript
{
    x: number,
    y: number,
    player: number,
    timestamp: number
}
```

**示例**:
```javascript
game.on('piecePlace', (data) => {
    console.log(`玩家${data.player}在(${data.x},${data.y})落子`);
});
```

---

#### `[Event] gameOver`

游戏结束事件。

**数据**:
```javascript
{
    winner: number,
    reason: string,
    winLine: Array
}
```

**示例**:
```javascript
game.on('gameOver', (data) => {
    console.log('游戏结束，获胜方:', data.winner);
});
```

---

#### `[Event] stateChange`

状态变化事件。

**数据**:
```javascript
{
    oldState: Object,
    newState: Object,
    timestamp: number
}
```

---

<a name="advancedai"></a>
## 3. AdvancedAI - AI决策系统

### 概述

提供AI决策功能，支持4个难度级别和VCF搜索。

### 构造函数

```javascript
const ai = new AdvancedAI(game, options);
```

**参数**:
- `game` (GomokuGame) - 游戏实例
- `options` (Object) - 配置选项

---

### AI决策

#### `[Stable] [Sync] getMove(difficulty)`

获取AI移动（同步版本，可能阻塞）。

**参数**:
- `difficulty` (string) - 'BEGINNER' | 'NORMAL' | 'HARD' | 'HELL'

**返回**: Object
```javascript
{
    x: number,
    y: number,
    score: number,
    reason: string,           // 决策理由
    depth: number,            // 搜索深度
    duration: number          // 耗时(毫秒)
}
```

**示例**:
```javascript
const move = ai.getMove('HELL');
game.placePiece(move.x, move.y);
```

---

#### `[Stable] [Async] getMoveAsync(difficulty, options)`

获取AI移动（异步版本，推荐）。

**参数**:
- `difficulty` (string) - AI难度
- `options` (Object) - 配置选项
  - `timeout` (number) - 超时时间(毫秒)
  - `useWorker` (boolean) - 是否使用Worker

**返回**: Promise<Object> - 同getMove

**示例**:
```javascript
try {
    const move = await ai.getMoveAsync('HELL', { timeout: 3000 });
    game.placePiece(move.x, move.y);
} catch (error) {
    console.error('AI超时');
}
```

---

#### `[Stable] [Sync] getHint(difficulty)`

获取提示。

**参数**:
- `difficulty` (string) - 提示强度

**返回**: Object - 同getMove

**示例**:
```javascript
const hint = ai.getHint('NORMAL');
renderer.highlightPosition(hint.x, hint.y);
```

---

#### `[Beta] [Async] analyzeSituation()`

分析当前棋盘形势。

**返回**: Promise<Object>
```javascript
{
    advantage: string,        // 'black' | 'white' | 'equal'
    score: number,            // 形势评分
    threats: Array,           // 威胁列表
    recommendations: Array    // 建议落子点
}
```

**示例**:
```javascript
const analysis = await ai.analyzeSituation();
console.log('当前优势方:', analysis.advantage);
```

---

#### `[Stable] [Async] searchVCF(player, maxDepth)`

VCF连续冲四搜索。

**参数**:
- `player` (number) - 搜索的玩家(1或2)
- `maxDepth` (number) - 最大搜索深度，默认10

**返回**: Promise<Object>
```javascript
{
    found: boolean,
    move: {x, y} | null,
    sequence: Array          // VCF序列
}
```

**示例**:
```javascript
const vcf = await ai.searchVCF(1, 10);
if (vcf.found) {
    console.log('找到VCF:', vcf.move);
}
```

---

### 事件

#### `[Event] ai:thinking:start`

AI开始思考。

**数据**:
```javascript
{
    difficulty: string,
    timeout: number
}
```

---

#### `[Event] ai:thinking:end`

AI完成思考。

**数据**:
```javascript
{
    move: Object,
    duration: number
}
```

---

<a name="simpleboardrenderer"></a>
## 4. SimpleBoardRenderer - 棋盘渲染器

### 概述

负责Canvas渲染和用户交互。

### 构造函数

```javascript
const renderer = new SimpleBoardRenderer(canvasId, game);
```

**参数**:
- `canvasId` (string) - Canvas元素ID
- `game` (GomokuGame) - 游戏实例

---

### 渲染控制

#### `[Stable] [Sync] render(force)`

渲染棋盘。

**参数**:
- `force` (boolean) - 强制重绘，默认false

**返回**: void

**示例**:
```javascript
renderer.render();        // 增量渲染
renderer.render(true);    // 强制重绘
```

---

#### `[Stable] [Sync] highlightPosition(x, y, options)`

高亮指定位置。

**参数**:
- `x` (number) - X坐标
- `y` (number) - Y坐标
- `options` (Object) - 高亮选项
  - `color` (string) - 颜色
  - `duration` (number) - 持续时间(毫秒)
  - `type` (string) - 类型: 'hint' | 'forbidden' | 'last'

**返回**: void

**示例**:
```javascript
renderer.highlightPosition(7, 7, {
    color: '#ff0000',
    duration: 3000,
    type: 'forbidden'
});
```

---

#### `[Stable] [Sync] clearHighlight()`

清除所有高亮。

**返回**: void

---

#### `[Stable] [Sync] setInteractive(enabled)`

启用/禁用用户交互。

**参数**:
- `enabled` (boolean) - 是否启用

**返回**: void

**示例**:
```javascript
renderer.setInteractive(false);  // 禁用交互（AI思考时）
renderer.setInteractive(true);   // 恢复交互
```

---

#### `[Stable] [Sync] setTheme(theme)`

设置棋盘主题。

**参数**:
- `theme` (string) - 'classic' | 'modern' | 'dark'

**返回**: void

---

<a name="gamesaveload"></a>
## 5. GameSaveLoad - 存档管理

### 构造函数

```javascript
const saveLoad = new GameSaveLoad(game);
```

---

### 存档操作

#### `[Stable] [Async] saveGame(filename)`

保存游戏。

**参数**:
- `filename` (string) - 文件名（可选）

**返回**: Promise<Object>
```javascript
{
    success: boolean,
    filename: string,
    size: number
}
```

**示例**:
```javascript
const result = await saveLoad.saveGame('my-game.json');
if (result.success) {
    console.log('保存成功:', result.filename);
}
```

---

#### `[Stable] [Async] loadGame(file)`

加载游戏。

**参数**:
- `file` (File) - 文件对象

**返回**: Promise<Object>
```javascript
{
    success: boolean,
    error?: string,
    data: Object
}
```

**示例**:
```javascript
const file = event.target.files[0];
const result = await saveLoad.loadGame(file);
if (result.success) {
    game.loadFromData(result.data);
}
```

---

#### `[Stable] [Async] autoSave()`

自动保存到LocalStorage。

**返回**: Promise<Object>

---

#### `[Stable] [Async] restoreAutoSave()`

恢复自动保存。

**返回**: Promise<Object>

---

<a name="gamereplay"></a>
## 6. GameReplay - 回放系统

### 构造函数

```javascript
const replay = new GameReplay(game, renderer);
```

---

### 回放控制

#### `[Stable] [Async] startReplay(data)`

开始回放。

**参数**:
- `data` (Object) - 游戏数据

**返回**: Promise<Object>

**示例**:
```javascript
await replay.startReplay(gameData);
```

---

#### `[Stable] [Sync] togglePlay()`

播放/暂停。

**返回**: void

---

#### `[Stable] [Sync] jumpToStep(step)`

跳转到指定步骤。

**参数**:
- `step` (number) - 步骤索引

**返回**: void

---

#### `[Stable] [Sync] setSpeed(speed)`

设置播放速度。

**参数**:
- `speed` (number) - 速度倍数 (0.5, 1, 2, 3)

**返回**: void

---

<a name="vcfpracticemanager"></a>
## 7. VCFPracticeManager - VCF练习

### 构造函数

```javascript
const vcfManager = new VCFPracticeManager(game, ai);
```

---

### 练习控制

#### `[Stable] [Sync] getPuzzle(level)`

获取题目。

**参数**:
- `level` (number) - 难度等级 (1-4)

**返回**: Object - 题目数据

---

#### `[Stable] [Sync] validateMove(x, y)`

验证移动是否正确。

**参数**:
- `x` (number) - X坐标
- `y` (number) - Y坐标

**返回**: Object
```javascript
{
    correct: boolean,
    correctMove: {x, y} | null,
    message: string
}
```

---

#### `[Stable] [Async] executeAIDefense()`

执行AI防守。

**返回**: Promise<Object>

---

#### `[Stable] [Sync] getProgress()`

获取练习进度。

**返回**: Object

---

## 📖 相关文档

- [系统架构设计](./ARCHITECTURE.md)
- [数据结构规范](./DATA_STRUCTURES.md)
- [开发指南](./DEVELOPMENT_GUIDE.md)

---

**文档维护**: API文档随代码更新同步维护  
**版本控制**: 遵循语义化版本控制规范
