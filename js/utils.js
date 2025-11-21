/**
 * GameUtils - 工具模块
 * 提供通用工具函数，如消息提示、时间格式化、数据操作等
 * @version 1.0.0
 */

class GameUtils {
    /**
     * 显示消息提示
     * @param {string} message - 消息内容
     * @param {string} type - 消息类型: 'success', 'error', 'warning', 'info'
     * @param {number} duration - 显示时长(ms)，默认3000ms
     */
    static showMessage(message, type = 'info', duration = 3000) {
        const msgEl = document.createElement('div');
        msgEl.className = `game-message message-${type}`;
        msgEl.textContent = message;
        
        msgEl.style.animation = 'slideIn 0.3s ease';
        
        document.body.appendChild(msgEl);
        
        setTimeout(() => {
            msgEl.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => msgEl.remove(), 300);
        }, duration);
    }

    /**
     * 格式化时间戳为可读字符串
     * @param {number} timestamp - 时间戳
     * @returns {string} 格式化后的时间字符串
     */
    static formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    /**
     * 格式化时长为可读字符串
     * @param {number} seconds - 秒数
     * @returns {string} 格式化后的时长字符串
     */
    static formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        const parts = [];
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0) parts.push(`${minutes}m`);
        if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

        return parts.join(' ');
    }

    /**
     * 生成文件名
     * @param {string} prefix - 前缀
     * @param {string} extension - 扩展名
     * @returns {string} 生成的文件名
     */
    static generateFileName(prefix = 'gomoku', extension = 'json') {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        return `${prefix}_${timestamp}.${extension}`;
    }

    /**
     * 深拷贝对象
     * @param {*} obj - 要拷贝的对象
     * @returns {*} 拷贝后的对象
     */
    static deepClone(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * 验证坐标是否合法
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     * @param {number} size - 棋盘大小
     * @returns {boolean} 是否合法
     */
    static isValidPosition(x, y, size = 15) {
        return Number.isInteger(x) && Number.isInteger(y) &&
               x >= 0 && x < size && y >= 0 && y < size;
    }

    /**
     * 保存数据到LocalStorage
     * @param {string} key - 键名
     * @param {*} data - 数据
     * @returns {Object} 操作结果
     */
    static saveToLocalStorage(key, data) {
        try {
            const jsonString = JSON.stringify(data);
            localStorage.setItem(key, jsonString);
            return { success: true, data: { key, size: jsonString.length } };
        } catch (error) {
            console.error('[GameUtils] saveToLocalStorage失败:', error);
            return { success: false, error: error.message, code: 'SAVE_FAILED' };
        }
    }

    /**
     * 从LocalStorage读取数据
     * @param {string} key - 键名
     * @returns {Object} 操作结果
     */
    static loadFromLocalStorage(key) {
        try {
            const jsonString = localStorage.getItem(key);
            if (jsonString === null) {
                return { success: false, error: '数据不存在', code: 'NOT_FOUND' };
            }
            const data = JSON.parse(jsonString);
            return { success: true, data };
        } catch (error) {
            console.error('[GameUtils] loadFromLocalStorage失败:', error);
            return { success: false, error: error.message, code: 'LOAD_FAILED' };
        }
    }

    /**
     * 下载数据为JSON文件
     * @param {*} data - 要下载的数据
     * @param {string} filename - 文件名
     * @returns {Object} 操作结果
     */
    static downloadAsJSON(data, filename) {
        try {
            const jsonString = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = filename || GameUtils.generateFileName();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(url);

            return { success: true, data: { filename, size: jsonString.length } };
        } catch (error) {
            console.error('[GameUtils] downloadAsJSON失败:', error);
            return { success: false, error: error.message, code: 'DOWNLOAD_FAILED' };
        }
    }
}

// 模块信息
const UTILS_MODULE_INFO = {
    name: 'GameUtils',
    version: '1.0.0',
    dependencies: [],
    description: '工具函数模块'
};

GameUtils.__moduleInfo = UTILS_MODULE_INFO;

// 导出到全局
if (typeof window !== 'undefined') {
    window.GameUtils = GameUtils;
}
