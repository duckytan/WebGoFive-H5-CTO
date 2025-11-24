/**
 * GameSaveLoad - 游戏存档管理模块
 * 负责游戏数据的保存和加载
 * @version 4.0.0
 */

class GameSaveLoad {
    constructor(gameInstance, rendererInstance) {
        if (!gameInstance) {
            throw new Error('[GameSaveLoad] 游戏实例未传入');
        }
        this.game = gameInstance;
        this.renderer = rendererInstance;
        this.fileInput = null;
        this.autoSaveEnabled = false;
        this.autoSaveInterval = null;
        this.initFileInput();
    }

    /**
     * 初始化文件输入元素
     */
    initFileInput() {
        this.fileInput = document.createElement('input');
        this.fileInput.type = 'file';
        this.fileInput.accept = '.json';
        this.fileInput.style.display = 'none';
        document.body.appendChild(this.fileInput);
        
        this.fileInput.addEventListener('change', (e) => this.handleFileLoad(e));
    }

    /**
     * 获取当前游戏数据
     * @returns {Object} 游戏完整数据
     */
    getCurrentGameData() {
        const gameState = this.game.getGameState();
        const moves = this.game.getMoves();
        const board = this.game.getBoardState(true);

        return {
            version: '4.0.0',
            timestamp: Date.now(),
            gameMode: this.game.gameMode || 'PvP',
            boardSize: this.game.BOARD_SIZE,
            currentPlayer: gameState.currentPlayer,
            gameOver: gameState.gameOver,
            winner: gameState.winner,
            winLine: gameState.winLine,
            moveCount: gameState.moveCount,
            moves: moves,
            board: board,
            metadata: {
                savedAt: new Date().toISOString(),
                appVersion: '4.0.0'
            }
        };
    }

    /**
     * 保存游戏到JSON文件
     * @returns {Object} 操作结果
     */
    saveGame() {
        try {
            const gameData = this.getCurrentGameData();
            const filename = GameUtils.generateFileName('gomoku_game', 'json');
            const result = GameUtils.downloadAsJSON(gameData, filename);

            if (result.success) {
                GameUtils.showMessage('游戏已保存', 'success', 2000);
                return { success: true, data: { filename } };
            } else {
                GameUtils.showMessage('保存失败：' + result.error, 'error');
                return result;
            }
        } catch (error) {
            console.error('[GameSaveLoad] saveGame错误:', error);
            GameUtils.showMessage('保存失败：' + error.message, 'error');
            return {
                success: false,
                error: error.message,
                code: 'SAVE_ERROR'
            };
        }
    }

    /**
     * 触发加载游戏文件选择
     */
    loadGame() {
        this.fileInput.click();
    }

    /**
     * 处理文件加载
     * @param {Event} event - 文件输入事件
     */
    handleFileLoad(event) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const jsonData = JSON.parse(e.target.result);
                const result = this.loadGameFromData(jsonData);
                
