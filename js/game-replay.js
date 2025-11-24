/**
 * GameReplay - 对局回放系统
 * 负责对已保存的对局进行回放控制
 * @version 4.0.0
 */

class GameReplay {
    constructor(gameInstance, rendererInstance, options = {}) {
        if (!gameInstance) {
            throw new Error('[GameReplay] 缺少游戏实例');
        }
        if (!rendererInstance) {
            throw new Error('[GameReplay] 缺少渲染器实例');
        }

        this.game = gameInstance;
        this.renderer = rendererInstance;
        this.replayData = null;
        this.currentStep = 0;
        this.isPlaying = false;
        this.playInterval = null;
        this.speed = options.speed || 1; // 步/秒
        this.onUpdate = typeof options.onUpdate === 'function' ? options.onUpdate : null;
        this.onStateChange = typeof options.onStateChange === 'function' ? options.onStateChange : null;
    }

    /**
     * 开始回放
     * @param {Object} gameData - 游戏数据
     */
    startReplay(gameData) {
        if (!gameData || !Array.isArray(gameData.moves)) {
            throw new Error('[GameReplay] 无效的游戏数据');
        }

        this.stop();
        this.replayData = gameData;
        this.currentStep = 0;
        this.game.reset();
        this.renderer.setInteractive(false);
        this.renderer.render();
        this.notifyStateChange();
        this.updateUI();
    }

    /**
     * 播放回放
     */
    play() {
        if (!this.replayData || this.isPlaying) {
            return;
        }

        this.isPlaying = true;
        this.notifyStateChange();
        
        const interval = 1000 / this.speed;
        this.playInterval = setInterval(() => {
            if (this.currentStep >= this.replayData.moves.length) {
                this.pause();
                return;
            }
            this.stepForward();
        }, interval);
    }

    /**
     * 暂停回放
     */
    pause() {
        if (!this.isPlaying) {
            return;
        }

        this.isPlaying = false;
        if (this.playInterval) {
            clearInterval(this.playInterval);
            this.playInterval = null;
        }
        this.notifyStateChange();
    }

    /**
     * 停止回放并重置
     */
    stop() {
        this.pause();
        this.replayData = null;
        this.currentStep = 0;
        this.game.reset();
        this.renderer.setInteractive(true);
        this.renderer.render();
        this.notifyStateChange();
        this.updateUI();
    }

    /**
     * 单步前进
     */
    stepForward() {
        if (!this.replayData || this.currentStep >= this.replayData.moves.length) {
            return;
        }

        const move = this.replayData.moves[this.currentStep];
        const result = this.renderer.placePiece(move.x, move.y);
        
        if (result.success) {
            this.currentStep += 1;
            this.updateUI();
        } else {
            console.warn('[GameReplay] 无法执行回放步骤:', result.error);
            this.pause();
        }
    }

    /**
     * 单步后退
     */
    stepBackward() {
        if (this.currentStep <= 0) {
            return;
        }

        this.pause();
        this.game.undo();
        this.renderer.render();
        this.currentStep -= 1;
        this.updateUI();
    }

    /**
     * 跳转到指定步骤
     * @param {number} index - 目标步骤
     */
    jumpToStep(index) {
        if (!this.replayData) {
            return;
        }

        const target = Math.max(0, Math.min(index, this.replayData.moves.length));
        
        this.pause();
        this.game.reset();
        this.renderer.render();

        for (let i = 0; i < target; i++) {
            const move = this.replayData.moves[i];
            this.game.placePiece(move.x, move.y);
        }

        this.currentStep = target;
        this.renderer.render();
        this.updateUI();
    }

    /**
     * 设置播放速度
     * @param {number} speed - 步/秒
     */
    setSpeed(speed) {
        this.speed = Math.max(0.5, Math.min(speed, 5));
        if (this.isPlaying) {
            this.pause();
            this.play();
        }
        this.updateUI();
    }

    /**
     * 获取回放进度百分比
     * @returns {number}
     */
    getProgress() {
        if (!this.replayData || this.replayData.moves.length === 0) {
            return 0;
        }
        return (this.currentStep / this.replayData.moves.length) * 100;
    }

    /**
     * 更新UI（通过回调）
     */
    updateUI() {
        if (this.onUpdate) {
            this.onUpdate({
                currentStep: this.currentStep,
                totalSteps: this.replayData ? this.replayData.moves.length : 0,
                progress: this.getProgress(),
                isPlaying: this.isPlaying,
                speed: this.speed
            });
        }
    }

    /**
     * 通知状态变化
     */
    notifyStateChange() {
        if (this.onStateChange) {
            this.onStateChange({
                isPlaying: this.isPlaying,
                hasData: !!this.replayData
            });
        }
    }
}

const REPLAY_MODULE_INFO = {
    name: 'GameReplay',
    version: '4.0.0',
    dependencies: ['GomokuGame', 'SimpleBoardRenderer'],
    description: '对局回放模块'
};

GameReplay.__moduleInfo = REPLAY_MODULE_INFO;

if (typeof window !== 'undefined') {
    window.GameReplay = GameReplay;
}
