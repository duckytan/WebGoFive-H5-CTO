/**
 * UI Controller - 新UI交互控制器
 * 处理Tab切换、模式选择器、难度选择等新UI元素的交互
 */

class UIController {
    constructor() {
        this.currentTab = 'game';
        this.currentDifficulty = 'NORMAL';
        this.currentVCFLevel = 1;
        
        this.initTabSystem();
        this.initModeSelector();
        this.initDifficultySelector();
        this.initVCFLevelSelector();
        this.applyInitialState();
    }

    initTabSystem() {
        const tabButtons = document.querySelectorAll('.tab-button');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                this.switchTab(targetTab);
            });
        });
    }

    switchTab(tabName) {
        this.currentTab = tabName;

        document.querySelectorAll('.tab-button').forEach(btn => {
            if (btn.getAttribute('data-tab') === tabName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        document.querySelectorAll('.tab-content').forEach(content => {
            if (content.id === `tab-${tabName}`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
    }

    initModeSelector() {
        const modeCards = document.querySelectorAll('.mode-card');
        modeCards.forEach(card => {
            card.addEventListener('click', () => {
                modeCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
            });
        });
    }

    initDifficultySelector() {
        const difficultyOptions = document.querySelectorAll('.difficulty-option');
        const hiddenSelect = document.getElementById('difficulty-select');
        
        difficultyOptions.forEach(option => {
            option.addEventListener('click', () => {
                const difficulty = option.getAttribute('data-difficulty');
                this.setDifficulty(difficulty);
                
                if (hiddenSelect) {
                    hiddenSelect.value = difficulty;
                    hiddenSelect.dispatchEvent(new Event('change'));
                }
            });
        });
    }

    initVCFLevelSelector() {
        const levelOptions = document.querySelectorAll('.vcf-level-option');
        const hiddenSelect = document.getElementById('vcf-level-select');
        
        levelOptions.forEach(option => {
            option.addEventListener('click', () => {
                const level = option.getAttribute('data-level');
                this.setVCFLevel(level);
                
                if (hiddenSelect) {
                    hiddenSelect.value = level;
                    hiddenSelect.dispatchEvent(new Event('change'));
                }
            });
        });
    }

    applyInitialState() {
        // 初始化难度/VCF等级为隐藏select的值
        const hiddenDifficulty = document.getElementById('difficulty-select');
        if (hiddenDifficulty && hiddenDifficulty.value) {
            this.currentDifficulty = hiddenDifficulty.value;
        }
        this.setDifficulty(this.currentDifficulty);

        const hiddenVCFLevel = document.getElementById('vcf-level-select');
        if (hiddenVCFLevel && hiddenVCFLevel.value) {
            const levelValue = parseInt(hiddenVCFLevel.value, 10);
            if (!Number.isNaN(levelValue)) {
                this.currentVCFLevel = levelValue;
            }
        }
        this.setVCFLevel(this.currentVCFLevel);

        this.switchTab(this.currentTab);
        this.showDifficultySection(false);
        this.setAutoSaveState(false);
    }

    showDifficultySection(show) {
        const section = document.querySelector('.difficulty-section');
        if (section) {
            section.style.display = show ? 'block' : 'none';
        }
    }

    setDifficulty(difficulty) {
        this.currentDifficulty = difficulty;
        const difficultyOptions = document.querySelectorAll('.difficulty-option');
        difficultyOptions.forEach(opt => {
            if (opt.getAttribute('data-difficulty') === difficulty) {
                opt.classList.add('active');
            } else {
                opt.classList.remove('active');
            }
        });
    }

    setVCFLevel(level) {
        this.currentVCFLevel = parseInt(level, 10);
        const levelOptions = document.querySelectorAll('.vcf-level-option');
        levelOptions.forEach(opt => {
            if (parseInt(opt.getAttribute('data-level'), 10) === this.currentVCFLevel) {
                opt.classList.add('active');
            } else {
                opt.classList.remove('active');
            }
        });
    }

    updatePlayerStatus(player, status) {
        const statusEl = document.getElementById(player === 1 ? 'black-status' : 'white-status');
        if (statusEl) {
            statusEl.textContent = status || '—';
        }
    }

    updateCurrentPlayer(player) {
        const blackInfo = document.querySelector('.player-black');
        const whiteInfo = document.querySelector('.player-white');
        
        if (!blackInfo || !whiteInfo) {
            return;
        }

        if (player === 1) {
            blackInfo.classList.add('active');
            whiteInfo.classList.remove('active');
        } else if (player === 2) {
            blackInfo.classList.remove('active');
            whiteInfo.classList.add('active');
        } else {
            blackInfo.classList.remove('active');
            whiteInfo.classList.remove('active');
        }
    }

    updateModeText(modeText) {
        const modeEl = document.getElementById('current-mode');
        if (modeEl) {
            modeEl.textContent = modeText;
        }
    }

    updateMoveCount(count) {
        const moveEl = document.getElementById('move-count');
        if (moveEl) {
            moveEl.textContent = `回合 ${count}`;
        }
    }

    setAutoSaveState(enabled) {
        const toggleBtn = document.getElementById('auto-save-button');
        if (toggleBtn) {
            if (enabled) {
                toggleBtn.classList.add('active');
            } else {
                toggleBtn.classList.remove('active');
            }
        }
    }
}

if (typeof window !== 'undefined') {
    window.UIController = UIController;
}
