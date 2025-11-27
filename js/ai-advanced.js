/**
 * AdvancedAI - 高级AI模块（桥接器）
 * 
 * 注意：此类为AI功能的桥接层，实际AI算法由GomokuGame类实现。
 * 本类主要用于保持模块架构的完整性和未来扩展的可能性。
 * 
 * 实际AI实现位置：
 * - game-core.js: GomokuGame.getAIMove() 支持4个难度
 * - game-core.js: GomokuGame.getAIMoveNormal() 增强防守算法
 * - game-core.js: GomokuGame.evaluatePosition() 位置评分系统
 * 
 * @version 3.1.0
 */

class AdvancedAI {
    constructor(gameInstance) {
        this.game = gameInstance;
    }

    /**
     * AI决策入口（委托给game-core.js）
     * @param {string} difficulty - 难度: BEGINNER/NORMAL/HARD/HELL
     * @returns {{x: number, y: number}|null}
     */
    getMove(difficulty = 'NORMAL') {
        return this.game.getAIMove(difficulty);
    }

    /**
     * 获取AI提示（使用HARD难度）
     * @returns {{x: number, y: number}|null}
     */
    getHint() {
        return this.game.getAIMove('HARD');
    }

    /**
     * 检查是否有必胜手
     * @param {number} player - 玩家编号
     * @returns {{x: number, y: number}|null}
     */
    findWinningMove(player) {
        return this.game.findWinningMove(player);
    }
}

const AI_ADVANCED_MODULE_INFO = {
    name: 'AdvancedAI',
    version: '3.1.0',
    dependencies: ['GomokuGame'],
    description: 'AI功能桥接模块（实际AI实现在game-core.js）'
};

AdvancedAI.__moduleInfo = AI_ADVANCED_MODULE_INFO;

if (typeof window !== 'undefined') {
    window.AdvancedAI = AdvancedAI;
}
