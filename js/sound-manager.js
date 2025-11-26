/**
 * SoundManager - 音效管理器
 * 使用Web Audio API生成音效，无需外部音频文件
 * @version 8.0.0
 */

class SoundManager {
    constructor() {
        this.enabled = false;
        this.audioContext = null;
        this.masterGain = null;
        this.volume = 0.3; // 主音量 (0-1)
        
        // 初始化音频上下文（延迟到第一次播放时）
        this.initialized = false;
    }
    
    /**
     * 初始化音频上下文
     * 必须在用户交互后调用（浏览器限制）
     */
    init() {
        if (this.initialized) return;
        
        try {
            // 创建音频上下文
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
            
            // 创建主增益节点
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = this.volume;
            this.masterGain.connect(this.audioContext.destination);
            
            this.initialized = true;
        } catch (error) {
            console.warn('音频上下文初始化失败:', error);
            this.initialized = false;
        }
    }
    
    /**
     * 启用音效
     */
    enable() {
        this.enabled = true;
        if (!this.initialized) {
            this.init();
        }
    }
    
    /**
     * 禁用音效
     */
    disable() {
        this.enabled = false;
    }
    
    /**
     * 设置音量
     * @param {number} volume - 音量 (0-1)
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.masterGain) {
            this.masterGain.gain.value = this.volume;
        }
    }
    
    /**
     * 播放落子音效
     * 使用简单的正弦波生成清脆的落子声
     */
    playPieceSound() {
        if (!this.enabled || !this.initialized) return;
        
        try {
            const ctx = this.audioContext;
            const now = ctx.currentTime;
            
            // 创建振荡器（短促的高频声音）
            const oscillator = ctx.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(800, now); // 800Hz
            oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.05);
            
            // 创建增益节点控制音量包络
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            
            // 连接节点
            oscillator.connect(gain);
            gain.connect(this.masterGain);
            
            // 播放
            oscillator.start(now);
            oscillator.stop(now + 0.1);
        } catch (error) {
            console.warn('播放落子音效失败:', error);
        }
    }
    
    /**
     * 播放胜利音效
     * 播放上升的和弦音效
     */
    playWinSound() {
        if (!this.enabled || !this.initialized) return;
        
        try {
            const ctx = this.audioContext;
            const now = ctx.currentTime;
            
            // 播放三个音符的和弦
            const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
            const delays = [0, 0.1, 0.2];
            
            frequencies.forEach((freq, index) => {
                const startTime = now + delays[index];
                
                const oscillator = ctx.createOscillator();
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(freq, startTime);
                
                const gain = ctx.createGain();
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);
                
                oscillator.connect(gain);
                gain.connect(this.masterGain);
                
                oscillator.start(startTime);
                oscillator.stop(startTime + 0.5);
            });
        } catch (error) {
            console.warn('播放胜利音效失败:', error);
        }
    }
    
    /**
     * 播放禁手警告音效
     * 播放低沉的警告声
     */
    playForbiddenSound() {
        if (!this.enabled || !this.initialized) return;
        
        try {
            const ctx = this.audioContext;
            const now = ctx.currentTime;
            
            // 两次短促的低音
            for (let i = 0; i < 2; i++) {
                const startTime = now + i * 0.15;
                
                const oscillator = ctx.createOscillator();
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(150, startTime);
                
                const gain = ctx.createGain();
                gain.gain.setValueAtTime(0.15, startTime);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);
                
                oscillator.connect(gain);
                gain.connect(this.masterGain);
                
                oscillator.start(startTime);
                oscillator.stop(startTime + 0.1);
            }
        } catch (error) {
            console.warn('播放禁手音效失败:', error);
        }
    }
    
    /**
     * 播放错误音效
     * 播放简短的错误提示音
     */
    playErrorSound() {
        if (!this.enabled || !this.initialized) return;
        
        try {
            const ctx = this.audioContext;
            const now = ctx.currentTime;
            
            const oscillator = ctx.createOscillator();
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(200, now);
            oscillator.frequency.linearRampToValueAtTime(100, now + 0.15);
            
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            
            oscillator.connect(gain);
            gain.connect(this.masterGain);
            
            oscillator.start(now);
            oscillator.stop(now + 0.15);
        } catch (error) {
            console.warn('播放错误音效失败:', error);
        }
    }
    
    /**
     * 播放按钮点击音效
     * 播放简短的点击声
     */
    playClickSound() {
        if (!this.enabled || !this.initialized) return;
        
        try {
            const ctx = this.audioContext;
            const now = ctx.currentTime;
            
            const oscillator = ctx.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(1000, now);
            
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
            
            oscillator.connect(gain);
            gain.connect(this.masterGain);
            
            oscillator.start(now);
            oscillator.stop(now + 0.05);
        } catch (error) {
            console.warn('播放点击音效失败:', error);
        }
    }
    
    /**
     * 播放提示音效
     * 播放柔和的提示音
     */
    playHintSound() {
        if (!this.enabled || !this.initialized) return;
        
        try {
            const ctx = this.audioContext;
            const now = ctx.currentTime;
            
            // 上升音阶
            const oscillator = ctx.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(400, now);
            oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.2);
            
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            
            oscillator.connect(gain);
            gain.connect(this.masterGain);
            
            oscillator.start(now);
            oscillator.stop(now + 0.2);
        } catch (error) {
            console.warn('播放提示音效失败:', error);
        }
    }
    
    /**
     * 播放回放音效
     * 播放柔和的切换音
     */
    playReplaySound() {
        if (!this.enabled || !this.initialized) return;
        
        try {
            const ctx = this.audioContext;
            const now = ctx.currentTime;
            
            const oscillator = ctx.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(600, now);
            
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            
            oscillator.connect(gain);
            gain.connect(this.masterGain);
            
            oscillator.start(now);
            oscillator.stop(now + 0.15);
        } catch (error) {
            console.warn('播放回放音效失败:', error);
        }
    }
}

// 模块信息
const SOUND_MANAGER_MODULE_INFO = {
    name: 'SoundManager',
    version: '8.0.0',
    dependencies: [],
    description: '音效管理器 - 使用Web Audio API生成音效'
};

SoundManager.__moduleInfo = SOUND_MANAGER_MODULE_INFO;

// 导出到全局
if (typeof window !== 'undefined') {
    window.SoundManager = SoundManager;
}
