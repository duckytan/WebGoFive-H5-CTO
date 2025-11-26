/**
 * SimpleBoardRenderer - Canvas棋盘渲染器
 * 负责棋盘绘制、鼠标交互、Canvas渲染优化
 * @version 1.0.0
 */

class SimpleBoardRenderer {
    constructor(canvasElement, gameInstance, options = {}) {
        if (!canvasElement) {
            throw new Error('[SimpleBoardRenderer] Canvas元素未找到');
        }
        if (!gameInstance) {
            throw new Error('[SimpleBoardRenderer] Game实例未传入');
        }

        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.game = gameInstance;
        this.onMove = typeof options.onMove === 'function' ? options.onMove : null;
        this.soundManager = options.soundManager || null;

        this.BOARD_SIZE = this.game.BOARD_SIZE;
        this.PADDING = options.padding ?? 40;
        this.CELL_SIZE = options.cellSize ?? 40;
        this.canvasSize = this.PADDING * 2 + (this.BOARD_SIZE - 1) * this.CELL_SIZE;
        this.showCoordinates = options.showCoordinates ?? false;
        this.autoForbiddenHint = options.autoForbiddenHint ?? true;

        this.hoverX = -1;
        this.hoverY = -1;
        this.isInteractive = true;
        this.winHighlight = null;
        this.forbiddenHighlight = null;
        this.forbiddenTimeoutId = null;
        this.hintHighlight = null;
        this.hintTimeoutId = null;

        this.initCanvas();
        this.setupEventListeners();
        this.render();
    }

    initCanvas() {
        this.canvas.width = this.canvasSize;
        this.canvas.height = this.canvasSize;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
    }

    setupEventListeners() {
        const handlePlacement = (event) => {
            if (!this.isInteractive) {
                GameUtils.showMessage('当前不可落子，请重新开始游戏。', 'warning');
                return;
            }

            const { x, y } = this.getBoardPositionFromEvent(event);
            if (x === -1 || y === -1) {
                return;
            }
            this.placePiece(x, y);
        };

        const updateHoverPosition = (event) => {
            if (!this.isInteractive) {
                return;
            }
            const { x, y } = this.getBoardPositionFromEvent(event);
            if (x !== this.hoverX || y !== this.hoverY) {
                this.hoverX = x;
                this.hoverY = y;
                this.render();
            }
        };

        this.canvas.addEventListener('click', handlePlacement);

        this.canvas.addEventListener('touchstart', (event) => {
            event.preventDefault();
            handlePlacement(event);
        }, { passive: false });

        this.canvas.addEventListener('mousemove', updateHoverPosition);

        this.canvas.addEventListener('touchmove', (event) => {
            event.preventDefault();
            updateHoverPosition(event);
        }, { passive: false });

        const clearHover = () => {
            if (this.hoverX !== -1 || this.hoverY !== -1) {
                this.hoverX = -1;
                this.hoverY = -1;
                this.render();
            }
        };

        this.canvas.addEventListener('mouseleave', clearHover);
        this.canvas.addEventListener('touchend', () => clearHover());
        this.canvas.addEventListener('touchcancel', () => clearHover());
    }

    getBoardPositionFromEvent(event) {
        const rect = this.canvas.getBoundingClientRect();
        let canvasX, canvasY;
        
        if (event.touches && event.touches.length > 0) {
            canvasX = event.touches[0].clientX - rect.left;
            canvasY = event.touches[0].clientY - rect.top;
        } else {
            canvasX = event.clientX - rect.left;
            canvasY = event.clientY - rect.top;
        }
        
        return this.getBoardPosition(canvasX, canvasY);
    }

    getBoardPosition(canvasX, canvasY) {
        const x = Math.round((canvasX - this.PADDING) / this.CELL_SIZE);
        const y = Math.round((canvasY - this.PADDING) / this.CELL_SIZE);

        if (GameUtils.isValidPosition(x, y, this.BOARD_SIZE)) {
            const pointX = this.PADDING + x * this.CELL_SIZE;
            const pointY = this.PADDING + y * this.CELL_SIZE;
            const distance = Math.sqrt((canvasX - pointX) ** 2 + (canvasY - pointY) ** 2);
            if (distance <= this.CELL_SIZE * 0.45) {
                return { x, y };
            }
        }

        return { x: -1, y: -1 };
    }

    getCanvasPosition(x, y) {
        return {
            canvasX: this.PADDING + x * this.CELL_SIZE,
            canvasY: this.PADDING + y * this.CELL_SIZE
        };
    }

