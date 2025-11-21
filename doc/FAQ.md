# 常见问题 FAQ

> **版本**: v2.0.0  
> **来源**: 《09_常见问题与解决方案.md》

---

## 目录
1. 模块加载问题
2. 棋盘/渲染
3. 禁手与规则
4. AI问题
5. 存档/加载
6. 回放系统
7. VCF练习
8. UI交互
9. 部署问题
10. 调试技巧

> 每个问题的完整描述与解决方案请参考 `09_常见问题与解决方案.md`

---

## 快速索引

| 问题类型 | 参考章节 |
|----------|----------|
| `GomokuGame is not defined` | Q1 |
| Canvas模糊 | Q3 |
| 黑棋无法落子 | Q5 |
| AI不响应 | Q7 |
| 存档版本不兼容 | Q9 |
| 回放进度条不更新 | Q11 |
| VCF进度不保存 | Q14 |
| 模式切换状态错乱 | Q15 |
| GitHub Pages 404 | Q17 |

---

## 重点提醒

1. **模块加载顺序**: `utils → game-core → ai → renderer → save/load → replay → vcf → demo`
2. **Canvas尺寸**: 需匹配CSS并处理`devicePixelRatio`
3. **禁手优先级**: 五连优先 → 禁手判定
4. **AI状态**: `aiThinking` 期间禁用交互
5. **VCF模式**: 独立逻辑，禁用悔棋/存档/回放

---

## 调试工具

```javascript
window.GameDebug = {
    board: () => console.table(game.getBoardState()),
    moves: () => console.table(game.getMoves()),
    forbidden: (x, y) => game.checkForbidden(x, y),
    aiHint: () => game.getHintMove()
};
```

---

**完整FAQ**: 请阅读 `09_常见问题与解决方案.md`
