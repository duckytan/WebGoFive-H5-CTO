/**
 * InterfaceDemo - UI控制器
 * 负责初始化应用、绑定事件、协调各模块
 * @version 4.0.0
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

        // 初始化存档管理
        this.saveLoadManager = new GameSaveLoad(this.game, this.renderer);
        const originalLoadGameFromData = this.saveLoadManager.loadGameFromData.bind(this.saveLoadManager);
        this.saveLoadManager.loadGameFromData = (data) => {
            const result = originalLoadGameFromData(data);
            if (result.success) {
                this.lastLoadedGameData = GameUtils.deepClone(data);
                this.stopReplayIfNeeded();
                this.updateControlStates();
            }
            return result;
        };

        // 初始化回放系统
        this.replayManager = new GameReplay(this.game, this.renderer, {
            onUpdate: (state) => this.updateReplayUI(state),
            onStateChange: (state) => this.handleReplayStateChange(state)
        });

        // 初始化VCF练习管理器
        this.vcfManager = new VCFPracticeManager();
        this.currentVCFPuzzle = null;
        this.currentVCFLevel = 1;
        this.isVCFMode = false;
        this.vcfBusy = false;

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
        const required = ['GameUtils', 'GomokuGame', 'SimpleBoardRenderer', 'GameSaveLoad', 'GameReplay', 'VCFPracticeManager'];
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
            EvE: document.getElementById('mode-eve'),
            VCF: document.getElementById('mode-vcf')
        };
        this.difficultySelect = document.getElementById('difficulty-select');
        this.difficultyWrapper = document.querySelector('.difficulty-wrapper');
        this.vcfLevelWrapper = document.querySelector('.vcf-level-wrapper');
        this.vcfLevelSelect = document.getElementById('vcf-level-select');
        this.vcfActionsGroup = document.getElementById('vcf-actions');
        this.vcfStartButton = document.getElementById('vcf-start-button');
        this.vcfRestartButton = document.getElementById('vcf-restart-button');
        this.vcfHintButton = document.getElementById('vcf-hint-button');
        this.vcfSolutionButton = document.getElementById('vcf-solution-button');
        this.vcfStatusCard = document.getElementById('vcf-status-card');
        this.vcfPuzzleNameEl = document.getElementById('vcf-puzzle-name');
        this.vcfPuzzleLevelEl = document.getElementById('vcf-puzzle-level');
        this.vcfPuzzleDescriptionEl = document.getElementById('vcf-puzzle-description');
        this.vcfProgressTextEl = document.getElementById('vcf-progress-text');
        this.vcfOverallProgressEl = document.getElementById('vcf-overall-progress');
        this.vcfHintTextEl = document.getElementById('vcf-hint-text');
        this.vcfNextStepTextEl = document.getElementById('vcf-next-step-text');
        this.saveButton = document.getElementById('save-button');
        this.loadButton = document.getElementById('load-button');
        this.autoSaveButton = document.getElementById('auto-save-button');
        this.replayCurrentButton = document.getElementById('replay-current-button');
        this.replayLoadedButton = document.getElementById('replay-loaded-button');
        this.replayStopButton = document.getElementById('replay-stop-button');
        this.replayPlayButton = document.getElementById('replay-play-button');
        this.replayPauseButton = document.getElementById('replay-pause-button');
        this.replayStepBackwardButton = document.getElementById('replay-step-backward-button');
        this.replayStepForwardButton = document.getElementById('replay-step-forward-button');
        this.replaySpeedSelect = document.getElementById('replay-speed-select');
        this.replayProgressInput = document.getElementById('replay-progress');
        this.replayProgressLabel = document.getElementById('replay-progress-label');

        if (!this.canvas || !this.newGameButton || !this.undoButton || !this.statusPanel) {
            throw new Error('[InterfaceDemo] 关键DOM元素未找到');
        }

        this.currentMode = 'PvP';
        this.aiDifficulty = 'NORMAL';
        this.aiThinking = false;
        this.autoSaveEnabled = false;
        this.lastLoadedGameData = null;
        this.isReplaying = false;
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

        if (this.modeButtons.VCF) {
            this.modeButtons.VCF.addEventListener('click', () => {
                this.switchMode('VCF_PRACTICE');
            });
        }

        if (this.difficultySelect) {
            this.difficultySelect.addEventListener('change', (e) => {
                this.aiDifficulty = e.target.value;
                GameUtils.showMessage(`AI难度已设置为 ${this.getDifficultyName(this.aiDifficulty)}`, 'info', 1500);
            });
        }

        if (this.vcfLevelSelect) {
            this.vcfLevelSelect.addEventListener('change', (e) => {
                this.currentVCFLevel = parseInt(e.target.value, 10) || 1;
                if (this.isVCFMode) {
                    this.startVCFPuzzle();
                }
            });
        }

        if (this.vcfStartButton) {
            this.vcfStartButton.addEventListener('click', () => this.startVCFPuzzle());
        }

        if (this.vcfRestartButton) {
            this.vcfRestartButton.addEventListener('click', () => this.restartVCFPuzzle());
        }

        if (this.vcfHintButton) {
            this.vcfHintButton.addEventListener('click', () => this.showVCFHint());
        }

        if (this.vcfSolutionButton) {
            this.vcfSolutionButton.addEventListener('click', () => this.showVCFSolution());
        }

        if (this.canvas) {
            this.canvas.addEventListener('click', (event) => {
                if (!this.isVCFMode) {
                    return;
                }
                event.stopImmediatePropagation();
                event.preventDefault();
                const { x, y } = this.renderer.getBoardPositionFromEvent(event);
                if (x !== -1 && y !== -1) {
                    this.handleVCFPracticeMove(x, y);
                }
            }, true);
        }

        if (this.saveButton) {
            this.saveButton.addEventListener('click', () => this.handleSave());
        }

        if (this.loadButton) {
            this.loadButton.addEventListener('click', () => this.handleLoad());
        }

        if (this.autoSaveButton) {
            this.autoSaveButton.addEventListener('click', () => this.toggleAutoSave());
        }

        if (this.replayCurrentButton) {
            this.replayCurrentButton.addEventListener('click', () => this.handleReplayCurrent());
        }

        if (this.replayLoadedButton) {
            this.replayLoadedButton.addEventListener('click', () => this.handleReplayLoaded());
        }

        if (this.replayStopButton) {
            this.replayStopButton.addEventListener('click', () => this.handleReplayStop());
        }

        if (this.replayPlayButton) {
            this.replayPlayButton.addEventListener('click', () => this.handleReplayPlay());
        }

        if (this.replayPauseButton) {
            this.replayPauseButton.addEventListener('click', () => this.handleReplayPause());
        }

        if (this.replayStepBackwardButton) {
            this.replayStepBackwardButton.addEventListener('click', () => this.handleReplayStepBackward());
        }

        if (this.replayStepForwardButton) {
            this.replayStepForwardButton.addEventListener('click', () => this.handleReplayStepForward());
        }

        if (this.replaySpeedSelect) {
            this.replaySpeedSelect.addEventListener('change', (e) => {
                this.replayManager.setSpeed(parseFloat(e.target.value));
            });
        }

        if (this.replayProgressInput) {
            this.replayProgressInput.addEventListener('input', (e) => {
                const targetStep = Math.round((e.target.value / 100) * (this.replayManager.replayData?.moves.length || 0));
                this.replayManager.jumpToStep(targetStep);
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

        if (this.isReplaying) {
            this.updateReplayUI(this.getReplayStateSnapshot());
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
        this.stopReplayIfNeeded();
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
        if (this.isReplaying) {
            GameUtils.showMessage('回放模式下不能悔棋', 'warning');
            return;
        }
        
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
                <span class="info-value">Stage 4 - 存档回放 ✅</span>
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
            this.undoButton.disabled = this.game.moves.length === 0 || this.currentMode === 'EvE' || this.isReplaying;
        }

        if (this.difficultySelect) {
            this.difficultySelect.disabled = this.currentMode === 'PvP';
        }
    }

    handleSave() {
        if (this.game.moves.length === 0) {
            GameUtils.showMessage('没有可保存的棋局', 'warning');
            return;
        }
        this.saveLoadManager.saveGame();
    }

    handleLoad() {
        this.saveLoadManager.loadGame();
    }

    toggleAutoSave() {
        if (this.autoSaveEnabled) {
            this.saveLoadManager.disableAutoSave();
            this.autoSaveEnabled = false;
            if (this.autoSaveButton) {
                this.autoSaveButton.textContent = '自动保存：关闭';
            }
            GameUtils.showMessage('自动保存已关闭', 'info', 1500);
        } else {
            this.saveLoadManager.enableAutoSave(60000);
            this.autoSaveEnabled = true;
            if (this.autoSaveButton) {
                this.autoSaveButton.textContent = '自动保存：开启';
            }
            GameUtils.showMessage('自动保存已开启（每分钟）', 'success', 1500);
        }
    }

    handleReplayCurrent() {
        if (this.game.moves.length === 0) {
            GameUtils.showMessage('没有可回放的棋局', 'warning');
            return;
        }
        const gameData = this.saveLoadManager.getCurrentGameData();
        this.replayManager.startReplay(gameData);
        this.isReplaying = true;
        GameUtils.showMessage('开始回放当前棋局', 'info', 1500);
    }

    handleReplayLoaded() {
        if (!this.lastLoadedGameData) {
            GameUtils.showMessage('请先加载一个棋局', 'warning');
            return;
        }
        this.replayManager.startReplay(this.lastLoadedGameData);
        this.isReplaying = true;
        GameUtils.showMessage('开始回放载入的棋局', 'info', 1500);
    }

    handleReplayStop() {
        this.replayManager.stop();
        this.isReplaying = false;
        this.updateControlStates();
        GameUtils.showMessage('已退出回放模式', 'info', 1500);
    }

    handleReplayPlay() {
        this.replayManager.play();
    }

    handleReplayPause() {
        this.replayManager.pause();
    }

    handleReplayStepBackward() {
        this.replayManager.stepBackward();
    }

    handleReplayStepForward() {
        this.replayManager.stepForward();
    }

    updateReplayUI(state) {
        if (this.replayProgressInput) {
            this.replayProgressInput.value = state.progress;
        }
        if (this.replayProgressLabel) {
            this.replayProgressLabel.textContent = `${state.currentStep} / ${state.totalSteps}`;
        }
    }

    handleReplayStateChange(state) {
        const controlsDisabled = !state.hasData;
        if (this.replayPlayButton) this.replayPlayButton.disabled = controlsDisabled || state.isPlaying;
        if (this.replayPauseButton) this.replayPauseButton.disabled = controlsDisabled || !state.isPlaying;
        if (this.replayStepBackwardButton) this.replayStepBackwardButton.disabled = controlsDisabled;
        if (this.replayStepForwardButton) this.replayStepForwardButton.disabled = controlsDisabled;
        if (this.replaySpeedSelect) this.replaySpeedSelect.disabled = controlsDisabled;
        if (this.replayProgressInput) this.replayProgressInput.disabled = controlsDisabled;
    }

    stopReplayIfNeeded() {
        if (this.isReplaying) {
            this.replayManager.stop();
            this.isReplaying = false;
        }
    }

    getReplayStateSnapshot() {
        return {
            currentStep: this.replayManager.currentStep,
            totalSteps: this.replayManager.replayData ? this.replayManager.replayData.moves.length : 0,
            progress: this.replayManager.getProgress(),
            isPlaying: this.replayManager.isPlaying,
            speed: this.replayManager.speed
        };
    }

    /**
     * 开始VCF练习
     */
    startVCFPuzzle() {
        GameUtils.showMessage('VCF练习模式开发中，请期待后续版本！', 'info', 3000);
        console.log('[VCF] 题库已就绪，等待UI完整集成');
        console.log('[VCF] 题库数量:', this.vcfManager.puzzles.length);
        console.log('[VCF] 当前难度:', this.currentVCFLevel);
        const progress = this.vcfManager.getProgress();
        console.log('[VCF] 完成进度:', progress);
    }

    /**
     * 重启VCF题目
     */
    restartVCFPuzzle() {
        GameUtils.showMessage('VCF重启功能开发中', 'info', 2000);
    }

    /**
     * 显示VCF提示
     */
    showVCFHint() {
        const hint = this.vcfManager.getHint();
        GameUtils.showMessage(`提示: ${hint}`, 'info', 3000);
    }

    /**
     * 显示VCF解法
     */
    showVCFSolution() {
        GameUtils.showMessage('解法查看功能开发中', 'info', 2000);
    }

    /**
     * 处理VCF练习落子
     */
    handleVCFPracticeMove(x, y) {
        console.log('[VCF] 玩家落子:', x, y);
        GameUtils.showMessage('VCF练习落子功能开发中', 'info', 2000);
    }
}

const DEMO_MODULE_INFO = {
    name: 'InterfaceDemo',
    version: '5.0.0',
    dependencies: ['GameUtils', 'GomokuGame', 'SimpleBoardRenderer', 'GameSaveLoad', 'GameReplay', 'VCFPracticeManager'],
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
