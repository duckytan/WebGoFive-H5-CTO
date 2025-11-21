# 测试与部署指南

> **版本**: v2.0.0  
> **来源**: 《08_测试与部署指南.md》

[映射到原文档]

详细内容请参考: `08_测试与部署指南.md`

---

## 快速参考

### 功能测试清单
- [ ] 基础游戏功能（§1.1）
- [ ] 禁手规则（§1.1）
- [ ] AI系统（§1.1）
- [ ] 游戏模式（§1.1）
- [ ] 存档回放（§1.1）
- [ ] VCF练习（§1.1）

### 部署步骤

**GitHub Pages**:
```bash
git init
git add .
git commit -m "Initial commit"
git push -u origin main
# Settings → Pages → Source: main branch
```

**本地测试**:
```bash
python3 -m http.server 8080
```

---

## 性能指标

| 指标 | 目标 |
|------|------|
| 首屏加载 | < 3秒 |
| Canvas FPS | ≥ 60 |
| AI思考时间 | BEGINNER <0.5s, HELL <3s |
| 内存占用 | < 50MB |

---

## 兼容性测试

| 浏览器 | 版本 | 状态 |
|--------|------|------|
| Chrome | 60+ | ✅ 主要支持 |
| Firefox | 55+ | ✅ 完全兼容 |
| Safari | 12+ | ✅ 需测试 |
| Edge | 79+ | ✅ Chromium |
| IE11 | - | ❌ 不支持 |

---

**详细指南**: 参见 `08_测试与部署指南.md`
