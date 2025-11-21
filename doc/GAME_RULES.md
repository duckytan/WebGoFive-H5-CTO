# 游戏规则与禁手详解

> **版本**: v2.0.0  
> **来源**: 基于《03_游戏规则与AI算法要点.md》与《10_完整实现细节补充.md》整理

---

## 1. 棋盘与坐标体系

| 项目 | 说明 |
|------|------|
| 棋盘尺寸 | 15 × 15 网格（225个交叉点） |
| 坐标范围 | `x = 0~14`, `y = 0~14` |
| 数据结构 | `board[y][x]`，二维数组 |
| 初始状态 | 全部置0 (0=空, 1=黑, 2=白) |

```javascript
// 初始化棋盘
this.board = Array(15)
  .fill()
  .map(() => Array(15).fill(0));
```

### 坐标转换

| 输入 | 输出 | 方法 |
|------|------|------|
| Canvas坐标 | 棋盘坐标 | `gridX = Math.round((mouseX - padding) / cellSize)` |
| 棋盘坐标 | Canvas坐标 | `canvasX = padding + gridX * cellSize` |
| 棋盘坐标 | 棋谱标记 | `GameUtils.positionToNotation(x, y)` → “H8” |

---

## 2. 基本规则

### 2.1 落子流程

```javascript
placePiece(x, y) {
    if (!isValidPosition(x, y)) return error('INVALID_POSITION');
    if (board[y][x] !== 0) return error('POSITION_OCCUPIED');
    if (gameStatus === 'finished') return error('GAME_FINISHED');

    if (currentPlayer === BLACK) {
        const forbidden = checkForbidden(x, y);
        if (forbidden.isForbidden) return error('FORBIDDEN_MOVE', forbidden.type);
    }

    board[y][x] = currentPlayer;
    moves.push({ x, y, player: currentPlayer, timestamp: Date.now(), step: moves.length + 1 });

    const winResult = checkWin(x, y);
    if (winResult.isWin) return finishGame(currentPlayer, winResult);

    if (moves.length === 225) return finishDraw();

    currentPlayer = currentPlayer === BLACK ? WHITE : BLACK;
    return { success: true, gameOver: false, nextPlayer: currentPlayer };
}
```

### 2.2 胜负判定

- 方向: 横(→)、竖(↓)、主对角(↘)、副对角(↗)
- 连续5子即判胜
- 若同时触发禁手与五连，五连优先（黑棋仍获胜）

```javascript
checkWin(x, y) {
    const player = board[y][x];
    const directions = [
        { dx: 1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: 1, dy: 1 },
        { dx: 1, dy: -1 }
    ];
    for (const dir of directions) {
        const line = getLine(x, y, dir.dx, dir.dy, player);
        if (line.length >= 5) {
            return { isWin: true, winLine: line, direction: dir };
        }
    }
    return { isWin: false };
}
```

---

## 3. 禁手规则（仅对黑棋）

### 3.1 禁手类型

| 类型 | 定义 | 判定依据 |
|------|------|----------|
| 三三禁手 | 一步棋形成两个及以上“活三” | `countOpenThrees >= 2` |
| 四四禁手 | 一步棋形成两个及以上“四”（活四/冲四） | `countOpenFours >= 2` |
| 长连禁手 | 一步棋形成6子或以上连线 | `checkLongLine().hasLongLine` |

**判定流程**:
1. 临时落子 → `board[y][x] = BLACK`
2. 检查长连
3. 统计活三/活四数量
4. 恢复棋盘 → `board[y][x] = EMPTY`
5. 根据数量判定禁手结果

**代码模板**: 参考 `07_核心代码示例与模板.md` §3

### 3.2 活三/活四模式

| 模式类型 | 字符串表示 | 说明 |
|----------|------------|------|
| 活三 | `01110`, `011010`, `010110` | 两端开放的三连 |
| 活四 | `011110` | 两端开放的四连 |
| 冲四 | `01111`, `11110`, `11011` | 一端被堵的四连 |

> 线性签名: 使用长度9的窗口（落点±4格），边界记为3 → 正则匹配时替换为2。

---

## 4. AI相关规则

详见 [AI算法详解](./AI_ALGORITHMS.md)
- AI难度等级与搜索深度
- VCF搜索规则
- 威胁空间搜索 (Threat Space Search)

---

## 5. VCF练习规则

| 项目 | 说明 |
|------|------|
| 题库规模 | 40题，分4个难度（每级10题） |
| 数据结构 | 详见 [DATA_STRUCTURES.md](./DATA_STRUCTURES.md#vcf-题库) |
| 验证流程 | `validateMove → advanceStep → executeAIDefense` |
| 防守规则 | AI固定地狱难度，延迟400ms落子 |
| 进度存储 | LocalStorage键 `vcf_practice_progress_v3` |

---

## 6. 快速校验清单

- [ ] 棋盘为15×15
- [ ] 黑棋禁手仅在黑方生效
- [ ] 五连优先于禁手
- [ ] 悔棋按顺序回退
- [ ] VCF模式禁用悔棋/存档/回放
- [ ] 游戏模式切换自动重置棋盘

---

## 📖 参考文档
- `03_游戏规则与AI算法要点.md`
- `07_核心代码示例与模板.md`
- `10_完整实现细节补充.md`
