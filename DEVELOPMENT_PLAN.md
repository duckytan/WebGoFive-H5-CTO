# H5 五子棋游戏 - 详细开发计划

> **项目名称**: H5五子棋游戏（Gomoku Game）  
> **技术栈**: 纯JavaScript ES6+, HTML5 Canvas, CSS3（无构建工具）  
> **预计工期**: 26-35小时  
> **开始日期**: 2025年1月  
> **文档版本**: v1.0.0

---

## 📋 目录

- [项目概述](#项目概述)
- [开发阶段规划](#开发阶段规划)
- [任务拆分细则](#任务拆分细则)
- [验收标准](#验收标准)
- [开发规范](#开发规范)
- [风险控制](#风险控制)

---

## 📌 项目概述

### 项目目标
开发一个完整功能的H5五子棋游戏，支持：
- ✅ 双人对战（PvP）
- ✅ 人机对战（PvE）- 4级AI难度
- ✅ 机器对战（EvE）- AI演示
- ✅ VCF练习模式 - 40道题库
- ✅ 完整的禁手规则检测
- ✅ 存档/加载/回放功能
- ✅ 响应式UI设计

### 核心技术特点
- **模块化API设计**: 所有模块独立可测试
- **事件驱动架构**: 松耦合的模块通信
- **无构建依赖**: 纯原生JavaScript
- **高性能渲染**: Canvas 60fps渲染
- **智能AI系统**: VCF搜索、迭代加深算法

### 开发原则
1. **由简到繁**: 先实现核心功能，再扩展高级特性
2. **可测试性**: 每个模块完成后立即验收
3. **增量迭代**: 每个阶段都能独立运行
4. **质量优先**: 不留技术债

---

## 🚀 开发阶段规划

### 阶段总览

| 阶段 | 名称 | 内容 | 优先级 | 工作量 | 状态 |
|------|------|------|--------|--------|------|
| **阶段0** | 环境准备 | 项目结构、基础HTML | P0 | 1h | ✅ 已完成（2025-01-20） |
| **阶段1** | 核心功能 | 棋盘、落子、判胜 | P0 | 4-6h | ⏳ 待开始 |
| **阶段2** | 规则完善 | 禁手检测、悔棋 | P0 | 3-4h | ⏳ 待开始 |
| **阶段3** | AI系统 | 4级AI、AI决策 | P0 | 5-6h | ⏳ 待开始 |
| **阶段4** | 存档回放 | 保存、加载、回放 | P1 | 4-5h | ⏳ 待开始 |
| **阶段5** | VCF练习 | 题库、练习模式 | P1 | 4-6h | ⏳ 待开始 |
| **阶段6** | UX优化 | 动画、设置、帮助 | P2 | 3-4h | ⏳ 待开始 |
| **阶段7** | 测试部署 | 测试、发布 | P0 | 2-3h | ⏳ 待开始 |

**总计**: 约26-35小时

### 里程碑（Milestones）

| 里程碑 | 完成标志 | 验收标准 |
|--------|---------|---------|
| **M0** | 环境就绪 | 项目结构创建，index.html可访问 |
| **M1** | 核心可玩 | 双人对战完整可用 |
| **M2** | 规则完备 | 禁手检测、悔棋功能正常 |
| **M3** | AI可用 | 4级AI全部可用 |
| **M4** | 数据持久 | 存档/回放完整流程无错 |
| **M5** | 练习系统 | VCF题库全部可用 |
| **M6** | 体验优化 | 全部辅助功能完成 |
| **M7** | 发布就绪 | 全部测试通过 |

---

## 📝 任务拆分细则

### 阶段0: 环境准备 (1小时)

#### 任务0.1: 创建项目目录结构
**负责人**: AI开发者  
**预计时间**: 15分钟  
**优先级**: P0

**任务清单**:
- [ ] 创建根目录 `gomoku-game/`
- [ ] 创建子目录:
  - `js/` - JavaScript文件
  - `css/` - 样式文件
  - `assets/` - 静态资源（预留）
- [ ] 创建核心文件:
  - `index.html` - 主页面
  - `js/utils.js` - 工具模块
  - `js/game-core.js` - 游戏核心
  - `js/board-renderer.js` - 渲染器
  - `js/demo.js` - UI控制器
  - `css/style.css` - 主样式
  - `css/animations.css` - 动画样式

**验收标准**:
```bash
✅ 目录结构完整
✅ 所有必需文件已创建
✅ 文件命名符合规范（kebab-case）
```

#### 任务0.2: 编写index.html骨架
**预计时间**: 30分钟  
**优先级**: P0

**任务清单**:
- [ ] HTML5声明和meta标签
- [ ] 引入CSS文件（style.css, animations.css）
- [ ] 创建DOM结构:
  ```html
  <div class="game-container">
    <div class="game-header">标题和信息栏</div>
    <canvas id="board">棋盘</canvas>
    <div class="game-controls">控制按钮</div>
    <div class="game-info">游戏信息</div>
  </div>
  ```
- [ ] 按依赖顺序引入JS模块:
  ```html
  utils.js → game-core.js → board-renderer.js → demo.js
  ```

**验收标准**:
```
✅ HTML通过W3C验证
✅ 浏览器打开无错误
✅ 控制台无JS加载错误
✅ 所有模块按顺序加载
```

**验收命令**:
```bash
# 启动本地服务器
python3 -m http.server 8080
# 浏览器访问 http://localhost:8080
# F12打开控制台，应无报错
```

#### 任务0.3: 配置开发环境
**预计时间**: 15分钟  
**优先级**: P0

**任务清单**:
- [ ] 创建`.gitignore`文件
- [ ] 初始化git仓库
- [ ] 验证本地服务器运行
- [ ] 配置浏览器开发工具

**验收标准**:
```
✅ .gitignore正确配置
✅ git初始化成功
✅ 本地服务器可访问
✅ 浏览器开发工具可用
```

---

### 阶段1: 核心功能 (4-6小时)

#### 任务1.1: GameUtils工具模块
**预计时间**: 1小时  
**优先级**: P0  
**文件**: `js/utils.js`

**任务清单**:
- [ ] 实现`showMessage(message, type, duration)` - 消息提示
  - 支持类型: success, error, warning, info
  - 自动消失时间: 默认3秒
- [ ] 实现`formatTime(timestamp)` - 时间格式化
  - 格式: "YYYY-MM-DD HH:mm:ss"
- [ ] 实现`formatDuration(seconds)` - 时长格式化
  - 格式: "1h 23m 45s"
- [ ] 实现`generateFileName(prefix, extension)` - 文件名生成
- [ ] 实现`deepClone(obj)` - 深拷贝
- [ ] 实现`isValidPosition(x, y, size)` - 坐标验证
- [ ] 实现`saveToLocalStorage(key, data)` - 本地存储
- [ ] 实现`loadFromLocalStorage(key)` - 读取存储
- [ ] 实现`downloadAsJSON(data, filename)` - JSON下载
- [ ] 导出到`window.GameUtils`

**代码示例**:
```javascript
class GameUtils {
    static showMessage(message, type = 'info', duration = 3000) {
        // 创建消息提示元素
        const msgEl = document.createElement('div');
        msgEl.className = `game-message message-${type}`;
        msgEl.textContent = message;
        document.body.appendChild(msgEl);
        
        // 自动消失
        setTimeout(() => msgEl.remove(), duration);
    }
    
    static formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
    
    static isValidPosition(x, y, size = 15) {
        return x >= 0 && x < size && y >= 0 && y < size;
    }
    
    static deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
}

// 导出
if (typeof window !== 'undefined') {
    window.GameUtils = GameUtils;
}
```

**验收标准**:
```javascript
// 在浏览器控制台测试
console.log(GameUtils.formatTime(Date.now())); 
// 输出: "2025-01-20 12:34:56"

console.log(GameUtils.isValidPosition(7, 7, 15)); 
// 输出: true

console.log(GameUtils.isValidPosition(15, 15, 15)); 
// 输出: false

GameUtils.showMessage('测试消息', 'success');
// 页面显示绿色消息提示

const obj = {a: 1, b: {c: 2}};
const clone = GameUtils.deepClone(obj);
clone.b.c = 3;
console.log(obj.b.c); // 输出: 2 (原对象未被修改)
```

**验收检查表**:
- [ ] 所有方法正常工作
- [ ] 消息提示UI正确显示
- [ ] 深拷贝不影响原对象
- [ ] 模块正确导出到window
- [ ] 控制台无错误或警告

---

#### 任务1.2: GomokuGame核心引擎 - Part1: 基础落子
**预计时间**: 1.5小时  
**优先级**: P0  
**文件**: `js/game-core.js`

**任务清单**:
- [ ] 定义`GomokuGame`类
- [ ] 初始化15x15棋盘（二维数组）
  - 棋盘格式: `board[y][x]` (注意是行优先!)
  - 空位: 0, 黑棋: 1, 白棋: 2
- [ ] 实现`placePiece(x, y)`方法
  - 参数验证
  - 位置占用检查
  - 游戏结束状态检查
  - 落子操作
  - 历史记录
  - 玩家切换
- [ ] 实现`isValidPosition(x, y)`
- [ ] 实现`checkWin(x, y)`方法
  - 检测四个方向: 横、竖、左斜、右斜
  - 连续5个判胜
- [ ] 实现`getLine(x, y, dx, dy, player)`
  - 获取指定方向的连线长度
- [ ] 实现`getBoardState()`
- [ ] 实现`reset()`
- [ ] 初始化`moves`数组（历史记录）

**代码示例**:
```javascript
class GomokuGame {
    constructor(boardSize = 15) {
        this.BOARD_SIZE = boardSize;
        this.board = [];
        this.currentPlayer = 1; // 1=黑棋, 2=白棋
        this.moves = [];
        this.gameOver = false;
        this.winner = null;
        
        this.reset();
        console.log('[GomokuGame] 初始化完成');
    }
    
    reset() {
        // 初始化棋盘: board[y][x]
        this.board = Array(this.BOARD_SIZE)
            .fill(0)
            .map(() => Array(this.BOARD_SIZE).fill(0));
        
        this.currentPlayer = 1;
        this.moves = [];
        this.gameOver = false;
        this.winner = null;
        
        console.log('[GomokuGame] 棋盘已重置');
        return this;
    }
    
    placePiece(x, y) {
        // 1. 参数验证
        if (!GameUtils.isValidPosition(x, y, this.BOARD_SIZE)) {
            return {
                success: false,
                error: '坐标超出范围',
                code: 'INVALID_POSITION'
            };
        }
        
        // 2. 位置占用检查
        if (this.board[y][x] !== 0) {
            return {
                success: false,
                error: '该位置已有棋子',
                code: 'POSITION_OCCUPIED'
            };
        }
        
        // 3. 游戏结束检查
        if (this.gameOver) {
            return {
                success: false,
                error: '游戏已结束',
                code: 'GAME_FINISHED'
            };
        }
        
        // 4. 落子
        this.board[y][x] = this.currentPlayer;
        
        // 5. 记录历史
        this.moves.push({
            x,
            y,
            player: this.currentPlayer,
            timestamp: Date.now()
        });
        
        // 6. 检查胜负
        const winResult = this.checkWin(x, y);
        
        if (winResult.hasWon) {
            this.gameOver = true;
            this.winner = this.currentPlayer;
            
            return {
                success: true,
                data: {
                    x,
                    y,
                    player: this.currentPlayer,
                    gameOver: true,
                    winner: this.winner,
                    winLine: winResult.winLine
                }
            };
        }
        
        // 7. 切换玩家
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        
        return {
            success: true,
            data: {
                x,
                y,
                player: this.currentPlayer === 1 ? 2 : 1, // 返回刚落子的玩家
                gameOver: false
            }
        };
    }
    
    checkWin(x, y) {
        const player = this.board[y][x];
        const directions = [
            {dx: 1, dy: 0},   // 横向
            {dx: 0, dy: 1},   // 纵向
            {dx: 1, dy: 1},   // 左斜
            {dx: 1, dy: -1}   // 右斜
        ];
        
        for (const {dx, dy} of directions) {
            const count = 1 + 
                this.getLine(x, y, dx, dy, player) +
                this.getLine(x, y, -dx, -dy, player);
            
            if (count >= 5) {
                return {
                    hasWon: true,
                    winLine: {x, y, dx, dy, length: count}
                };
            }
        }
        
        return {hasWon: false};
    }
    
    getLine(x, y, dx, dy, player) {
        let count = 0;
        let nx = x + dx;
        let ny = y + dy;
        
        while (
            GameUtils.isValidPosition(nx, ny, this.BOARD_SIZE) &&
            this.board[ny][nx] === player
        ) {
            count++;
            nx += dx;
            ny += dy;
        }
        
        return count;
    }
    
    getBoardState(clone = true) {
        return clone ? GameUtils.deepClone(this.board) : this.board;
    }
    
    getMoves() {
        return [...this.moves];
    }
    
    getGameState() {
        return {
            currentPlayer: this.currentPlayer,
            gameOver: this.gameOver,
            winner: this.winner,
            moveCount: this.moves.length
        };
    }
}

// 导出
if (typeof window !== 'undefined') {
    window.GomokuGame = GomokuGame;
}
```

**验收标准**:
```javascript
// 在浏览器控制台测试
const game = new GomokuGame();

// 测试1: 正常落子
let result = game.placePiece(7, 7);
console.log(result.success); // true
console.log(result.data.player); // 1 (黑棋)

// 测试2: 重复落子
result = game.placePiece(7, 7);
console.log(result.success); // false
console.log(result.code); // "POSITION_OCCUPIED"

// 测试3: 非法坐标
result = game.placePiece(15, 15);
console.log(result.success); // false
console.log(result.code); // "INVALID_POSITION"

// 测试4: 构造五连胜利
game.reset();
game.placePiece(7, 7);  // 黑
game.placePiece(8, 7);  // 白
game.placePiece(7, 8);  // 黑
game.placePiece(8, 8);  // 白
game.placePiece(7, 9);  // 黑
game.placePiece(8, 9);  // 白
game.placePiece(7, 10); // 黑
game.placePiece(8, 10); // 白
result = game.placePiece(7, 11); // 黑 - 五连！
console.log(result.data.gameOver); // true
console.log(result.data.winner); // 1

// 测试5: 获取棋盘状态
const board = game.getBoardState();
console.log(board[7][7]); // 1 (黑棋)

// 测试6: 历史记录
console.log(game.getMoves().length); // 9
```

**验收检查表**:
- [ ] 棋盘正确初始化为15x15
- [ ] 落子成功返回正确格式
- [ ] 重复落子被拒绝
- [ ] 非法坐标被拒绝
- [ ] 五连胜利正确检测
- [ ] 四个方向胜利都能检测
- [ ] 历史记录正确保存
- [ ] 棋盘状态可正确获取
- [ ] 控制台无错误

---

#### 任务1.3: SimpleBoardRenderer渲染器
**预计时间**: 1.5小时  
**优先级**: P0  
**文件**: `js/board-renderer.js`

**任务清单**:
- [ ] 定义`SimpleBoardRenderer`类
- [ ] Canvas初始化和尺寸计算
- [ ] 实现`render()`方法 - 渲染完整棋盘
- [ ] 实现`drawBoard()`方法 - 绘制网格线
- [ ] 实现`drawPieces()`方法 - 绘制所有棋子
- [ ] 实现`setupEventListeners()`方法
  - click事件: 落子
  - mousemove事件: 悬停预览
  - mouseleave事件: 清除预览
- [ ] 实现坐标转换方法
  - `getCanvasPosition(x, y)` - 逻辑坐标转Canvas坐标
  - `getBoardPosition(canvasX, canvasY)` - Canvas坐标转逻辑坐标
- [ ] 实现悬停预览效果

**代码示例**:
```javascript
class SimpleBoardRenderer {
    constructor(canvas, game) {
        if (!canvas) {
            throw new Error('[SimpleBoardRenderer] Canvas元素不存在');
        }
        if (!game) {
            throw new Error('[SimpleBoardRenderer] Game实例不存在');
        }
        
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.game = game;
        
        this.BOARD_SIZE = game.BOARD_SIZE;
        this.PADDING = 40;
        this.CELL_SIZE = 40;
        this.canvasSize = this.PADDING * 2 + (this.BOARD_SIZE - 1) * this.CELL_SIZE;
        
        this.hoverX = -1;
        this.hoverY = -1;
        
        this.init();
        console.log('[SimpleBoardRenderer] 初始化完成');
    }
    
    init() {
        // 设置Canvas尺寸
        this.canvas.width = this.canvasSize;
        this.canvas.height = this.canvasSize;
        
        // 设置事件监听
        this.setupEventListeners();
        
        // 首次渲染
        this.render();
    }
    
    setupEventListeners() {
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const canvasX = e.clientX - rect.left;
            const canvasY = e.clientY - rect.top;
            
            const {x, y} = this.getBoardPosition(canvasX, canvasY);
            
            if (x !== -1 && y !== -1) {
                this.placePiece(x, y);
            }
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const canvasX = e.clientX - rect.left;
            const canvasY = e.clientY - rect.top;
            
            const {x, y} = this.getBoardPosition(canvasX, canvasY);
            
            if (x !== this.hoverX || y !== this.hoverY) {
                this.hoverX = x;
                this.hoverY = y;
                this.render();
            }
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.hoverX = -1;
            this.hoverY = -1;
            this.render();
        });
    }
    
    render() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
        
        // 绘制棋盘
        this.drawBoard();
        
        // 绘制棋子
        this.drawPieces();
        
        // 绘制悬停预览
        this.drawHoverPreview();
    }
    
    drawBoard() {
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 1;
        
        // 绘制网格
        for (let i = 0; i < this.BOARD_SIZE; i++) {
            const pos = this.PADDING + i * this.CELL_SIZE;
            
            // 横线
            this.ctx.beginPath();
            this.ctx.moveTo(this.PADDING, pos);
            this.ctx.lineTo(
                this.PADDING + (this.BOARD_SIZE - 1) * this.CELL_SIZE,
                pos
            );
            this.ctx.stroke();
            
            // 竖线
            this.ctx.beginPath();
            this.ctx.moveTo(pos, this.PADDING);
            this.ctx.lineTo(
                pos,
                this.PADDING + (this.BOARD_SIZE - 1) * this.CELL_SIZE
            );
            this.ctx.stroke();
        }
        
        // 绘制天元和星位
        const stars = [
            [3, 3], [3, 11], [11, 3], [11, 11], [7, 7]
        ];
        
        stars.forEach(([x, y]) => {
            const {canvasX, canvasY} = this.getCanvasPosition(x, y);
            this.ctx.beginPath();
            this.ctx.arc(canvasX, canvasY, 4, 0, Math.PI * 2);
            this.ctx.fillStyle = '#000';
            this.ctx.fill();
        });
    }
    
    drawPieces() {
        const board = this.game.getBoardState();
        
        for (let y = 0; y < this.BOARD_SIZE; y++) {
            for (let x = 0; x < this.BOARD_SIZE; x++) {
                const piece = board[y][x];
                if (piece !== 0) {
                    this.drawPiece(x, y, piece);
                }
            }
        }
    }
    
    drawPiece(x, y, player) {
        const {canvasX, canvasY} = this.getCanvasPosition(x, y);
        const radius = this.CELL_SIZE * 0.4;
        
        // 绘制棋子
        this.ctx.beginPath();
        this.ctx.arc(canvasX, canvasY, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = player === 1 ? '#000' : '#FFF';
        this.ctx.fill();
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        // 添加光泽效果
        const gradient = this.ctx.createRadialGradient(
            canvasX - radius * 0.3,
            canvasY - radius * 0.3,
            0,
            canvasX,
            canvasY,
            radius
        );
        
        if (player === 1) {
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else {
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        }
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }
    
    drawHoverPreview() {
        if (this.hoverX === -1 || this.hoverY === -1) return;
        if (this.game.gameOver) return;
        
        const board = this.game.getBoardState();
        if (board[this.hoverY][this.hoverX] !== 0) return;
        
        const {canvasX, canvasY} = this.getCanvasPosition(
            this.hoverX,
            this.hoverY
        );
        const radius = this.CELL_SIZE * 0.4;
        
        this.ctx.beginPath();
        this.ctx.arc(canvasX, canvasY, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = this.game.currentPlayer === 1 
            ? 'rgba(0, 0, 0, 0.3)' 
            : 'rgba(255, 255, 255, 0.5)';
        this.ctx.fill();
        this.ctx.strokeStyle = '#999';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }
    
    getCanvasPosition(x, y) {
        return {
            canvasX: this.PADDING + x * this.CELL_SIZE,
            canvasY: this.PADDING + y * this.CELL_SIZE
        };
    }
    
    getBoardPosition(canvasX, canvasY) {
        const x = Math.round((canvasX - this.PADDING) / this.CELL_SIZE);
        const y = Math.round((canvasY - this.PADDING) / this.CELL_SIZE);
        
        if (GameUtils.isValidPosition(x, y, this.BOARD_SIZE)) {
            return {x, y};
        }
        
        return {x: -1, y: -1};
    }
    
    placePiece(x, y) {
        const result = this.game.placePiece(x, y);
        
        if (result.success) {
            this.render();
            
            // 触发事件（由demo.js处理）
            if (window.demo && window.demo.handleMoveResult) {
                window.demo.handleMoveResult(result);
            }
        } else {
            GameUtils.showMessage(result.error, 'error');
        }
        
        return result;
    }
}

// 导出
if (typeof window !== 'undefined') {
    window.SimpleBoardRenderer = SimpleBoardRenderer;
}
```

**验收标准**:
```
✅ Canvas正确显示15x15棋盘
✅ 网格线清晰可见
✅ 天元和星位正确标记
✅ 点击空位可落子
✅ 黑白棋子正确显示
✅ 棋子有光泽效果
✅ 鼠标悬停显示半透明预览
✅ 已有棋子的位置不显示预览
✅ 点击已有棋子位置显示错误提示
✅ 坐标转换正确
```

**验收步骤**:
1. 打开页面，检查棋盘显示
2. 移动鼠标，检查悬停预览
3. 连续点击多个位置，检查落子
4. 尝试点击已有棋子位置，检查错误提示
5. 使用开发工具检查Canvas绘制性能

---

#### 任务1.4: InterfaceDemo UI控制器 - 基础版
**预计时间**: 1小时  
**优先级**: P0  
**文件**: `js/demo.js`

**任务清单**:
- [ ] 定义`InterfaceDemo`类
- [ ] 依赖检查（utils, game-core, board-renderer）
- [ ] DOM元素引用
- [ ] 实现`init()`方法
- [ ] 实现`handleMoveResult(result)`方法
- [ ] 实现`startNewGame()`方法
- [ ] 实现`updateGameInfo()`方法
- [ ] 绑定按钮事件
- [ ] 显示当前玩家

**代码示例**:
```javascript
class InterfaceDemo {
    constructor() {
        console.log('[InterfaceDemo] 开始初始化...');
        
        // 检查依赖
        this.checkDependencies();
        
        // 初始化核心模块
        this.game = new GomokuGame(15);
        
        // 获取DOM元素
        this.canvas = document.getElementById('board');
        this.renderer = new SimpleBoardRenderer(this.canvas, this.game);
        
        // 获取UI元素
        this.infoPanel = document.getElementById('game-info');
        this.newGameBtn = document.getElementById('new-game-btn');
        
        // 绑定事件
        this.bindEvents();
        
        // 初始化界面
        this.updateGameInfo();
        
        // 导出到window供renderer调用
        window.demo = this;
        
        console.log('[InterfaceDemo] 初始化完成');
    }
    
    checkDependencies() {
        const required = ['GameUtils', 'GomokuGame', 'SimpleBoardRenderer'];
        const missing = required.filter(dep => !window[dep]);
        
        if (missing.length > 0) {
            throw new Error(
                `缺少必需模块: ${missing.join(', ')}\n` +
                `请检查JS文件加载顺序`
            );
        }
    }
    
    bindEvents() {
        this.newGameBtn.addEventListener('click', () => {
            this.startNewGame();
        });
    }
    
    handleMoveResult(result) {
        if (!result.success) {
            GameUtils.showMessage(result.error, 'error');
            return;
        }
        
        const data = result.data;
        
        // 更新界面信息
        this.updateGameInfo();
        
        // 检查游戏结束
        if (data.gameOver) {
            const winnerText = data.winner === 1 ? '黑方' : '白方';
            GameUtils.showMessage(
                `🎉 ${winnerText}获胜！`,
                'success',
                5000
            );
        }
    }
    
    startNewGame() {
        this.game.reset();
        this.renderer.render();
        this.updateGameInfo();
        GameUtils.showMessage('新游戏开始', 'info');
    }
    
    updateGameInfo() {
        const state = this.game.getGameState();
        
        const currentPlayerText = state.gameOver
            ? (state.winner === 1 ? '黑方获胜' : '白方获胜')
            : (state.currentPlayer === 1 ? '黑方回合' : '白方回合');
        
        const moveCountText = `第 ${state.moveCount} 手`;
        
        this.infoPanel.innerHTML = `
            <div class="info-item">
                <span class="info-label">当前状态:</span>
                <span class="info-value ${state.gameOver ? 'game-over' : ''}">${currentPlayerText}</span>
            </div>
            <div class="info-item">
                <span class="info-label">步数:</span>
                <span class="info-value">${moveCountText}</span>
            </div>
        `;
    }
}

// 页面加载完成后初始化
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        window.demo = new InterfaceDemo();
    });
}
```

**验收标准**:
```
✅ 页面加载后自动初始化
✅ 依赖检查正常工作
✅ 棋盘正确显示
✅ 点击可落子
✅ 游戏信息正确更新
✅ 显示当前玩家
✅ 显示步数
✅ "新游戏"按钮正常工作
✅ 游戏结束显示获胜提示
✅ 控制台无错误
```

**验收步骤**:
1. 打开页面，检查自动初始化
2. 下几步棋，检查信息更新
3. 构造五连，检查获胜提示
4. 点击"新游戏"，检查重置
5. 检查控制台日志

---

#### 任务1.5: 基础样式
**预计时间**: 1小时  
**优先级**: P0  
**文件**: `css/style.css`

**任务清单**:
- [ ] 全局样式设置
- [ ] 容器布局（Grid）
- [ ] 棋盘Canvas样式
- [ ] 按钮样式
- [ ] 信息面板样式
- [ ] 消息提示样式
- [ ] 响应式设计基础

**代码示例**:
```css
/* 全局样式 */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
                 'Oxygen', 'Ubuntu', 'Cantarell', 'Helvetica Neue', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

/* 游戏容器 */
.game-container {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    padding: 30px;
    max-width: 800px;
}

/* 游戏标题 */
.game-header {
    text-align: center;
    margin-bottom: 20px;
}

.game-header h1 {
    font-size: 32px;
    color: #333;
    margin-bottom: 10px;
}

/* 棋盘 */
#board {
    display: block;
    margin: 0 auto;
    background: #DEB887;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    cursor: pointer;
}

/* 游戏信息 */
#game-info {
    margin-top: 20px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
}

.info-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 16px;
}

.info-label {
    font-weight: 600;
    color: #666;
}

.info-value {
    color: #333;
}

.info-value.game-over {
    color: #e74c3c;
    font-weight: bold;
}

/* 控制按钮 */
.game-controls {
    margin-top: 20px;
    display: flex;
    gap: 10px;
    justify-content: center;
}

button {
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

#new-game-btn {
    background: #667eea;
    color: white;
}

#new-game-btn:hover {
    background: #5568d3;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

#new-game-btn:active {
    transform: translateY(0);
}

/* 消息提示 */
.game-message {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    animation: slideIn 0.3s ease;
    z-index: 1000;
}

.message-success {
    background: #10b981;
    color: white;
}

.message-error {
    background: #ef4444;
    color: white;
}

.message-warning {
    background: #f59e0b;
    color: white;
}

.message-info {
    background: #3b82f6;
    color: white;
}

@keyframes slideIn {
    from {
        transform: translateX(400px);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

/* 响应式设计 */
@media (max-width: 768px) {
    .game-container {
        padding: 20px;
    }
    
    .game-header h1 {
        font-size: 24px;
    }
    
    #board {
        max-width: 100%;
        height: auto;
    }
}
```

**验收标准**:
```
✅ 页面居中布局
✅ 渐变背景正确显示
✅ 容器有圆角和阴影
✅ 棋盘木质背景色
✅ 按钮有悬停效果
✅ 消息提示正确显示
✅ 移动端响应式正常
✅ 字体大小适中
✅ 颜色搭配协调
```

---

### 阶段1验收 - 里程碑M1

**完成标志**: 双人对战（PvP）模式完整可用

**总验收清单**:
- [ ] ✅ 所有模块文件已创建
- [ ] ✅ 棋盘正确显示15x15网格
- [ ] ✅ 点击空位可落子
- [ ] ✅ 黑白棋子交替出现
- [ ] ✅ 棋子显示有光泽效果
- [ ] ✅ 鼠标悬停有预览效果
- [ ] ✅ 重复落子被拒绝并提示
- [ ] ✅ 五连胜利正确判定（四个方向）
- [ ] ✅ 游戏结束显示获胜消息
- [ ] ✅ 游戏信息正确更新
- [ ] ✅ "新游戏"按钮正常工作
- [ ] ✅ 控制台无错误或警告
- [ ] ✅ 样式美观，布局合理
- [ ] ✅ 移动端基本可用

**测试用例**:

1. **基础落子测试**
   - 点击(7,7)，应落黑子
   - 点击(8,8)，应落白子
   - 再次点击(7,7)，应显示错误提示

2. **胜利判定测试**
   - 横向五连测试
   - 纵向五连测试
   - 左斜五连测试
   - 右斜五连测试

3. **UI交互测试**
   - 新游戏按钮
   - 消息提示显示
   - 游戏信息更新

**性能指标**:
- Canvas渲染: 无明显卡顿
- 点击响应: <100ms
- 页面加载: <2s

**通过标准**: 所有验收清单项通过 ✅

---

## 📊 验收记录表

每完成一个任务，在下表记录验收结果：

| 任务ID | 任务名称 | 完成时间 | 验收结果 | 问题记录 | 备注 |
|--------|---------|---------|---------|---------|------|
| 0.1 | 创建项目结构 | - | ⏳ 待验收 | - | - |
| 0.2 | 编写HTML骨架 | - | ⏳ 待验收 | - | - |
| 0.3 | 配置开发环境 | - | ⏳ 待验收 | - | - |
| 1.1 | GameUtils工具模块 | - | ⏳ 待验收 | - | - |
| 1.2 | GomokuGame核心引擎 | - | ⏳ 待验收 | - | - |
| 1.3 | SimpleBoardRenderer渲染器 | - | ⏳ 待验收 | - | - |
| 1.4 | InterfaceDemo UI控制器 | - | ⏳ 待验收 | - | - |
| 1.5 | 基础样式 | - | ⏳ 待验收 | - | - |

**验收状态说明**:
- ⏳ 待验收
- ✅ 通过
- ❌ 未通过
- 🔄 需返工

---

## 📋 后续阶段概览

由于文档篇幅限制，后续阶段（阶段2-7）的详细任务清单将在每个阶段开始时展开。

### 阶段2: 规则完善 (3-4小时)
- 禁手检测算法
- 禁手可视化
- 悔棋功能

### 阶段3: AI系统 (5-6小时)
- 基础AI (BEGINNER, NORMAL)
- 高级AI (HARD, HELL)
- VCF搜索算法
- AI UI集成

### 阶段4: 存档回放 (4-5小时)
- 存档管理
- 加载功能
- 回放系统

### 阶段5: VCF练习 (4-6小时)
- 题库生成
- 练习模式
- 进度追踪

### 阶段6: UX优化 (3-4小时)
- 动画效果
- 设置系统
- 帮助文档

### 阶段7: 测试部署 (2-3小时)
- 功能测试
- 兼容性测试
- 性能优化
- 发布准备

---

## 🎯 开发规范

### 代码规范

1. **命名约定**
   - 类名: PascalCase (如: `GomokuGame`)
   - 函数/方法: camelCase (如: `placePiece`)
   - 常量: UPPER_SNAKE_CASE (如: `BOARD_SIZE`)
   - 私有方法: 前缀下划线 (如: `_handleError`)
   - CSS类: kebab-case (如: `game-board`)

2. **注释规范**
   ```javascript
   /**
    * 方法说明
    * @param {类型} 参数名 - 参数说明
    * @returns {类型} 返回值说明
    */
   ```

3. **API返回值规范**
   ```javascript
   // 成功
   { success: true, data: any }
   
   // 失败
   { success: false, error: string, code: string }
   ```

### Git提交规范

- `feat:` 新功能
- `fix:` 修复bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 重构
- `test:` 测试相关
- `chore:` 构建/工具相关

示例:
```
feat: 实现GameUtils工具模块
fix: 修复五连胜利判定bug
docs: 更新开发计划文档
```

### 测试规范

每个模块完成后必须测试:
1. 功能是否符合需求
2. 边界情况是否处理
3. 错误提示是否正确
4. 性能是否达标
5. 控制台是否无错误

---

## ⚠️ 风险控制

### 技术风险

| 风险 | 等级 | 应对措施 |
|------|------|---------|
| Canvas性能问题 | 中 | 使用离屏Canvas、减少重绘 |
| AI计算阻塞UI | 高 | 使用Web Worker或分步计算 |
| 禁手算法复杂 | 中 | 参考标准算法、充分测试 |
| 浏览器兼容性 | 低 | 使用标准API、polyfill |

### 进度风险

- **风险**: 某个阶段超时
- **应对**: 
  1. 优先完成P0功能
  2. P1/P2功能可后置
  3. 及时调整计划

### 质量风险

- **风险**: 功能不完整或有bug
- **应对**:
  1. 严格执行验收标准
  2. 每个阶段充分测试
  3. 记录已知问题清单

---

## 📞 开发支持

### 参考文档

- [API_REFERENCE.md](./doc/API_REFERENCE.md) - 完整API文档
- [ARCHITECTURE.md](./doc/ARCHITECTURE.md) - 架构设计
- [GAME_RULES.md](./doc/GAME_RULES.md) - 游戏规则
- [DEVELOPMENT_GUIDE.md](./doc/DEVELOPMENT_GUIDE.md) - 开发指南

### 快速命令

```bash
# 启动开发服务器
python3 -m http.server 8080

# 查看模块信息
console.log(GameUtils.__moduleInfo)

# 调试棋盘
console.table(game.getBoardState())

# 查看历史记录
console.table(game.getMoves())
```

---

## ✅ 当前状态

**当前阶段**: 阶段0 - 环境准备  
**下一步**: 执行任务0.1 - 创建项目目录结构  
**总体进度**: 0%  

---

**文档版本**: v1.0.0  
**最后更新**: 2025-01-20  
**维护者**: AI开发团队
