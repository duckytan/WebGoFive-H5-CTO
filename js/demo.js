/**
 * InterfaceDemo - UI控制器
 * 负责初始化应用、绑定事件、协调各模块
 * @version 1.0.0
 */

class InterfaceDemo {
    constructor() {
        // 依赖检查
        this.checkDependencies();

        // 获取DOM元素
        this.initDOMElements();

        // 初始化游戏实例
        this.game = new GomokuGame({ boardSize: 15 });

        // 初始化渲染器
        this.renderer = new SimpleBoardRenderer(this.canvas, this.game, {
            onMove: (result) => this.handleMoveResult(result)
        });

        // 绑定事件
        this.bindEvents();

        // 更新状态显示
        this.updateStatusDisplay();
        this.updateControlStates();

        GameUtils.showMessage('欢迎来到H5五子棋！禁手规则已启用，黑方先手。', 'info', 2000);
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
        this.undoButton = document.getElementById('undo-button');
        this.statusPanel = document.getElementById('status-panel');

        if (!this.canvas || !this.newGameButton || !this.undoButton || !this.statusPanel) {
            throw new Error('[InterfaceDemo] 关键DOM元素未找到');
        }

        this.currentMode = 'PvP';
        this.modeDisplayText = '';
        this.updateModeDisplay();
    }

    /**
     * 绑定事件监听
     */
    bindEvents() {
        this.newGameButton.addEventListener('click', () => {
            this.startNewGame();
        });

        this.undoButton.addEventListener('click', () => {
            this.handleUndo();
        });
    }

    /**
     * 处理渲染器回调结果
     * @param {Object} result - 游戏返回结果
     */
    handleMoveResult(result) {
        if (!result || !result.success) {
            return;
        }

        this.updateStatusDisplay();
        this.updateControlStates();

        if (result.data.gameOver) {
            const winnerText = result.data.winner === 1 ? '黑方' : '白方';
            GameUtils.showMessage(`🎉 ${winnerText}获胜！`, 'success', 4000);
            if (this.renderer) {
                this.renderer.setInteractive(false);
            }
        }
    }

    /**
     * 开始新游戏
     */
    startNewGame() {
        this.game.reset();
        if (this.renderer) {
            this.renderer.winHighlight = null;
            this.renderer.setInteractive(true);
            if (typeof this.renderer.clearForbiddenHighlight === 'function') {
                this.renderer.clearForbiddenHighlight();
            }
            this.renderer.render();
        }
        this.updateStatusDisplay();
        this.updateControlStates();
        GameUtils.showMessage('新游戏开始，黑方先手。', 'info');
    }

    /**
     * 悔棋一步
     */
    handleUndo() {
        const result = this.game.undo();
        if (!result.success) {
            GameUtils.showMessage(result.error, 'warning');
            return;
        }

        if (this.renderer) {
            this.renderer.setInteractive(true);
            this.renderer.winHighlight = null;
            if (typeof this.renderer.clearForbiddenHighlight === 'function') {
                this.renderer.clearForbiddenHighlight();
            }
            this.renderer.render();
        }

        this.updateStatusDisplay();
        this.updateControlStates();

        const nextPlayerText = this.game.getGameState().currentPlayer === 1 ? '黑方' : '白方';
        GameUtils.showMessage(`悔棋成功，轮到${nextPlayerText}。`, 'info');
    }

    /**
     * 更新模式显示信息
     */
    updateModeDisplay() {
        const modeMap = {
            PvP: 'PvP - 双人对战'
        };
        this.modeDisplayText = modeMap[this.currentMode] || this.currentMode;
    }

    /**
     * 更新状态显示
     */
    updateStatusDisplay() {
        if (!this.statusPanel) {
            return;
        }

        const gameState = this.game.getGameState();
        const currentPlayerText = gameState.gameOver
            ? (gameState.winner === 1 ? '黑方获胜' : '白方获胜')
            : (gameState.currentPlayer === 1 ? '黑方回合' : '白方回合');

        const moveCountText = `${gameState.moveCount} 步`;

        this.statusPanel.innerHTML = `
            <div class="info-item">
                <span class="info-label">当前阶段:</span>
                <span class="info-value">Stage 2 - 规则完善 ✅</span>
            </div>
            <div class="info-item">
                <span class="info-label">当前模式:</span>
                <span class="info-value">${this.modeDisplayText}</span>
            </div>
            <div class="info-item">
                <span class="info-label">当前状态:</span>
                <span class="info-value ${gameState.gameOver ? 'game-over' : ''}">${currentPlayerText}</span>
            </div>
            <div class="info-item">
                <span class="info-label">总步数:</span>
                <span class="info-value">${moveCountText}</span>
            </div>
        `;
    }

    /**
     * 更新控制按钮状态
     */
    updateControlStates() {
        if (this.undoButton) {
            this.undoButton.disabled = this.game.moves.length === 0;
        }
    }
}

const DEMO_MODULE_INFO = {
    name: 'InterfaceDemo',
    version: '2.0.0',
    dependencies: ['GameUtils', 'GomokuGame', 'SimpleBoardRenderer'],
    description: 'UI控制器'
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
