# 开发指南

> **版本**: v2.0.0  
> **来源**: 《06_开发建议与最佳实践.md》《07_核心代码示例与模板.md》《迁移文档使用指南.md》

---

## 快速开始

### 环境要求
- 现代浏览器 (Chrome 60+ / Firefox 55+ / Safari 12+)
- 本地HTTP服务器（推荐）

### 运行项目
```bash
cd gomoku-game
python3 -m http.server 8080
# 浏览器访问 http://localhost:8080
```

---

## 编码规范

完整规范参见: `06_开发建议与最佳实践.md` §1

### 命名约定

| 类型 | 格式 | 示例 |
|------|------|------|
| 类名 | PascalCase | `GomokuGame` |
| 函数/方法 | camelCase | `placePiece()` |
| 常量 | UPPER_SNAKE_CASE | `BOARD_SIZE` |
| 变量 | camelCase | `currentPlayer` |
| CSS类 | kebab-case | `game-board` |

### API返回值规范

```javascript
// 成功
{ success: true, data: any }

// 失败
{ success: false, error: string, code: string }
```

---

## 模块开发

### 模块导出模板

```javascript
class ModuleName {
    constructor(options = {}) {
        console.log('[ModuleName] 初始化');
    }
}

const MODULE_INFO = {
    name: 'ModuleName',
    version: '1.0.0',
    dependencies: []
};

ModuleName.__moduleInfo = MODULE_INFO;

if (typeof window !== 'undefined') {
    window.ModuleName = ModuleName;
}
```

### 异步API模式

```javascript
// 同步版本
syncMethod() {
    try {
        // 处理逻辑
        return { success: true, data: result };
    } catch (error) {
        return this._handleError(error);
    }
}

// 异步版本
async asyncMethod() {
    try {
        const result = await this._asyncOperation();
        return { success: true, data: result };
    } catch (error) {
        return this._handleError(error);
    }
}
```

---

## 代码示例

完整代码示例参见: `07_核心代码示例与模板.md`

### 核心功能模板
1. 模块导出模板 (§1)
2. 棋盘与落子 (§2)
3. 禁手检测 (§3)
4. Canvas渲染 (§4)
5. AI决策 (§5)
6. VCF练习 (§6)
7. 存档/回放 (§7)

---

## 调试技巧

### 使用GameDebug

```javascript
window.GameDebug = {
    board: () => console.table(game.getBoardState()),
    moves: () => console.table(game.getMoves()),
    forbidden: (x, y) => game.checkForbidden(x, y),
    aiHint: () => game.getHintMove()
};

// 使用
GameDebug.board();
GameDebug.forbidden(7, 7);
```

### 日志规范

```javascript
console.log('[ModuleName] 消息');
console.warn('[ModuleName] 警告');
console.error('[ModuleName] 错误:', error);
```

---

## 最佳实践

详见: `06_开发建议与最佳实践.md`

1. **防御性编程** - 参数校验和错误处理
2. **性能优化** - Canvas渲染、AI搜索
3. **代码复用** - 使用GameUtils
4. **状态管理** - 单一数据源
5. **模块化设计** - 职责单一
6. **测试友好** - 纯函数设计

---

## 开发流程

参见: `05_重新开发任务规划清单.md`

```
阶段0: 环境准备
阶段1: 核心功能
阶段2: 禁手规则
阶段3: AI系统
阶段4: 存档回放
阶段5: VCF练习
阶段6: UX优化
阶段7: 测试部署
```

---

## 常见问题

详见: `09_常见问题与解决方案.md` 或 [FAQ.md](./FAQ.md)

---

**完整开发指南**: 请参考 `doc_move` 目录下的原文档
