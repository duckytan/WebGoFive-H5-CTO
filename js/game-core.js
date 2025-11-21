/**
 * GomokuGame - 核心游戏引擎
 * 负责棋盘状态、落子逻辑、胜负判定等核心流程
 * @version 1.0.0
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
        this.winLine = null;
        return this;
    }

    /**
     * 尝试落子
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     * @returns {Object} 落子结果
     */
    placePiece(x, y) {
        if (!GameUtils.isValidPosition(x, y, this.BOARD_SIZE)) {
            return {
                success: false,
                error: '坐标超出范围',
                code: 'INVALID_POSITION'
            };
        }

        if (this.board[y][x] !== 0) {
            return {
                success: false,
                error: '该位置已有棋子',
                code: 'POSITION_OCCUPIED'
            };
        }

        if (this.gameOver) {
            return {
                success: false,
                error: '游戏已结束',
                code: 'GAME_FINISHED'
            };
        }

        this.board[y][x] = this.currentPlayer;
        
        this.moves.push({
            x,
            y,
            player: this.currentPlayer,
            timestamp: Date.now()
        });

        const winResult = this.checkWin(x, y);
        
        if (winResult.hasWon) {
            this.gameOver = true;
            this.winner = this.currentPlayer;
            this.winLine = winResult.winLine;
            
            return {
                success: true,
                data: {
                    x,
                    y,
                    player: this.currentPlayer,
                    gameOver: true,
                    winner: this.winner,
                    winLine: winResult.winLine
                }
            };
        }

        const placedPlayer = this.currentPlayer;
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        
        return {
            success: true,
            data: {
                x,
                y,
                player: placedPlayer,
                gameOver: false,
                nextPlayer: this.currentPlayer
            }
        };
    }

    /**
     * 检查是否胜利
     * @param {number} x - 落子X坐标
     * @param {number} y - 落子Y坐标
     * @returns {Object} 胜利检测结果
     */
    checkWin(x, y) {
        const player = this.board[y][x];
        const directions = [
            { dx: 1, dy: 0 },   // 横向
            { dx: 0, dy: 1 },   // 纵向
            { dx: 1, dy: 1 },   // 左斜
            { dx: 1, dy: -1 }   // 右斜
        ];

        for (const { dx, dy } of directions) {
            const count = 1 +
                this.getLine(x, y, dx, dy, player) +
                this.getLine(x, y, -dx, -dy, player);

            if (count >= 5) {
                return {
                    hasWon: true,
                    winLine: { x, y, dx, dy, length: count }
                };
            }
        }

        return { hasWon: false };
    }

    /**
     * 获取某方向的连续棋子数
     * @param {number} x - 起始X坐标
     * @param {number} y - 起始Y坐标
     * @param {number} dx - X方向增量
     * @param {number} dy - Y方向增量
     * @param {number} player - 玩家编号
     * @returns {number} 连续棋子数
     */
    getLine(x, y, dx, dy, player) {
        let count = 0;
        let nx = x + dx;
        let ny = y + dy;

        while (
            GameUtils.isValidPosition(nx, ny, this.BOARD_SIZE) &&
            this.board[ny][nx] === player
        ) {
            count++;
            nx += dx;
            ny += dy;
        }

        return count;
    }

    /**
     * 悔棋
     * @param {number} steps - 悔棋步数，默认1
     * @returns {Object} 悔棋结果
     */
    undo(steps = 1) {
        if (this.moves.length === 0) {
            return {
                success: false,
                error: '没有可悔棋的步骤',
                code: 'NO_MOVES'
            };
        }

        const actualSteps = Math.min(steps, this.moves.length);
        
        for (let i = 0; i < actualSteps; i++) {
            const lastMove = this.moves.pop();
            this.board[lastMove.y][lastMove.x] = 0;
        }

        if (this.moves.length > 0) {
            const lastMove = this.moves[this.moves.length - 1];
            this.currentPlayer = lastMove.player === 1 ? 2 : 1;
        } else {
            this.currentPlayer = 1;
        }

        this.gameOver = false;
        this.winner = null;
        this.winLine = null;

        return {
            success: true,
            data: {
                stepsUndone: actualSteps,
                currentPlayer: this.currentPlayer
            }
        };
    }

    /**
     * 获取棋盘状态
     * @param {boolean} clone - 是否克隆返回
     * @returns {Array} 棋盘二维数组
     */
    getBoardState(clone = true) {
        return clone ? GameUtils.deepClone(this.board) : this.board;
    }

    /**
     * 获取历史记录
     * @returns {Array} 落子历史
     */
    getMoves() {
        return [...this.moves];
    }

    /**
     * 获取游戏状态摘要
     * @returns {Object} 游戏状态
     */
    getGameState() {
        return {
            currentPlayer: this.currentPlayer,
            gameOver: this.gameOver,
            winner: this.winner,
            moveCount: this.moves.length,
            winLine: this.winLine
        };
    }
}

const GAME_CORE_MODULE_INFO = {
    name: 'GomokuGame',
    version: '1.0.0',
    dependencies: ['GameUtils'],
    description: '五子棋核心引擎'
};

GomokuGame.__moduleInfo = GAME_CORE_MODULE_INFO;

if (typeof window !== 'undefined') {
    window.GomokuGame = GomokuGame;
}