    render() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBoard();
        this.drawPieces();
        this.drawHoverPreview();
        this.drawWinHighlight();
        this.drawForbiddenHighlight();
        this.drawHintHighlight();
    }

    drawBoard() {
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 1;

        for (let i = 0; i < this.BOARD_SIZE; i++) {
            const pos = this.PADDING + i * this.CELL_SIZE;

            this.ctx.beginPath();
            this.ctx.moveTo(this.PADDING, pos);
            this.ctx.lineTo(this.PADDING + (this.BOARD_SIZE - 1) * this.CELL_SIZE, pos);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(pos, this.PADDING);
            this.ctx.lineTo(pos, this.PADDING + (this.BOARD_SIZE - 1) * this.CELL_SIZE);
            this.ctx.stroke();
        }

        if (this.showCoordinates) {
            this.drawCoordinates();
        }

        const stars = [
            [3, 3], [3, 11], [11, 3], [11, 11], [7, 7]
        ];

        stars.forEach(([x, y]) => {
            const { canvasX, canvasY } = this.getCanvasPosition(x, y);
            this.ctx.beginPath();
            this.ctx.arc(canvasX, canvasY, 4, 0, Math.PI * 2);
            this.ctx.fillStyle = '#000';
            this.ctx.fill();
        });
    }

    drawCoordinates() {
        this.ctx.font = '12px Arial';
        this.ctx.fillStyle = '#666';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        for (let i = 0; i < this.BOARD_SIZE; i++) {
            const pos = this.PADDING + i * this.CELL_SIZE;
            const label = String.fromCharCode(65 + i);
            this.ctx.fillText(label, pos, this.PADDING - 20);
            this.ctx.fillText(label, pos, this.PADDING + (this.BOARD_SIZE - 1) * this.CELL_SIZE + 20);
            this.ctx.fillText((i + 1).toString(), this.PADDING - 20, pos);
            this.ctx.fillText((i + 1).toString(), this.PADDING + (this.BOARD_SIZE - 1) * this.CELL_SIZE + 20, pos);
        }
    }

    drawPieces() {
        const board = this.game.getBoardState(false);

        for (let y = 0; y < this.BOARD_SIZE; y++) {
            for (let x = 0; x < this.BOARD_SIZE; x++) {
                const player = board[y][x];
                if (player !== 0) {
                    this.drawPiece(x, y, player);
                }
            }
        }
    }

    drawPiece(x, y, player) {
        const { canvasX, canvasY } = this.getCanvasPosition(x, y);
        const radius = this.CELL_SIZE * 0.4;

        this.ctx.beginPath();
        this.ctx.arc(canvasX, canvasY, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = player === 1 ? '#000' : '#fff';
        this.ctx.fill();
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();

        const gradient = this.ctx.createRadialGradient(
            canvasX - radius * 0.3,
            canvasY - radius * 0.3,
            0,
            canvasX,
            canvasY,
            radius
        );

        if (player === 1) {
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else {
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        }

        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }

    drawHoverPreview() {
        if (!this.isInteractive) {
            return;
        }
        if (this.hoverX === -1 || this.hoverY === -1) {
            return;
        }
        const board = this.game.getBoardState(false);
        if (board[this.hoverY][this.hoverX] !== 0) {
            return;
        }

        const { canvasX, canvasY } = this.getCanvasPosition(this.hoverX, this.hoverY);
        const radius = this.CELL_SIZE * 0.4;

        this.ctx.beginPath();
        this.ctx.arc(canvasX, canvasY, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = this.game.currentPlayer === 1
            ? 'rgba(0, 0, 0, 0.25)'
            : 'rgba(255, 255, 255, 0.5)';
        this.ctx.fill();
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        this.ctx.stroke();
    }

    drawWinHighlight() {
        if (!this.winHighlight) {
            return;
        }
        const { start, end } = this.winHighlight;
        this.ctx.strokeStyle = '#fbbf24';
        this.ctx.lineWidth = 5;
        this.ctx.beginPath();
        this.ctx.moveTo(start.canvasX, start.canvasY);
        this.ctx.lineTo(end.canvasX, end.canvasY);
        this.ctx.stroke();
        this.ctx.lineWidth = 1;
    }

    drawForbiddenHighlight() {
        if (!this.forbiddenHighlight) {
            return;
        }
        const { x, y } = this.forbiddenHighlight;
        const { canvasX, canvasY } = this.getCanvasPosition(x, y);
        const radius = this.CELL_SIZE * 0.45;

        this.ctx.save();
        this.ctx.strokeStyle = '#ef4444';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(canvasX, canvasY, radius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(canvasX - radius * 0.6, canvasY - radius * 0.6);
        this.ctx.lineTo(canvasX + radius * 0.6, canvasY + radius * 0.6);
        this.ctx.moveTo(canvasX + radius * 0.6, canvasY - radius * 0.6);
        this.ctx.lineTo(canvasX - radius * 0.6, canvasY + radius * 0.6);
        this.ctx.stroke();
        this.ctx.restore();
    }

    highlightForbiddenPosition(x, y, result) {
        if (!this.autoForbiddenHint) {
            return;
        }
        if (this.forbiddenTimeoutId) {
            clearTimeout(this.forbiddenTimeoutId);
            this.forbiddenTimeoutId = null;
        }
        this.forbiddenHighlight = {
            x,
            y,
            type: result?.data?.forbiddenType || 'FORBIDDEN'
        };
        this.render();
        this.forbiddenTimeoutId = setTimeout(() => {
            this.forbiddenHighlight = null;
            this.forbiddenTimeoutId = null;
            this.render();
        }, 1500);
    }

    clearForbiddenHighlight() {
        if (this.forbiddenTimeoutId) {
            clearTimeout(this.forbiddenTimeoutId);
            this.forbiddenTimeoutId = null;
        }
        this.forbiddenHighlight = null;
    }

    /**
     * 高亮提示位置
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     * @param {number} duration - 显示时长（毫秒），默认3000
     */
    highlightHintPosition(x, y, duration = 3000) {
        if (this.hintTimeoutId) {
            clearTimeout(this.hintTimeoutId);
            this.hintTimeoutId = null;
        }
        this.hintHighlight = { x, y };
        this.render();
        this.hintTimeoutId = setTimeout(() => {
            this.hintHighlight = null;
            this.hintTimeoutId = null;
            this.render();
        }, duration);
    }

    /**
     * 清除提示高亮
     */
    clearHintHighlight() {
        if (this.hintTimeoutId) {
            clearTimeout(this.hintTimeoutId);
            this.hintTimeoutId = null;
        }
        this.hintHighlight = null;
    }

    /**
     * 绘制提示高亮
     */
    drawHintHighlight() {
        if (!this.hintHighlight) {
            return;
        }
        const { x, y } = this.hintHighlight;
        const { canvasX, canvasY } = this.getCanvasPosition(x, y);
        const radius = this.CELL_SIZE * 0.45;

        this.ctx.save();
        this.ctx.strokeStyle = '#10b981';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(canvasX, canvasY, radius, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // 绘制十字标记
        this.ctx.beginPath();
        this.ctx.moveTo(canvasX - radius * 0.4, canvasY);
        this.ctx.lineTo(canvasX + radius * 0.4, canvasY);
        this.ctx.moveTo(canvasX, canvasY - radius * 0.4);
        this.ctx.lineTo(canvasX, canvasY + radius * 0.4);
        this.ctx.stroke();
        this.ctx.restore();
    }

    placePiece(x, y) {
        const result = this.game.placePiece(x, y);
        if (!result.success) {
            if (result.code === 'FORBIDDEN_MOVE') {
                this.highlightForbiddenPosition(x, y, result);
                // 播放禁手警告音效
                if (this.soundManager) {
                    this.soundManager.playForbiddenSound();
                }
            } else {
                // 播放错误音效
                if (this.soundManager) {
                    this.soundManager.playErrorSound();
                }
            }
            GameUtils.showMessage(result.error, 'error');
            return result;
        }

        this.clearForbiddenHighlight();
        this.clearHintHighlight();
        this.hoverX = -1;
        this.hoverY = -1;
        this.updateWinHighlight(result.data.winLine);
        this.render();

        if (this.onMove) {
            this.onMove(result);
        }

        return result;
    }

    updateWinHighlight(winLine) {
        if (!winLine) {
            this.winHighlight = null;
            return;
        }

        const { x, y, dx, dy, length } = winLine;
        const startX = x - this.game.getLine(x, y, -dx, -dy, this.game.board[y][x]) * dx;
        const startY = y - this.game.getLine(x, y, -dx, -dy, this.game.board[y][x]) * dy;
        const endX = startX + (length - 1) * dx;
        const endY = startY + (length - 1) * dy;

        const start = this.getCanvasPosition(startX, startY);
        const end = this.getCanvasPosition(endX, endY);
        this.winHighlight = { start, end };
    }

    setShowCoordinates(enabled) {
        const shouldShow = !!enabled;
        if (this.showCoordinates === shouldShow) {
            return;
        }
        this.showCoordinates = shouldShow;
        this.render();
    }

    setAutoForbiddenHint(enabled) {
        const shouldEnable = !!enabled;
        if (this.autoForbiddenHint === shouldEnable) {
            return;
        }
        this.autoForbiddenHint = shouldEnable;
        if (!shouldEnable) {
            this.clearForbiddenHighlight();
            this.render();
        }
    }

    updateLayout({ padding, cellSize } = {}) {
        const nextPadding = typeof padding === 'number' ? padding : this.PADDING;
        const nextCellSize = typeof cellSize === 'number' ? cellSize : this.CELL_SIZE;
        if (nextPadding === this.PADDING && nextCellSize === this.CELL_SIZE) {
            return;
        }
        this.PADDING = nextPadding;
        this.CELL_SIZE = nextCellSize;
        this.canvasSize = this.PADDING * 2 + (this.BOARD_SIZE - 1) * this.CELL_SIZE;
        this.canvas.width = Math.round(this.canvasSize);
        this.canvas.height = Math.round(this.canvasSize);
        this.render();
    }

    setInteractive(enabled) {
        this.isInteractive = enabled;
    }
}

const RENDERER_MODULE_INFO = {
    name: 'SimpleBoardRenderer',
    version: '2.1.0',
    dependencies: ['GomokuGame'],
    description: 'Canvas渲染器'
};

SimpleBoardRenderer.__moduleInfo = RENDERER_MODULE_INFO;

if (typeof window !== 'undefined') {
    window.SimpleBoardRenderer = SimpleBoardRenderer;
}
