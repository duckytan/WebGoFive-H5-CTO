/**
 * GomokuGame - 核心游戏引擎
 * 负责棋盘状态、落子逻辑、胜负判定等核心流程
 */

class GomokuGame {
    constructor(options = {}) {
        const { boardSize = 15 } = options;
        this.BOARD_SIZE = boardSize;
        this.reset();
    }

    /**
     * 重置棋盘
     * @returns {GomokuGame}
     */
    reset() {
        this.board = Array.from({ length: this.BOARD_SIZE }, () =>
            Array(this.BOARD_SIZE).fill(0)
        );
        this.moves = [];
        this.currentPlayer = 1;
        this.gameOver = false;
        this.winner = null;
        return this;
    }

    /**
     * 尝试落子
     * Stage 1 将实现完整逻辑
     */
    placePiece(x, y) {
        console.warn('[GomokuGame] placePiece 在Stage 0版本中尚未实现', { x, y });
        return {
            success: false,
            error: '核心逻辑开发中',
            code: 'NOT_IMPLEMENTED'
        };
    }

    /**
     * 获取棋盘状态
     * @param {boolean} clone - 是否克隆返回
     */
    getBoardState(clone = true) {
        return clone ? GameUtils.deepClone(this.board) : this.board;
    }

    /**
     * 获取游戏状态摘要
     * @returns {{currentPlayer: number, gameOver: boolean, winner: number|null}}
     */
    getGameState() {
        return {
            currentPlayer: this.currentPlayer,
            gameOver: this.gameOver,
            winner: this.winner,
            moveCount: this.moves.length
        };
    }
}

const GAME_CORE_MODULE_INFO = {
    name: 'GomokuGame',
    version: '0.1.0',
    dependencies: ['GameUtils'],
    description: '五子棋核心引擎 (Stage 0 占位版)'
};

GomokuGame.__moduleInfo = GAME_CORE_MODULE_INFO;

if (typeof window !== 'undefined') {
    window.GomokuGame = GomokuGame;
}
