/**
 * InterfaceDemo - UI控制器
 * 负责初始化应用、绑定事件、协调各模块
 */

class InterfaceDemo {
    constructor() {
        // 依赖检查
        this.checkDependencies();

        // 获取DOM元素
        this.initDOMElements();

        // 初始化游戏实例（占位）
        this.game = new GomokuGame({ boardSize: 15 });

        // 初始化渲染器（占位）
        this.renderer = null; // Stage 1 实现

        // 绑定事件
        this.bindEvents();

        // 更新状态显示
        this.updateStatusDisplay();
    }

    /**
     * 检查必需依赖
     */
    checkDependencies() {
        const required = ['GameUtils', 'GomokuGame', 'SimpleBoardRenderer'];
        const missing = [];

        required.forEach(dep => {
            if (typeof window[dep] === 'undefined') {
                missing.push(dep);
            }
        });

        if (missing.length > 0) {
            const errorMsg = `缺少必需模块: ${missing.join(', ')}`;
            console.error('[InterfaceDemo]', errorMsg);
            alert(errorMsg + '\n请检查JS文件加载顺序！');
            throw new Error(errorMsg);
        }
    }

    /**
     * 初始化DOM元素引用
     */
    initDOMElements() {
        this.canvas = document.getElementById('game-board');
        this.newGameButton = document.getElementById('new-game-button');
        this.statusPanel = document.getElementById('status-panel');

        if (!this.canvas || !this.newGameButton || !this.statusPanel) {
            throw new Error('[InterfaceDemo] 关键DOM元素未找到');
        }
    }

    /**
     * 绑定事件监听
     */
    bindEvents() {
        this.newGameButton.addEventListener('click', () => {
            this.handleNewGame();
        });
    }

    /**
     * 处理"新游戏"按钮点击
     */
    handleNewGame() {
        alert('新游戏功能将在 Stage 1 实现！');
    }

    /**
     * 更新状态显示
     */
    updateStatusDisplay() {
        if (this.statusPanel) {
            this.statusPanel.innerHTML = `
                <div class="status-item">
                    <strong>当前阶段:</strong> Stage 0 - 环境准备
                </div>
                <div class="status-item">
                    <strong>模块状态:</strong> 
                    GameUtils ✅ | GomokuGame ✅ | SimpleBoardRenderer ✅ | InterfaceDemo ✅
                </div>
                <div class="status-item">
                    <strong>下一步:</strong> Stage 1 - 实现核心游戏逻辑
                </div>
            `;
        }
    }
}

const DEMO_MODULE_INFO = {
    name: 'InterfaceDemo',
    version: '0.1.0',
    dependencies: ['GameUtils', 'GomokuGame', 'SimpleBoardRenderer'],
    description: 'UI控制器 (Stage 0 占位版)'
};

InterfaceDemo.__moduleInfo = DEMO_MODULE_INFO;

// 等待DOM加载完成后初始化
if (typeof window !== 'undefined') {
    window.InterfaceDemo = InterfaceDemo;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.demoInstance = new InterfaceDemo();
        });
    } else {
        window.demoInstance = new InterfaceDemo();
    }
}