                if (result.success) {
                    GameUtils.showMessage('游戏已加载', 'success', 2000);
                } else {
                    GameUtils.showMessage('加载失败：' + result.error, 'error');
                }
            } catch (error) {
                console.error('[GameSaveLoad] 解析文件错误:', error);
                GameUtils.showMessage('文件格式错误', 'error');
            }
        };

        reader.onerror = () => {
            GameUtils.showMessage('读取文件失败', 'error');
        };

        reader.readAsText(file);
        
        // 重置input以允许加载同一文件
        event.target.value = '';
    }

    /**
     * 从数据加载游戏
     * @param {Object} data - 游戏数据
     * @returns {Object} 操作结果
     */
    loadGameFromData(data) {
        const validation = this.validateGameData(data);
        if (!validation.valid) {
            return {
                success: false,
                error: validation.error,
                code: 'INVALID_DATA'
            };
        }

        try {
            const result = this.restoreGameState(data);
            if (result.success && this.renderer) {
                this.renderer.clearForbiddenHighlight();
                this.renderer.winHighlight = null;
                
                if (data.winLine) {
                    this.renderer.updateWinHighlight(data.winLine);
                }
                
                this.renderer.render();
            }

            return result;
        } catch (error) {
            console.error('[GameSaveLoad] restoreGameState错误:', error);
            return {
                success: false,
                error: error.message,
                code: 'RESTORE_ERROR'
            };
        }
    }

    /**
     * 验证游戏数据
     * @param {Object} data - 游戏数据
     * @returns {{valid: boolean, error?: string}}
     */
    validateGameData(data) {
        if (!data || typeof data !== 'object') {
            return { valid: false, error: '数据格式无效' };
        }

        const requiredFields = ['version', 'boardSize', 'moves', 'board'];
        for (const field of requiredFields) {
            if (!(field in data)) {
                return { valid: false, error: `缺少必需字段: ${field}` };
            }
        }

        if (!Array.isArray(data.moves)) {
            return { valid: false, error: 'moves必须是数组' };
        }

        if (!Array.isArray(data.board)) {
            return { valid: false, error: 'board必须是数组' };
        }

        if (data.board.length !== data.boardSize) {
            return { valid: false, error: '棋盘尺寸不匹配' };
        }

        return { valid: true };
    }

    /**
     * 恢复游戏状态
     * @param {Object} data - 游戏数据
     * @returns {Object} 操作结果
     */
    restoreGameState(data) {
        try {
            // 重置游戏
            this.game.reset();

            // 恢复棋盘
            this.game.board = GameUtils.deepClone(data.board);

            // 恢复历史记录
            this.game.moves = GameUtils.deepClone(data.moves);

            // 恢复游戏状态
            this.game.currentPlayer = data.currentPlayer || 1;
            this.game.gameOver = data.gameOver || false;
            this.game.winner = data.winner || null;
            this.game.winLine = data.winLine || null;

            // 恢复游戏模式
            if (data.gameMode) {
                this.game.gameMode = data.gameMode;
            }

            return {
                success: true,
                data: {
                    moveCount: data.moves.length,
                    gameMode: data.gameMode
                }
            };
        } catch (error) {
            console.error('[GameSaveLoad] 恢复状态错误:', error);
            return {
                success: false,
                error: error.message,
                code: 'RESTORE_FAILED'
            };
        }
    }

    /**
     * 启用自动保存
     * @param {number} intervalMs - 自动保存间隔（毫秒）
     */
    enableAutoSave(intervalMs = 60000) {
        this.disableAutoSave();
        
        this.autoSaveEnabled = true;
        this.autoSaveInterval = setInterval(() => {
            if (!this.game.gameOver && this.game.moves.length > 0) {
                const gameData = this.getCurrentGameData();
                GameUtils.saveToLocalStorage('gomoku_autosave', gameData);
                console.log('[GameSaveLoad] 自动保存完成');
            }
        }, intervalMs);
    }

    /**
     * 禁用自动保存
     */
    disableAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }
        this.autoSaveEnabled = false;
    }

    /**
     * 加载自动保存的游戏
     * @returns {Object} 操作结果
     */
    loadAutoSave() {
        const result = GameUtils.loadFromLocalStorage('gomoku_autosave');
        
        if (!result.success) {
            return {
                success: false,
                error: '没有找到自动保存',
                code: 'NO_AUTOSAVE'
            };
        }

        return this.loadGameFromData(result.data);
    }

    /**
     * 清除自动保存
     */
    clearAutoSave() {
        localStorage.removeItem('gomoku_autosave');
    }

    /**
     * 销毁实例
     */
    destroy() {
        this.disableAutoSave();
        
        if (this.fileInput && this.fileInput.parentNode) {
            this.fileInput.parentNode.removeChild(this.fileInput);
        }
    }
}

const SAVE_LOAD_MODULE_INFO = {
    name: 'GameSaveLoad',
    version: '4.0.0',
    dependencies: ['GomokuGame', 'GameUtils'],
    description: '游戏存档管理模块'
};

GameSaveLoad.__moduleInfo = SAVE_LOAD_MODULE_INFO;

if (typeof window !== 'undefined') {
    window.GameSaveLoad = GameSaveLoad;
}
