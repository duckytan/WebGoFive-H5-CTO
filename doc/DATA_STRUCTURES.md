# 数据结构与格式规范

> **版本**: v2.0.0  
> **来源**: 《02_技术架构设计文档.md》 §3-5、《10_完整实现细节补充.md》 §3

---

## 1. 棋盘与状态结构

```javascript
const GameState = {
    board: Array(15).fill().map(() => Array(15).fill(0)),
    meta: {
        status: 'ready',         // 'ready'|'playing'|'finished'
        mode: 'PvE',             // 'PvP'|'PvE'|'EvE'|'VCF_PRACTICE'
        currentPlayer: 1,
        winner: null,
        startTime: null,
        endTime: null
    },
    history: {
        moves: [],               // [{x, y, player, timestamp, step}, ...]
        states: []               // 状态快照（可选）
    },
    ai: {
        difficulty: 'NORMAL',
        thinking: false
    },
    ui: {
        highlight: null,
        interactive: true,
        theme: 'classic'
    }
};
```

### 棋盘编码

- `0`: 空
- `1`: 黑棋
- `2`: 白棋

---

## 2. 落子记录 (Move)

```javascript
{
    x: number,
    y: number,
    player: number,          // 1=黑, 2=白
    timestamp: number,
    step: number
}
```

---

## 3. 游戏存档格式

```javascript
{
    version: '1.2.0',
    boardState: number[][],
    moves: Move[],
    meta: {
        mode: 'PvE',
        currentPlayer: 1,
        status: 'playing',
        aiDifficulty: 'HELL',
        settings: {
            showCoordinates: false,
            riskIndicator: true,
            sound: true,
            animations: true
        }
    },
    replay: {
        currentStep: number,
        speed: 1
    },
    timestamp: 1737427200000
}
```

### 兼容性
- 支持版本: `1.0.0` ~ `1.2.0`
- `GameSaveLoad` 在 `loadGame` 时校验版本并进行升级/降级

---

## 4. VCF题库结构

```javascript
{
    id: 'vcf-level1-001',
    title: '星位金钩',
    description: '黑棋补上缺口即可冲四',
    level: 1,                   // 1~4
    tags: ['入门', '金钩'],
    layout: [ [x, y, player], ... ],
    minMoves: 1,
    maxMoves: 6,
    hints: ['先在星位补子', '注意白棋封口'],
    solution: [
        { x: 8, y: 7, player: 1, desc: '补中间' },
        { x: 9, y: 7, player: 2, desc: '白棋挡右侧' },
        ...
    ]
}
```

### 进度存储

```javascript
{
    version: 'v3',
    lastLevel: 2,
    puzzlesCompleted: {
        'vcf-level1-001': true,
        ...
    },
    bestTimes: {
        'vcf-level1-001': 23.4,
        ...
    },
    streak: 3
}
```

- LocalStorage键: `vcf_practice_progress_v3`

---

## 5. 事件数据

| 事件 | 数据结构 |
|------|----------|
| `game:piece:placed` | `{ x, y, player, timestamp }` |
| `game:state:changed` | `{ oldState, newState, timestamp }` |
| `game:over` | `{ winner, reason, winLine }` |
| `ai:thinking:start` | `{ difficulty, timeout }` |
| `ai:thinking:end` | `{ move, duration }` |

---

## 6. UI设置数据

```javascript
{
    boardTheme: 'classic',
    showCoordinates: false,
    riskIndicator: true,
    soundEffects: true,
    animations: true,
    autoSave: true,
    forbiddenHints: true,
    hintCooldown: 3000
}
```

- LocalStorage键: `gomoku_ui_settings`

---

## 📖 参考
- `02_技术架构设计文档.md` §3-5
- `10_完整实现细节补充.md` §3
