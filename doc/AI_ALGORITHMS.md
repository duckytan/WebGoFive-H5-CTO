# AI算法详解

> **版本**: v2.0.0  
> **来源**: 基于《03_游戏规则与AI算法要点.md》整理

[参考原文档 `03_游戏规则与AI算法要点.md` 的 AI 算法部分]

详见: `03_游戏规则与AI算法要点.md` §4-6

---

## 核心内容摘要

### AI难度分级

| 难度 | 深度 | 算法 | 特性 |
|------|------|------|------|
| BEGINNER | 2层 | 简单评分 | 进攻偏好，易犯错 |
| NORMAL   | 3层 | Minimax + Alpha-Beta | 攻守平衡，识别活三冲四 |
| HARD     | 4层 | 迭代加深 + 威胁分析 | 识别双威胁，寻找必胜序列 |
| HELL     | 5层 | VCF搜索 + 完整威胁分析 | 开局库，VCF攻防，接近完美 |

### 关键算法

1. **Minimax算法** - 基础决策树搜索
2. **Alpha-Beta剪枝** - 优化搜索效率
3. **VCF搜索** - 连续冲四强制获胜
4. **威胁空间搜索** - Victor Allis理论
5. **评估函数** - 棋形评分系统

### API参考

- `ai.getMove(difficulty)` - 同步获取AI移动
- `ai.getMoveAsync(difficulty, options)` - 异步获取（推荐）
- `ai.searchVCF(player, maxDepth)` - VCF搜索
- `ai.analyzeSituation()` - 局面分析

完整API文档参见: [API_REFERENCE.md](./API_REFERENCE.md#advancedai)

---

**详细算法实现**: 请参考原文档 `03_游戏规则与AI算法要点.md`
