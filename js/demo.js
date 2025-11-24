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
        this.modeButtons = {
            PvP: document.getElementById('mode-pvp'),
            PvE: document.getElementById('mode-pve'),
            EvE: document.getElementById('mode-eve')
        };
        this.difficultySelect = document.getElementById('difficulty-select');
        this.difficultyWrapper = document.querySelector('.difficulty-wrapper');

        if (!this.canvas || !this.newGameButton || !this.undoButton || !this.statusPanel) {
            throw new Error('[InterfaceDemo] 关键DOM元素未找到');
        }

        this.currentMode = 'PvP';
        this.aiDifficulty = 'NORMAL';
        this.aiThinking = false;
        this.modeDisplayText = '';
        this.updateModeDisplay();
        this.updateModeButtons();
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

        if (this.modeButtons.PvP) {
            this.modeButtons.PvP.addEventListener('click', () => {
                this.switchMode('PvP');
            });
        }

        if (this.modeButtons.PvE) {
            this.modeButtons.PvE.addEventListener('click', () => {
                this.switchMode('PvE');
            });
        }

        if (this.modeButtons.EvE) {
            this.modeButtons.EvE.addEventListener('click', () => {
                this.switchMode('EvE');
            });
        }

        if (this.difficultySelect) {
            this.difficultySelect.addEventListener('change', (e) => {
                this.aiDifficulty = e.target.value;
                GameUtils.showMessage(`AI难度已设置为 ${this.getDifficultyName(this.aiDifficulty)}`, 'info', 1500);
            });
        }
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
            return;
        }

        if (this.currentMode === 'PvE' && this.game.currentPlayer === 2) {
            this.executeAIMove();
        } else if (this.currentMode === 'EvE') {
            this.executeAIMove();
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
     * 切换游戏模式
     * @param {string} mode - 游戏模式 (PvP/PvE/EvE)
     */
    switchMode(mode) {
        if (this.aiThinking) {
            GameUtils.showMessage('AI思考中，请稍候...', 'warning');
            return;
        }

        this.currentMode = mode;
        this.updateModeDisplay();
        this.updateModeButtons();
        this.startNewGame();

        const messages = {
            'PvP': '切换到双人对战模式',
            'PvE': `切换到人机对战模式 (${this.getDifficultyName(this.aiDifficulty)})`,
            'EvE': `切换到AI演示模式 (${this.getDifficultyName(this.aiDifficulty)})`
        };
        GameUtils.showMessage(messages[mode], 'info');

        if (mode === 'EvE') {
            setTimeout(() => this.executeAIMove(), 500);
        }
    }

    /**
     * 执行AI落子
     */
    async executeAIMove() {
        if (this.aiThinking || this.game.gameOver) {
            return;
        }

        this.aiThinking = true;
        this.updateStatusDisplay();

        if (this.renderer) {
            this.renderer.setInteractive(false);
        }

        await new Promise(resolve => setTimeout(resolve, 300));

        const aiMove = this.game.getAIMove(this.aiDifficulty);

        if (!aiMove) {
            this.aiThinking = false;
            this.updateStatusDisplay();
            if (this.renderer) {
                this.renderer.setInteractive(true);
            }
            GameUtils.showMessage('AI无法找到合适的落子位置', 'error');
            return;
        }

        await new Promise(resolve => setTimeout(resolve, 200));

        this.aiThinking = false;

        if (this.renderer) {
            this.renderer.placePiece(aiMove.x, aiMove.y);
            if (this.currentMode !== 'EvE') {
                this.renderer.setInteractive(true);
            }
        }
    }

    /**
     * 获取难度中文名称
     * @param {string} difficulty - 难度标识
     * @returns {string}
     */
    getDifficultyName(difficulty) {
        const nameMap = {
            'BEGINNER': '新手',
            'NORMAL': '普通',
            'HARD': '困难',
            'HELL': '地狱'
        };
        return nameMap[difficulty] || '普通';
    }

    /**
     * 更新模式显示信息
     */
    updateModeDisplay() {
        const modeMap = {
            PvP: 'PvP - 双人对战',
            PvE: 'PvE - 人机对战',
            EvE: 'EvE - AI演示'
        };
        this.modeDisplayText = modeMap[this.currentMode] || this.currentMode;
    }

    /**
     * 更新模式按钮状态
     */
    updateModeButtons() {
        Object.entries(this.modeButtons).forEach(([mode, btn]) => {
            if (!btn) return;
            if (mode === this.currentMode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        const showDifficulty = this.currentMode === 'PvE' || this.currentMode === 'EvE';
        if (this.difficultyWrapper) {
            this.difficultyWrapper.style.display = showDifficulty ? 'flex' : 'none';
        }
        if (this.difficultySelect) {
            this.difficultySelect.value = this.aiDifficulty;
        }
    }

    /**
     * 更新状态显示
     */
    updateStatusDisplay() {
        if (!this.statusPanel) {
            return;
        }

        const gameState = this.game.getGameState();
        let currentPlayerText;
        
        if (gameState.gameOver) {
            currentPlayerText = gameState.winner === 1 ? '黑方获胜' : '白方获胜';
        } else if (this.aiThinking) {
            currentPlayerText = 'AI思考中...';
        } else {
            currentPlayerText = gameState.currentPlayer === 1 ? '黑方回合' : '白方回合';
        }

        const moveCountText = `${gameState.moveCount} 步`;

        this.statusPanel.innerHTML = `
            <div class="info-item">
                <span class="info-label">当前阶段:</span>
                <span class="info-value">Stage 3 - AI系统 ✅</span>
            </div>
            <div class="info-item">
                <span class="info-label">当前模式:</span>
                <span class="info-value">${this.modeDisplayText}</span>
            </div>
            <div class="info-item">
                <span class="info-label">当前状态:</span>
                <span class="info-value ${gameState.gameOver ? 'game-over' : ''} ${this.aiThinking ? 'ai-thinking' : ''}">${currentPlayerText}</span>
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
            this.undoButton.disabled = this.game.moves.length === 0 || this.currentMode === 'EvE';
        }

        if (this.difficultySelect) {
            this.difficultySelect.disabled = this.currentMode === 'PvP';
        }
    }
}

const DEMO_MODULE_INFO = {
    name: 'InterfaceDemo',
    version: '3.0.0',
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
