/**
 * GomokuGame - 核心游戏引擎
 * 负责棋盘状态、落子逻辑、胜负判定、AI决策等核心流程
 * @version 3.0.0
 */

class GomokuGame {
    constructor(options = {}) {
        const { boardSize = 15, gameMode = 'PvP' } = options;
        this.BOARD_SIZE = boardSize;
        this.gameMode = gameMode;
        this.advancedAI = null;
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
     * 设置游戏模式
     * @param {string} mode - PvP/PvE/EvE
     * @returns {GomokuGame}
     */
    setGameMode(mode = 'PvP') {
        this.gameMode = mode;
        return this;
    }

    /**
     * 获取当前游戏模式
     * @returns {string}
     */
    getGameMode() {
        return this.gameMode;
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
        
        const winResult = this.checkWin(x, y);
        const isExactFive = winResult.hasWon && winResult.winLine.length === 5;
        const canClaimWin = this.currentPlayer === 1 ? isExactFive : winResult.hasWon;
        const shouldCheckForbidden = this.currentPlayer === 1 && !isExactFive;
        
        if (shouldCheckForbidden) {
            const forbiddenResult = this.checkForbidden(x, y);
            if (forbiddenResult.isForbidden) {
                this.board[y][x] = 0;
                return {
                    success: false,
                    error: `禁手：${forbiddenResult.type}`,
                    code: 'FORBIDDEN_MOVE',
                    data: {
                        x,
                        y,
                        forbiddenType: forbiddenResult.type,
                        details: forbiddenResult.details
                    }
                };
            }
        }
        
        this.moves.push({
            x,
            y,
            player: this.currentPlayer,
            timestamp: Date.now()
        });
        
        if (canClaimWin) {
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

    /**
     * 检查是否构成禁手
     * @param {number} x - 落子X坐标
     * @param {number} y - 落子Y坐标
     * @returns {{isForbidden: boolean, type?: string, details?: Object}}
     */
    checkForbidden(x, y) {
        const player = this.board[y][x];
        if (player !== 1) {
            return { isForbidden: false };
        }

        const longLine = this.checkLongLine(x, y, player);
        if (longLine) {
            return {
                isForbidden: true,
                type: '长连禁手',
                details: longLine
            };
        }

        const openThrees = this.countOpenThrees(x, y, player);
        if (openThrees >= 2) {
            return {
                isForbidden: true,
                type: '三三禁手',
                details: { openThrees }
            };
        }

        const openFours = this.countOpenFours(x, y, player);
        if (openFours >= 2) {
            return {
                isForbidden: true,
                type: '四四禁手',
                details: { openFours }
            };
        }

        return { isForbidden: false };
    }

    /**
     * 检查是否存在长连
     * @param {number} x - 落子X坐标
     * @param {number} y - 落子Y坐标
     * @param {number} player - 玩家
     * @returns {Object|null}
     */
    checkLongLine(x, y, player) {
        const directions = [
            { dx: 1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: 1, dy: 1 },
            { dx: 1, dy: -1 }
        ];

        for (const { dx, dy } of directions) {
            const forward = this.getLine(x, y, dx, dy, player);
            const backward = this.getLine(x, y, -dx, -dy, player);
            const total = 1 + forward + backward;

            if (total >= 6) {
                return {
                    direction: { dx, dy },
                    length: total
                };
            }
        }

        return null;
    }

    /**
     * 统计所有方向的活三数
     * @param {number} x - 落子X坐标
     * @param {number} y - 落子Y坐标
     * @param {number} player - 玩家
     * @returns {number}
     */
    countOpenThrees(x, y, player) {
        const directions = [
            { dx: 1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: 1, dy: 1 },
            { dx: 1, dy: -1 }
        ];
        const range = 6;
        let total = 0;

        for (const { dx, dy } of directions) {
            const signature = this.getLineSignature(x, y, dx, dy, player, range);
            total += this.countOpenThreesInLine(signature, range);
        }

        return total;
    }

    /**
     * 统计所有方向的活四数
     * @param {number} x - 落子X坐标
     * @param {number} y - 落子Y坐标
     * @param {number} player - 玩家
     * @returns {number}
     */
    countOpenFours(x, y, player) {
        const directions = [
            { dx: 1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: 1, dy: 1 },
            { dx: 1, dy: -1 }
        ];
        const range = 6;
        let total = 0;

        for (const { dx, dy } of directions) {
            const signature = this.getLineSignature(x, y, dx, dy, player, range);
            total += this.countOpenFoursInLine(signature, range);
        }

        return total;
    }

    /**
     * 获取指定方向的线性签名
     * @param {number} x - 落子X坐标
     * @param {number} y - 落子Y坐标
     * @param {number} dx - X方向增量
     * @param {number} dy - Y方向增量
     * @param {number} player - 玩家
     * @param {number} range - 范围
     * @returns {string}
     */
    getLineSignature(x, y, dx, dy, player, range = 6) {
        const values = [];
        for (let offset = -range; offset <= range; offset++) {
            const nx = x + dx * offset;
            const ny = y + dy * offset;

            if (!GameUtils.isValidPosition(nx, ny, this.BOARD_SIZE)) {
                values.push('2');
                continue;
            }

            const cell = this.board[ny][nx];
            if (cell === 0) {
                values.push('0');
            } else if (cell === player) {
                values.push('1');
            } else {
                values.push('2');
            }
        }
        return values.join('');
    }

    /**
     * 统计单条线中的活三
     * @param {string} signature - 线性签名
     * @param {number} range - 中心索引
     * @returns {number}
     */
    countOpenThreesInLine(signature, range) {
        const centerIndex = range;
        const patterns = [
            '0011100',
            '0011010',
            '0010110',
            '0101100',
            '0100110',
            '0110100'
        ];
        return this.countPatternsIncludingCenter(signature, patterns, centerIndex);
    }

    /**
     * 统计单条线中的活四
     * @param {string} signature - 线性签名
     * @param {number} range - 中心索引
     * @returns {number}
     */
    countOpenFoursInLine(signature, range) {
        const centerIndex = range;
        const patterns = [
            '0011110',
            '0111100',
            '0111010',
            '0101110',
            '0110110'
        ];
        return this.countPatternsIncludingCenter(signature, patterns, centerIndex);
    }

    /**
     * 统计包含当前落子的指定模式出现次数
     * @param {string} signature - 线性签名
     * @param {string[]} patterns - 模式集合
     * @param {number} centerIndex - 中心索引
     * @returns {number}
     */
    countPatternsIncludingCenter(signature, patterns, centerIndex) {
        let count = 0;
        for (const pattern of patterns) {
            let index = signature.indexOf(pattern);
            while (index !== -1) {
                const endIndex = index + pattern.length - 1;
                if (index <= centerIndex && centerIndex <= endIndex) {
                    count++;
                }
                index = signature.indexOf(pattern, index + 1);
            }
        }
        return count;
    }

    /**
     * 获取候选落子位置
     * @param {number} range - 搜索范围（已有棋子周围n格）
     * @param {number} limit - 最多返回数量
     * @returns {Array<{x: number, y: number}>}
     */
    getCandidateMoves(range = 2, limit = 20) {
        const candidates = new Set();
        
        if (this.moves.length === 0) {
            const center = Math.floor(this.BOARD_SIZE / 2);
            return [{ x: center, y: center }];
        }

        for (let y = 0; y < this.BOARD_SIZE; y++) {
            for (let x = 0; x < this.BOARD_SIZE; x++) {
                if (this.board[y][x] !== 0) {
                    for (let dy = -range; dy <= range; dy++) {
                        for (let dx = -range; dx <= range; dx++) {
                            const nx = x + dx;
                            const ny = y + dy;
                            if (
                                GameUtils.isValidPosition(nx, ny, this.BOARD_SIZE) &&
                                this.board[ny][nx] === 0
                            ) {
                                candidates.add(`${nx},${ny}`);
                            }
                        }
                    }
                }
            }
        }

        const result = Array.from(candidates).map(pos => {
            const [x, y] = pos.split(',').map(Number);
            return { x, y };
        });

        return result.slice(0, limit);
    }

    /**
     * 评估某位置的分数
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     * @param {number} player - 玩家
     * @returns {number}
     */
    evaluatePosition(x, y, player) {
        if (this.board[y][x] !== 0) {
            return -Infinity;
        }

        this.board[y][x] = player;
        let score = 0;

        const winCheck = this.checkWin(x, y);
        if (winCheck.hasWon) {
            this.board[y][x] = 0;
            return 100000;
        }

        if (player === 1) {
            const forbiddenCheck = this.checkForbidden(x, y);
            if (forbiddenCheck.isForbidden) {
                this.board[y][x] = 0;
                return -Infinity;
            }
        }

        const directions = [
            { dx: 1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: 1, dy: 1 },
            { dx: 1, dy: -1 }
        ];

        for (const { dx, dy } of directions) {
            const forward = this.getLine(x, y, dx, dy, player);
            const backward = this.getLine(x, y, -dx, -dy, player);
            const total = 1 + forward + backward;

            const forwardEmpty = this.getLine(x, y, dx, dy, 0);
            const backwardEmpty = this.getLine(x, y, -dx, -dy, 0);
            const openEnds = (forwardEmpty > 0 ? 1 : 0) + (backwardEmpty > 0 ? 1 : 0);

            if (total === 4 && openEnds === 2) score += 10000;
            else if (total === 4 && openEnds === 1) score += 1000;
            else if (total === 3 && openEnds === 2) score += 500;
            else if (total === 3 && openEnds === 1) score += 100;
            else if (total === 2 && openEnds === 2) score += 50;
            else if (total === 2 && openEnds === 1) score += 10;
            else if (total === 1 && openEnds === 2) score += 5;
        }

        this.board[y][x] = 0;
        return score;
    }

    /**
     * 寻找必胜点
     * @param {number} player - 玩家
     * @returns {{x: number, y: number}|null}
     */
    findWinningMove(player) {
        const candidates = this.getCandidateMoves(2, 50);
        
        for (const { x, y } of candidates) {
            this.board[y][x] = player;
            const winCheck = this.checkWin(x, y);
            this.board[y][x] = 0;
            
            if (winCheck.hasWon) {
                return { x, y };
            }
        }
        
        return null;
    }

    /**
     * AI决策入口
     * @param {string} difficulty - 难度: BEGINNER, NORMAL, HARD, HELL
     * @returns {{x: number, y: number}|null}
     */
    getAIMove(difficulty = 'NORMAL') {
        if (this.gameOver) {
            return null;
        }

        const difficultyMap = {
            'BEGINNER': this.getAIMoveBeginner.bind(this),
            'NORMAL': this.getAIMoveNormal.bind(this),
            'HARD': this.getAIMoveNormal.bind(this),
            'HELL': this.getAIMoveNormal.bind(this)
        };

        const moveFunc = difficultyMap[difficulty] || difficultyMap['NORMAL'];
        return moveFunc();
    }

    /**
     * 新手AI - 随机落子在候选位置
     * @returns {{x: number, y: number}|null}
     */
    getAIMoveBeginner() {
        const candidates = this.getCandidateMoves(2, 30);
        if (candidates.length === 0) {
            return null;
        }
        
        const randomIndex = Math.floor(Math.random() * candidates.length);
        return candidates[randomIndex];
    }

    /**
     * 普通AI - 基于评分的贪心算法（增强防守能力）
     * @returns {{x: number, y: number}|null}
     */
    getAIMoveNormal() {
        const player = this.currentPlayer;
        const opponent = player === 1 ? 2 : 1;

        // 第一优先级：自己能赢就直接赢
        const myWin = this.findWinningMove(player);
        if (myWin) {
            return myWin;
        }

        // 第二优先级：对手能赢就必须堵
        const opponentWin = this.findWinningMove(opponent);
        if (opponentWin) {
            return opponentWin;
        }

        const candidates = this.getCandidateMoves(2, 30);
        if (candidates.length === 0) {
            return null;
        }

        let bestMove = null;
        let bestScore = -Infinity;

        // 评估所有候选点
        for (const { x, y } of candidates) {
            const myScore = this.evaluatePosition(x, y, player);
            const oppScore = this.evaluatePosition(x, y, opponent);
            
            // 计算威胁等级
            const threatLevel = this.calculateThreatLevel(oppScore);
            
            // 根据威胁等级动态调整权重
            let attackWeight = 1.0;
            let defenseWeight = 1.0;
            
            if (threatLevel >= 3) {
                // 高威胁：活三或以上，防守权重提升到3倍
                defenseWeight = 3.0;
                attackWeight = 0.8;
            } else if (threatLevel >= 2) {
                // 中等威胁：冲四或活二，防守权重提升到2倍
                defenseWeight = 2.0;
                attackWeight = 0.9;
            } else if (threatLevel >= 1) {
                // 低威胁：普通进攻机会，略微增加防守权重
                defenseWeight = 1.3;
            }
            
            const totalScore = myScore * attackWeight + oppScore * defenseWeight;

            if (totalScore > bestScore) {
                bestScore = totalScore;
                bestMove = { x, y };
            }
        }

        return bestMove;
    }

    /**
     * 计算威胁等级（用于防守决策）
     * @param {number} score - 位置评分
     * @returns {number} 威胁等级 (0-5)
     */
    calculateThreatLevel(score) {
        if (score >= 10000) {
            // 活四：致命威胁
            return 5;
        } else if (score >= 1000) {
            // 冲四：严重威胁
            return 4;
        } else if (score >= 500) {
            // 活三：高威胁
            return 3;
        } else if (score >= 100) {
            // 冲三：中等威胁
            return 2;
        } else if (score >= 50) {
            // 活二：低威胁
            return 1;
        }
        return 0;
    }
}

const GAME_CORE_MODULE_INFO = {
    name: 'GomokuGame',
    version: '3.0.0',
    dependencies: ['GameUtils'],
    description: '五子棋核心引擎'
};

GomokuGame.__moduleInfo = GAME_CORE_MODULE_INFO;

if (typeof window !== 'undefined') {
    window.GomokuGame = GomokuGame;
}
