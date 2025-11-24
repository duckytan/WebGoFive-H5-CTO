/**
 * VCFPracticeManager - VCF练习管理器
 * 提供VCF（Victory by Continuous Four）练习题库和验证系统
 * @version 5.0.0
 */

class VCFPracticeManager {
    constructor() {
        this.puzzles = [];
        this.currentPuzzle = null;
        this.currentStep = 0;
        this.currentLevel = 1;
        this.progress = this.loadProgress();
        this.initializePuzzles();
    }

    /**
     * 初始化题库（40道题，分4个难度）
     */
    initializePuzzles() {
        this.puzzles = [];
        this.puzzles.push(...this.generateLevel1Puzzles()); // 10道入门题
        this.puzzles.push(...this.generateLevel2Puzzles()); // 10道初级题
        this.puzzles.push(...this.generateLevel3Puzzles()); // 10道中级题
        this.puzzles.push(...this.generateLevel4Puzzles()); // 10道高级题
    }

    /**
     * 生成入门级题目（level 1）
     * 特点：2-3步必胜，无防守干扰
     */
    generateLevel1Puzzles() {
        return [
            {
                id: 'L1-01',
                level: 1,
                name: '简单冲四',
                description: '黑棋已有三子，找到冲四制胜的位置',
                initialState: [
                    { x: 7, y: 7, player: 1 },
                    { x: 8, y: 7, player: 1 },
                    { x: 9, y: 7, player: 1 }
                ],
                solution: [
                    { x: 6, y: 7, player: 1, description: '冲四' },
                    { x: 5, y: 7, player: 2, description: 'AI防守' },
                    { x: 10, y: 7, player: 1, description: '成五获胜' }
                ],
                hints: ['寻找能形成冲四的位置', '注意棋子的连续性']
            },
            {
                id: 'L1-02',
                level: 1,
                name: '竖直冲四',
                description: '在竖直方向上形成冲四',
                initialState: [
                    { x: 7, y: 6, player: 1 },
                    { x: 7, y: 7, player: 1 },
                    { x: 7, y: 8, player: 1 }
                ],
                solution: [
                    { x: 7, y: 5, player: 1, description: '竖直冲四' },
                    { x: 7, y: 4, player: 2, description: 'AI防守' },
                    { x: 7, y: 9, player: 1, description: '成五获胜' }
                ],
                hints: ['考虑竖直方向', '两端都能冲四']
            },
            {
                id: 'L1-03',
                level: 1,
                name: '斜向冲四',
                description: '在斜向上形成冲四',
                initialState: [
                    { x: 6, y: 6, player: 1 },
                    { x: 7, y: 7, player: 1 },
                    { x: 8, y: 8, player: 1 }
                ],
                solution: [
                    { x: 5, y: 5, player: 1, description: '左上冲四' },
                    { x: 4, y: 4, player: 2, description: 'AI防守' },
                    { x: 9, y: 9, player: 1, description: '成五获胜' }
                ],
                hints: ['斜线方向有两个延伸点']
            },
            {
                id: 'L1-04',
                level: 1,
                name: '反斜冲四',
                description: '在反斜向上形成冲四',
                initialState: [
                    { x: 8, y: 6, player: 1 },
                    { x: 7, y: 7, player: 1 },
                    { x: 6, y: 8, player: 1 }
                ],
                solution: [
                    { x: 9, y: 5, player: 1, description: '右上冲四' },
                    { x: 10, y: 4, player: 2, description: 'AI防守' },
                    { x: 5, y: 9, player: 1, description: '成五获胜' }
                ],
                hints: ['反斜线方向']
            },
            {
                id: 'L1-05',
                level: 1,
                name: '跳冲四',
                description: '形成跳冲四（中间有空位）',
                initialState: [
                    { x: 6, y: 7, player: 1 },
                    { x: 7, y: 7, player: 1 },
                    { x: 9, y: 7, player: 1 }
                ],
                solution: [
                    { x: 8, y: 7, player: 1, description: '补跳位形成冲四' },
                    { x: 5, y: 7, player: 2, description: 'AI防守' },
                    { x: 10, y: 7, player: 1, description: '成五获胜' }
                ],
                hints: ['注意中间的空位']
            },
            {
                id: 'L1-06',
                level: 1,
                name: '双向选择',
                description: '两个方向都能冲四，选择正确的方向',
                initialState: [
                    { x: 7, y: 7, player: 1 },
                    { x: 8, y: 7, player: 1 },
                    { x: 9, y: 7, player: 1 },
                    { x: 7, y: 8, player: 1 }
                ],
                solution: [
                    { x: 10, y: 7, player: 1, description: '横向冲四（正确）' },
                    { x: 6, y: 7, player: 2, description: 'AI防守另一侧' },
                    { x: 11, y: 7, player: 1, description: '成五获胜' }
                ],
                hints: ['选择能够连续进攻的方向']
            },
            {
                id: 'L1-07',
                level: 1,
                name: '简单VCF-1',
                description: '两步VCF获胜',
                initialState: [
                    { x: 6, y: 7, player: 1 },
                    { x: 7, y: 7, player: 1 },
                    { x: 8, y: 7, player: 1 },
                    { x: 7, y: 6, player: 1 },
                    { x: 7, y: 8, player: 1 }
                ],
                solution: [
                    { x: 9, y: 7, player: 1, description: '冲四' },
                    { x: 5, y: 7, player: 2, description: 'AI被迫防守' },
                    { x: 7, y: 5, player: 1, description: '另一方向冲四获胜' }
                ],
                hints: ['利用十字形状形成两个冲四点']
            },
            {
                id: 'L1-08',
                level: 1,
                name: '简单VCF-2',
                description: '利用斜线形成VCF',
                initialState: [
                    { x: 6, y: 6, player: 1 },
                    { x: 7, y: 7, player: 1 },
                    { x: 8, y: 8, player: 1 },
                    { x: 7, y: 6, player: 1 }
                ],
                solution: [
                    { x: 9, y: 9, player: 1, description: '斜向冲四' },
                    { x: 5, y: 5, player: 2, description: 'AI防守' },
                    { x: 7, y: 5, player: 1, description: '冲四获胜' }
                ],
                hints: ['利用斜线和竖线的组合']
            },
            {
                id: 'L1-09',
                level: 1,
                name: '边界冲四',
                description: '靠近边界的冲四',
                initialState: [
                    { x: 1, y: 7, player: 1 },
                    { x: 2, y: 7, player: 1 },
                    { x: 3, y: 7, player: 1 }
                ],
                solution: [
                    { x: 4, y: 7, player: 1, description: '冲四' },
                    { x: 0, y: 7, player: 2, description: 'AI防守边界' },
                    { x: 5, y: 7, player: 1, description: '成五获胜' }
                ],
                hints: ['边界只有一侧需要防守']
            },
            {
                id: 'L1-10',
                level: 1,
                name: '入门综合',
                description: '综合应用冲四技巧',
                initialState: [
                    { x: 7, y: 7, player: 1 },
                    { x: 8, y: 8, player: 1 },
                    { x: 9, y: 9, player: 1 },
                    { x: 8, y: 7, player: 1 }
                ],
                solution: [
                    { x: 10, y: 10, player: 1, description: '斜向冲四' },
                    { x: 6, y: 6, player: 2, description: 'AI防守' },
                    { x: 9, y: 7, player: 1, description: '横向冲四获胜' }
                ],
                hints: ['找到两个冲四点的交叉位置']
            }
        ];
    }

    /**
     * 生成初级题目（level 2）
     * 特点：3-4步必胜，简单防守干扰
     */
    generateLevel2Puzzles() {
        return [
            {
                id: 'L2-01',
                level: 2,
                name: '双冲四-基础',
                description: '构造双冲四局面',
                initialState: [
                    { x: 6, y: 7, player: 1 },
                    { x: 7, y: 7, player: 1 },
                    { x: 8, y: 7, player: 1 },
                    { x: 7, y: 6, player: 1 },
                    { x: 7, y: 8, player: 1 },
                    { x: 7, y: 9, player: 1 }
                ],
                solution: [
                    { x: 9, y: 7, player: 1, description: '横向冲四' },
                    { x: 5, y: 7, player: 2, description: 'AI防守横向' },
                    { x: 7, y: 5, player: 1, description: '竖向冲四获胜' }
                ],
                hints: ['构造两个方向的冲四威胁']
            },
            {
                id: 'L2-02',
                level: 2,
                name: '活三进阶',
                description: '从活三发展到VCF',
                initialState: [
                    { x: 7, y: 7, player: 1 },
                    { x: 8, y: 7, player: 1 },
                    { x: 10, y: 7, player: 1 }
                ],
                solution: [
                    { x: 9, y: 7, player: 1, description: '形成冲四' },
                    { x: 6, y: 7, player: 2, description: 'AI防守' },
                    { x: 11, y: 7, player: 1, description: '另一侧冲四' },
                    { x: 5, y: 7, player: 2, description: 'AI再次防守' },
                    { x: 12, y: 7, player: 1, description: '成五获胜' }
                ],
                hints: ['先形成冲四，再逐步推进']
            },
            {
                id: 'L2-03',
                level: 2,
                name: 'L型攻击',
                description: 'L型棋形的VCF',
                initialState: [
                    { x: 7, y: 7, player: 1 },
                    { x: 8, y: 7, player: 1 },
                    { x: 9, y: 7, player: 1 },
                    { x: 7, y: 8, player: 1 },
                    { x: 7, y: 9, player: 1 }
                ],
                solution: [
                    { x: 10, y: 7, player: 1, description: '横向冲四' },
                    { x: 6, y: 7, player: 2, description: 'AI防守' },
                    { x: 7, y: 10, player: 1, description: '竖向冲四获胜' }
                ],
                hints: ['L型有两个延伸方向']
            },
            {
                id: 'L2-04',
                level: 2,
                name: '斜线交叉',
                description: '两条斜线的交叉攻击',
                initialState: [
                    { x: 7, y: 7, player: 1 },
                    { x: 8, y: 8, player: 1 },
                    { x: 9, y: 9, player: 1 },
                    { x: 8, y: 6, player: 1 },
                    { x: 9, y: 5, player: 1 }
                ],
                solution: [
                    { x: 10, y: 10, player: 1, description: '主斜线冲四' },
                    { x: 6, y: 6, player: 2, description: 'AI防守' },
                    { x: 10, y: 4, player: 1, description: '反斜线冲四获胜' }
                ],
                hints: ['两条斜线共享一个端点']
            },
            {
                id: 'L2-05',
                level: 2,
                name: '跳三进攻',
                description: '利用跳三形成VCF',
                initialState: [
                    { x: 6, y: 7, player: 1 },
                    { x: 7, y: 7, player: 1 },
                    { x: 9, y: 7, player: 1 },
                    { x: 7, y: 6, player: 1 }
                ],
                solution: [
                    { x: 8, y: 7, player: 1, description: '补跳位形成冲四' },
                    { x: 5, y: 7, player: 2, description: 'AI防守' },
                    { x: 7, y: 5, player: 1, description: '竖向冲四' },
                    { x: 10, y: 7, player: 2, description: 'AI防守另一侧' },
                    { x: 7, y: 8, player: 1, description: '成五获胜' }
                ],
                hints: ['跳三是常见的VCF起手']
            },
            {
                id: 'L2-06',
                level: 2,
                name: '四方包围',
                description: '从中心向四周扩展',
                initialState: [
                    { x: 7, y: 7, player: 1 },
                    { x: 8, y: 7, player: 1 },
                    { x: 7, y: 8, player: 1 },
                    { x: 6, y: 7, player: 1 }
                ],
                solution: [
                    { x: 9, y: 7, player: 1, description: '横向冲四' },
                    { x: 5, y: 7, player: 2, description: 'AI防守' },
                    { x: 7, y: 9, player: 1, description: '竖向冲四' },
                    { x: 7, y: 6, player: 2, description: 'AI防守' },
                    { x: 10, y: 7, player: 1, description: '成五获胜' }
                ],
                hints: ['从多个方向施压']
            },
            {
                id: 'L2-07',
                level: 2,
                name: '边角利用',
                description: '利用边界简化防守',
                initialState: [
                    { x: 0, y: 7, player: 1 },
                    { x: 1, y: 7, player: 1 },
                    { x: 2, y: 7, player: 1 },
                    { x: 1, y: 6, player: 1 }
                ],
                solution: [
                    { x: 3, y: 7, player: 1, description: '冲四' },
                    { x: 4, y: 7, player: 2, description: 'AI只能向右防守' },
                    { x: 1, y: 5, player: 1, description: '竖向冲四获胜' }
                ],
                hints: ['边界限制了AI的防守选择']
            },
            {
                id: 'L2-08',
                level: 2,
                name: '连续冲四-1',
                description: '连续三次冲四',
                initialState: [
                    { x: 7, y: 7, player: 1 },
                    { x: 8, y: 7, player: 1 },
                    { x: 9, y: 7, player: 1 },
                    { x: 8, y: 6, player: 1 },
                    { x: 8, y: 8, player: 1 }
                ],
                solution: [
                    { x: 10, y: 7, player: 1, description: '第一次冲四' },
                    { x: 6, y: 7, player: 2, description: 'AI防守' },
                    { x: 8, y: 5, player: 1, description: '第二次冲四' },
                    { x: 8, y: 9, player: 2, description: 'AI防守' },
                    { x: 11, y: 7, player: 1, description: '成五获胜' }
                ],
                hints: ['持续施加冲四压力']
            },
            {
                id: 'L2-09',
                level: 2,
                name: '曲线VCF',
                description: '非直线的VCF路径',
                initialState: [
                    { x: 7, y: 7, player: 1 },
                    { x: 8, y: 8, player: 1 },
                    { x: 9, y: 9, player: 1 },
                    { x: 9, y: 7, player: 1 },
                    { x: 10, y: 7, player: 1 }
                ],
                solution: [
                    { x: 10, y: 10, player: 1, description: '斜线冲四' },
                    { x: 6, y: 6, player: 2, description: 'AI防守' },
                    { x: 11, y: 7, player: 1, description: '横线冲四获胜' }
                ],
                hints: ['VCF路径不一定是直线']
            },
            {
                id: 'L2-10',
                level: 2,
                name: '初级综合',
                description: '综合运用初级技巧',
                initialState: [
                    { x: 6, y: 6, player: 1 },
                    { x: 7, y: 7, player: 1 },
                    { x: 8, y: 8, player: 1 },
                    { x: 6, y: 8, player: 1 },
                    { x: 7, y: 9, player: 1 }
                ],
                solution: [
                    { x: 9, y: 9, player: 1, description: '主斜线冲四' },
                    { x: 5, y: 5, player: 2, description: 'AI防守' },
                    { x: 8, y: 10, player: 1, description: '反斜线冲四' },
                    { x: 5, y: 7, player: 2, description: 'AI防守' },
                    { x: 10, y: 10, player: 1, description: '成五获胜' }
                ],
                hints: ['两条斜线的完美配合']
            }
        ];
    }

    /**
     * 生成中级题目（level 3）
     * 特点：5-7步必胜，复杂防守，需要提前规划
     */
    generateLevel3Puzzles() {
        return [
            {
                id: 'L3-01',
                level: 3,
                name: '梅花阵',
                description: '五点梅花形状的VCF',
                initialState: [
                    { x: 7, y: 7, player: 1 },
                    { x: 6, y: 6, player: 1 },
                    { x: 8, y: 6, player: 1 },
                    { x: 6, y: 8, player: 1 },
                    { x: 8, y: 8, player: 1 }
                ],
                solution: [
                    { x: 5, y: 5, player: 1, description: '左上斜冲四' },
                    { x: 9, y: 9, player: 2, description: 'AI防守对角' },
                    { x: 9, y: 5, player: 1, description: '右上斜冲四' },
                    { x: 5, y: 9, player: 2, description: 'AI防守对角' },
                    { x: 7, y: 6, player: 1, description: '竖向冲四获胜' }
                ],
                hints: ['梅花五点形成多个冲四可能']
            },
            {
                id: 'L3-02',
                level: 3,
                name: '阶梯进攻',
                description: '逐级推进的VCF',
                initialState: [
                    { x: 7, y: 7, player: 1 },
                    { x: 8, y: 7, player: 1 },
                    { x: 9, y: 8, player: 1 },
                    { x: 10, y: 9, player: 1 }
                ],
                solution: [
                    { x: 9, y: 7, player: 1, description: '第一步冲四' },
                    { x: 6, y: 7, player: 2, description: 'AI防守' },
                    { x: 8, y: 8, player: 1, description: '第二步冲四' },
                    { x: 10, y: 8, player: 2, description: 'AI防守' },
                    { x: 11, y: 10, player: 1, description: '第三步冲四' },
                    { x: 9, y: 9, player: 2, description: 'AI防守' },
                    { x: 10, y: 7, player: 1, description: '成五获胜' }
                ],
                hints: ['像阶梯一样逐步推进']
            },
            {
                id: 'L3-03',
                level: 3,
                name: '双线交错',
                description: '两条线路交错进攻',
                initialState: [
                    { x: 7, y: 6, player: 1 },
                    { x: 7, y: 7, player: 1 },
                    { x: 8, y: 8, player: 1 },
                    { x: 9, y: 9, player: 1 },
                    { x: 8, y: 6, player: 1 }
                ],
                solution: [
                    { x: 7, y: 5, player: 1, description: '竖线冲四' },
                    { x: 7, y: 8, player: 2, description: 'AI防守' },
                    { x: 10, y: 10, player: 1, description: '斜线冲四' },
                    { x: 6, y: 6, player: 2, description: 'AI防守' },
                    { x: 9, y: 6, player: 1, description: '横线冲四' },
                    { x: 7, y: 4, player: 2, description: 'AI防守' },
                    { x: 11, y: 11, player: 1, description: '成五获胜' }
                ],
                hints: ['三个方向形成立体攻击']
            },
            {
                id: 'L3-04',
                level: 3,
                name: '假活三陷阱',
                description: '利用假活三迷惑对手',
                initialState: [
                    { x: 7, y: 7, player: 1 },
                    { x: 8, y: 7, player: 1 },
                    { x: 10, y: 7, player: 1 },
                    { x: 8, y: 8, player: 1 },
                    { x: 8, y: 9, player: 1 }
                ],
                solution: [
                    { x: 9, y: 7, player: 1, description: '补位形成冲四' },
                    { x: 6, y: 7, player: 2, description: 'AI防守横线' },
                    { x: 8, y: 10, player: 1, description: '竖线冲四' },
                    { x: 8, y: 6, player: 2, description: 'AI防守竖线' },
                    { x: 11, y: 7, player: 1, description: '横线冲四获胜' }
                ],
                hints: ['跳三形成的假活三是强力武器']
            },
            {
                id: 'L3-05',
                level: 3,
                name: '八方压制',
                description: '从中心向八方扩展',
                initialState: [
                    { x: 7, y: 7, player: 1 },
                    { x: 7, y: 6, player: 1 },
                    { x: 8, y: 7, player: 1 },
                    { x: 6, y: 7, player: 1 },
                    { x: 8, y: 8, player: 1 }
                ],
                solution: [
                    { x: 7, y: 5, player: 1, description: '上方冲四' },
                    { x: 7, y: 8, player: 2, description: 'AI防守下方' },
                    { x: 9, y: 7, player: 1, description: '右方冲四' },
                    { x: 5, y: 7, player: 2, description: 'AI防守左方' },
                    { x: 9, y: 9, player: 1, description: '右下冲四获胜' }
                ],
                hints: ['中心控制+四面扩展']
            },
            {
                id: 'L3-06',
                level: 3,
                name: '螺旋VCF',
                description: '螺旋状的VCF路径',
                initialState: [
                    { x: 7, y: 7, player: 1 },
                    { x: 8, y: 7, player: 1 },
                    { x: 8, y: 8, player: 1 },
                    { x: 7, y: 8, player: 1 },
                    { x: 6, y: 8, player: 1 }
                ],
                solution: [
                    { x: 9, y: 7, player: 1, description: '横向冲四' },
                    { x: 6, y: 7, player: 2, description: 'AI防守' },
                    { x: 9, y: 8, player: 1, description: '横向冲四' },
                    { x: 5, y: 8, player: 2, description: 'AI防守' },
                    { x: 7, y: 6, player: 1, description: '竖向冲四' },
                    { x: 7, y: 9, player: 2, description: 'AI防守' },
                    { x: 10, y: 7, player: 1, description: '成五获胜' }
                ],
                hints: ['像螺旋一样收紧包围圈']
            },
            {
                id: 'L3-07',
                level: 3,
                name: '多重陷阱',
                description: '设置多个VCF陷阱',
                initialState: [
                    { x: 7, y: 7, player: 1 },
                    { x: 8, y: 8, player: 1 },
                    { x: 9, y: 7, player: 1 },
                    { x: 7, y: 9, player: 1 },
                    { x: 6, y: 6, player: 1 }
                ],
                solution: [
                    { x: 9, y: 9, player: 1, description: '斜线冲四' },
                    { x: 10, y: 10, player: 2, description: 'AI防守' },
                    { x: 10, y: 7, player: 1, description: '横线冲四' },
                    { x: 8, y: 7, player: 2, description: 'AI防守' },
                    { x: 8, y: 10, player: 1, description: '反斜冲四' },
                    { x: 6, y: 8, player: 2, description: 'AI防守' },
                    { x: 5, y: 5, player: 1, description: '成五获胜' }
                ],
                hints: ['多个方向同时威胁']
            },
            {
                id: 'L3-08',
                level: 3,
                name: '连环套',
                description: '一个接一个的连环冲四',
                initialState: [
                    { x: 6, y: 7, player: 1 },
                    { x: 7, y: 7, player: 1 },
                    { x: 8, y: 7, player: 1 },
                    { x: 7, y: 6, player: 1 },
                    { x: 7, y: 8, player: 1 },
                    { x: 8, y: 6, player: 1 }
                ],
                solution: [
                    { x: 9, y: 7, player: 1, description: '横向冲四' },
                    { x: 5, y: 7, player: 2, description: 'AI防守' },
                    { x: 7, y: 5, player: 1, description: '竖向冲四' },
                    { x: 7, y: 9, player: 2, description: 'AI防守' },
                    { x: 9, y: 5, player: 1, description: '斜向冲四获胜' }
                ],
                hints: ['每一步都在为下一步铺路']
            },
            {
                id: 'L3-09',
                level: 3,
                name: '逆向思维',
                description: '反常规的VCF路径',
                initialState: [
                    { x: 7, y: 7, player: 1 },
                    { x: 6, y: 8, player: 1 },
                    { x: 8, y: 6, player: 1 },
                    { x: 9, y: 7, player: 1 },
                    { x: 7, y: 9, player: 1 }
                ],
                solution: [
                    { x: 5, y: 9, player: 1, description: '反斜冲四' },
                    { x: 10, y: 4, player: 2, description: 'AI防守' },
                    { x: 10, y: 7, player: 1, description: '横向冲四' },
                    { x: 8, y: 7, player: 2, description: 'AI防守' },
                    { x: 8, y: 10, player: 1, description: '竖向冲四' },
                    { x: 6, y: 10, player: 2, description: 'AI防守' },
                    { x: 9, y: 5, player: 1, description: '成五获胜' }
                ],
                hints: ['有时需要走看似无关的棋']
            },
            {
                id: 'L3-10',
                level: 3,
                name: '中级综合',
                description: '中级技巧的综合应用',
                initialState: [
                    { x: 7, y: 7, player: 1 },
                    { x: 8, y: 7, player: 1 },
                    { x: 9, y: 7, player: 1 },
                    { x: 7, y: 8, player: 1 },
                    { x: 8, y: 9, player: 1 },
                    { x: 8, y: 6, player: 1 }
                ],
                solution: [
                    { x: 10, y: 7, player: 1, description: '横向冲四' },
                    { x: 6, y: 7, player: 2, description: 'AI防守' },
                    { x: 9, y: 10, player: 1, description: '斜向冲四' },
                    { x: 7, y: 9, player: 2, description: 'AI防守' },
                    { x: 8, y: 5, player: 1, description: '竖向冲四' },
                    { x: 8, y: 10, player: 2, description: 'AI防守' },
                    { x: 11, y: 7, player: 1, description: '成五获胜' }
                ],
                hints: ['三个方向的完美配合']
            }
        ];
    }

    /**
     * 生成高级题目（level 4）
     * 特点：8-12步必胜，极其复杂的防守，需要深度计算
     */
    generateLevel4Puzzles() {
        return [
            {
                id: 'L4-01',
                level: 4,
                name: '大师级VCF-1',
                description: '复杂的多步VCF序列',
                initialState: [
                    { x: 7, y: 7, player: 1 },
                    { x: 8, y: 7, player: 1 },
                    { x: 6, y: 7, player: 1 },
                    { x: 7, y: 8, player: 1 },
                    { x: 7, y: 6, player: 1 },
                    { x: 8, y: 8, player: 1 },
                    { x: 6, y: 6, player: 1 }
                ],
                solution: [
                    { x: 9, y: 7, player: 1, description: '第1步冲四' },
                    { x: 5, y: 7, player: 2, description: 'AI防守' },
                    { x: 7, y: 9, player: 1, description: '第2步冲四' },
                    { x: 7, y: 5, player: 2, description: 'AI防守' },
                    { x: 9, y: 9, player: 1, description: '第3步冲四' },
                    { x: 5, y: 5, player: 2, description: 'AI防守' },
                    { x: 10, y: 7, player: 1, description: '第4步冲四' },
                    { x: 4, y: 7, player: 2, description: 'AI防守' },
                    { x: 7, y: 10, player: 1, description: '第5步冲四获胜' }
                ],
                hints: ['需要精确计算每一步', '维持多个冲四威胁点']
            },
            {
                id: 'L4-02',
                level: 4,
                name: '大师级VCF-2',
                description: '星形辐射攻击',
                initialState: [
                    { x: 7, y: 7, player: 1 },
                    { x: 8, y: 6, player: 1 },
                    { x: 9, y: 5, player: 1 },
                    { x: 8, y: 8, player: 1 },
                    { x: 9, y: 9, player: 1 },
                    { x: 6, y: 8, player: 1 }
                ],
                solution: [
                    { x: 10, y: 4, player: 1, description: '右上斜冲四' },
                    { x: 7, y: 8, player: 2, description: 'AI防守' },
                    { x: 10, y: 10, player: 1, description: '右下斜冲四' },
                    { x: 6, y: 6, player: 2, description: 'AI防守' },
                    { x: 5, y: 9, player: 1, description: '左下冲四' },
                    { x: 7, y: 6, player: 2, description: 'AI防守' },
                    { x: 10, y: 7, player: 1, description: '横向冲四' },
                    { x: 6, y: 7, player: 2, description: 'AI防守' },
                    { x: 11, y: 3, player: 1, description: '成五获胜' }
                ],
                hints: ['像星星一样向各个方向辐射']
            },
            {
                id: 'L4-03',
                level: 4,
                name: '迷宫VCF',
                description: '迷宫般复杂的路径',
                initialState: [
                    { x: 7, y: 7, player: 1 },
                    { x: 7, y: 6, player: 1 },
                    { x: 8, y: 6, player: 1 },
                    { x: 8, y: 7, player: 1 },
                    { x: 9, y: 8, player: 1 },
                    { x: 6, y: 8, player: 1 },
                    { x: 6, y: 7, player: 1 }
                ],
                solution: [
                    { x: 7, y: 5, player: 1, description: '竖向冲四' },
                    { x: 7, y: 8, player: 2, description: 'AI防守' },
                    { x: 9, y: 6, player: 1, description: '横向冲四' },
                    { x: 5, y: 6, player: 2, description: 'AI防守' },
                    { x: 10, y: 9, player: 1, description: '斜向冲四' },
                    { x: 5, y: 7, player: 2, description: 'AI防守' },
                    { x: 9, y: 7, player: 1, description: '横向冲四' },
                    { x: 8, y: 8, player: 2, description: 'AI防守' },
                    { x: 7, y: 9, player: 1, description: '竖向冲四' },
                    { x: 7, y: 4, player: 2, description: 'AI防守' },
                    { x: 10, y: 6, player: 1, description: '成五获胜' }
                ],
                hints: ['需要在复杂的局面中找到唯一解']
            },
            {
                id: 'L4-04',
                level: 4,
                name: '时空隧道',
                description: '跨越大范围的VCF',
                initialState: [
                    { x: 3, y: 3, player: 1 },
                    { x: 4, y: 4, player: 1 },
                    { x: 5, y: 5, player: 1 },
                    { x: 9, y: 9, player: 1 },
                    { x: 10, y: 10, player: 1 },
                    { x: 11, y: 11, player: 1 }
                ],
                solution: [
                    { x: 6, y: 6, player: 1, description: '连接两段' },
                    { x: 2, y: 2, player: 2, description: 'AI防守一端' },
                    { x: 12, y: 12, player: 1, description: '另一端冲四' },
                    { x: 13, y: 13, player: 2, description: 'AI防守' },
                    { x: 7, y: 7, player: 1, description: '中段冲四' },
                    { x: 8, y: 8, player: 2, description: 'AI防守' },
                    { x: 1, y: 1, player: 1, description: '成五获胜' }
                ],
                hints: ['两个远距离的棋组需要连接']
            },
            {
                id: 'L4-05',
                level: 4,
                name: '量子纠缠',
                description: '多个棋组互相关联',
                initialState: [
                    { x: 4, y: 7, player: 1 },
                    { x: 5, y: 7, player: 1 },
                    { x: 6, y: 7, player: 1 },
                    { x: 9, y: 7, player: 1 },
                    { x: 10, y: 7, player: 1 },
                    { x: 7, y: 4, player: 1 },
                    { x: 7, y: 5, player: 1 }
                ],
                solution: [
                    { x: 7, y: 7, player: 1, description: '中心关键点' },
                    { x: 3, y: 7, player: 2, description: 'AI防守左侧' },
                    { x: 7, y: 6, player: 1, description: '竖向冲四' },
                    { x: 7, y: 3, player: 2, description: 'AI防守上侧' },
                    { x: 11, y: 7, player: 1, description: '右侧冲四' },
                    { x: 8, y: 7, player: 2, description: 'AI防守中间' },
                    { x: 7, y: 8, player: 1, description: '竖向冲四' },
                    { x: 7, y: 9, player: 2, description: 'AI防守' },
                    { x: 12, y: 7, player: 1, description: '成五获胜' }
                ],
                hints: ['中心点是关键']
            },
            {
                id: 'L4-06',
                level: 4,
                name: '龙卷风',
                description: '旋转式的攻击序列',
                initialState: [
                    { x: 7, y: 7, player: 1 },
                    { x: 8, y: 7, player: 1 },
                    { x: 8, y: 8, player: 1 },
                    { x: 7, y: 8, player: 1 },
                    { x: 7, y: 9, player: 1 },
                    { x: 6, y: 9, player: 1 },
                    { x: 6, y: 8, player: 1 }
                ],
                solution: [
                    { x: 9, y: 7, player: 1, description: '东向冲四' },
                    { x: 6, y: 7, player: 2, description: 'AI防守西' },
                    { x: 9, y: 8, player: 1, description: '东向冲四' },
                    { x: 5, y: 8, player: 2, description: 'AI防守西' },
                    { x: 8, y: 9, player: 1, description: '横向冲四' },
                    { x: 5, y: 9, player: 2, description: 'AI防守' },
                    { x: 7, y: 10, player: 1, description: '竖向冲四' },
                    { x: 7, y: 6, player: 2, description: 'AI防守' },
                    { x: 10, y: 7, player: 1, description: '成五获胜' }
                ],
                hints: ['像龙卷风一样旋转收紧']
            },
            {
                id: 'L4-07',
                level: 4,
                name: '银河系',
                description: '极其复杂的宇宙级VCF',
                initialState: [
                    { x: 7, y: 7, player: 1 },
                    { x: 6, y: 6, player: 1 },
                    { x: 8, y: 6, player: 1 },
                    { x: 8, y: 8, player: 1 },
                    { x: 6, y: 8, player: 1 },
                    { x: 5, y: 7, player: 1 },
                    { x: 9, y: 7, player: 1 },
                    { x: 7, y: 5, player: 1 }
                ],
                solution: [
                    { x: 5, y: 5, player: 1, description: '西北冲四' },
                    { x: 9, y: 9, player: 2, description: 'AI防守东南' },
                    { x: 9, y: 5, player: 1, description: '东北冲四' },
                    { x: 5, y: 9, player: 2, description: 'AI防守西南' },
                    { x: 4, y: 7, player: 1, description: '西向冲四' },
                    { x: 10, y: 7, player: 2, description: 'AI防守东' },
                    { x: 7, y: 4, player: 1, description: '北向冲四' },
                    { x: 7, y: 9, player: 2, description: 'AI防守南' },
                    { x: 10, y: 6, player: 1, description: '斜向冲四' },
                    { x: 6, y: 10, player: 2, description: 'AI防守' },
                    { x: 3, y: 7, player: 1, description: '成五获胜' }
                ],
                hints: ['八方位全方位攻击']
            },
            {
                id: 'L4-08',
                level: 4,
                name: '黑洞引力',
                description: '向中心聚集的VCF',
                initialState: [
                    { x: 2, y: 7, player: 1 },
                    { x: 3, y: 7, player: 1 },
                    { x: 11, y: 7, player: 1 },
                    { x: 12, y: 7, player: 1 },
                    { x: 7, y: 2, player: 1 },
                    { x: 7, y: 3, player: 1 },
                    { x: 7, y: 11, player: 1 },
                    { x: 7, y: 12, player: 1 }
                ],
                solution: [
                    { x: 4, y: 7, player: 1, description: '西向冲四' },
                    { x: 1, y: 7, player: 2, description: 'AI防守边界' },
                    { x: 10, y: 7, player: 1, description: '东向冲四' },
                    { x: 13, y: 7, player: 2, description: 'AI防守边界' },
                    { x: 7, y: 4, player: 1, description: '北向冲四' },
                    { x: 7, y: 1, player: 2, description: 'AI防守边界' },
                    { x: 7, y: 10, player: 1, description: '南向冲四' },
                    { x: 7, y: 13, player: 2, description: 'AI防守边界' },
                    { x: 7, y: 7, player: 1, description: '中心点' },
                    { x: 5, y: 7, player: 2, description: 'AI防守' },
                    { x: 9, y: 7, player: 1, description: '成五获胜' }
                ],
                hints: ['从四面八方向中心收拢']
            },
            {
                id: 'L4-09',
                level: 4,
                name: '终极试炼',
                description: '顶级VCF综合考验',
                initialState: [
                    { x: 7, y: 7, player: 1 },
                    { x: 8, y: 7, player: 1 },
                    { x: 9, y: 7, player: 1 },
                    { x: 7, y: 8, player: 1 },
                    { x: 8, y: 8, player: 1 },
                    { x: 8, y: 9, player: 1 },
                    { x: 6, y: 6, player: 1 },
                    { x: 7, y: 6, player: 1 }
                ],
                solution: [
                    { x: 10, y: 7, player: 1, description: '东向冲四' },
                    { x: 6, y: 7, player: 2, description: 'AI防守西' },
                    { x: 9, y: 9, player: 1, description: '斜向冲四' },
                    { x: 7, y: 9, player: 2, description: 'AI防守' },
                    { x: 8, y: 6, player: 1, description: '竖向冲四' },
                    { x: 8, y: 10, player: 2, description: 'AI防守' },
                    { x: 5, y: 5, player: 1, description: '西北冲四' },
                    { x: 9, y: 6, player: 2, description: 'AI防守' },
                    { x: 7, y: 5, player: 1, description: '竖向冲四' },
                    { x: 10, y: 10, player: 2, description: 'AI防守' },
                    { x: 11, y: 7, player: 1, description: '成五获胜' }
                ],
                hints: ['需要极强的计算能力和耐心']
            },
            {
                id: 'L4-10',
                level: 4,
                name: '传说之局',
                description: '传说级别的VCF难题',
                initialState: [
                    { x: 5, y: 5, player: 1 },
                    { x: 6, y: 6, player: 1 },
                    { x: 7, y: 7, player: 1 },
                    { x: 8, y: 8, player: 1 },
                    { x: 9, y: 9, player: 1 },
                    { x: 5, y: 9, player: 1 },
                    { x: 6, y: 8, player: 1 },
                    { x: 8, y: 6, player: 1 },
                    { x: 9, y: 5, player: 1 }
                ],
                solution: [
                    { x: 10, y: 10, player: 1, description: '主斜冲四' },
                    { x: 4, y: 4, player: 2, description: 'AI防守' },
                    { x: 10, y: 4, player: 1, description: '反斜冲四' },
                    { x: 4, y: 10, player: 2, description: 'AI防守' },
                    { x: 7, y: 6, player: 1, description: '竖向冲四' },
                    { x: 7, y: 8, player: 2, description: 'AI防守' },
                    { x: 10, y: 5, player: 1, description: '横向冲四' },
                    { x: 5, y: 6, player: 2, description: 'AI防守' },
                    { x: 9, y: 7, player: 1, description: '横向冲四' },
                    { x: 6, y: 7, player: 2, description: 'AI防守' },
                    { x: 11, y: 11, player: 1, description: '斜向冲四' },
                    { x: 3, y: 3, player: 2, description: 'AI防守' },
                    { x: 7, y: 5, player: 1, description: '成五获胜' }
                ],
                hints: ['X型交叉的终极应用', '需要12步的完美计算']
            }
        ];
    }

    /**
     * 获取指定难度的随机题目
     * @param {number} level - 难度等级 (1-4)
     * @returns {Object} 题目对象
     */
    getRandomPuzzle(level = 1) {
        const pool = this.puzzles.filter(p => p.level === level);
        if (pool.length === 0) return null;

        // 优先选择未完成的题目
        const unfinished = pool.filter(p => !this.progress.completed[p.id]);
        const availablePool = unfinished.length > 0 ? unfinished : pool;
        
        const puzzle = availablePool[Math.floor(Math.random() * availablePool.length)];
        this.startPuzzle(puzzle);
        return puzzle;
    }

    /**
     * 通过ID获取题目
     * @param {string} id - 题目ID
     * @returns {Object|null}
     */
    getPuzzleById(id) {
        const puzzle = this.puzzles.find(p => p.id === id);
        if (puzzle) {
            this.startPuzzle(puzzle);
        }
        return puzzle;
    }

    /**
     * 开始一个题目
     * @param {Object} puzzle - 题目对象
     */
    startPuzzle(puzzle) {
        this.currentPuzzle = puzzle;
        this.currentStep = 0;
    }

    /**
     * 验证玩家走法
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     * @returns {Object} 验证结果
     */
    validateMove(x, y) {
        if (!this.currentPuzzle) {
            return {
                success: false,
                error: '没有正在进行的题目',
                code: 'NO_PUZZLE'
            };
        }

        if (this.currentStep >= this.currentPuzzle.solution.length) {
            return {
                success: false,
                error: '题目已完成',
                code: 'ALREADY_COMPLETED'
            };
        }

        const correctMove = this.currentPuzzle.solution[this.currentStep];
        
        if (correctMove.x === x && correctMove.y === y) {
            this.currentStep++;
            
            // 检查是否完成
            const isCompleted = this.currentStep >= this.currentPuzzle.solution.length;
            
            if (isCompleted) {
                this.completePuzzle();
            }

            return {
                success: true,
                correct: true,
                step: this.currentStep,
                totalSteps: this.currentPuzzle.solution.length,
                isCompleted: isCompleted,
                nextMove: isCompleted ? null : this.currentPuzzle.solution[this.currentStep],
                message: correctMove.description || '正确！'
            };
        } else {
            return {
                success: true,
                correct: false,
                correctMove: correctMove,
                message: '走法不正确，请重试',
                hint: this.currentPuzzle.hints[0] || '再想想...'
            };
        }
    }

    /**
     * 完成题目
     */
    completePuzzle() {
        if (!this.currentPuzzle) return;

        this.progress.completed[this.currentPuzzle.id] = true;
        this.progress.totalCompleted++;
        this.progress.byLevel[this.currentPuzzle.level]++;
        this.saveProgress();
    }

    /**
     * 重置当前题目
     */
    resetPuzzle() {
        this.currentStep = 0;
    }

    /**
     * 获取提示
     * @returns {string}
     */
    getHint() {
        if (!this.currentPuzzle || !this.currentPuzzle.hints) {
            return '暂无提示';
        }
        const hintIndex = Math.min(this.currentStep, this.currentPuzzle.hints.length - 1);
        return this.currentPuzzle.hints[hintIndex] || '继续加油！';
    }

    /**
     * 获取当前正确走法
     * @returns {Object|null}
     */
    getCurrentCorrectMove() {
        if (!this.currentPuzzle || this.currentStep >= this.currentPuzzle.solution.length) {
            return null;
        }
        return this.currentPuzzle.solution[this.currentStep];
    }

    /**
     * 获取完整解法
     * @returns {Array}
     */
    getSolution() {
        return this.currentPuzzle ? this.currentPuzzle.solution : [];
    }

    /**
     * 获取进度统计
     * @returns {Object}
     */
    getProgress() {
        const total = this.puzzles.length;
        const completed = this.progress.totalCompleted;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
            total: total,
            completed: completed,
            percentage: percentage,
            byLevel: {
                1: this.progress.byLevel[1] || 0,
                2: this.progress.byLevel[2] || 0,
                3: this.progress.byLevel[3] || 0,
                4: this.progress.byLevel[4] || 0
            }
        };
    }

    /**
     * 加载进度
     * @returns {Object}
     */
    loadProgress() {
        const saved = GameUtils.loadFromLocalStorage('vcf_practice_progress');
        if (saved.success && saved.data) {
            return saved.data;
        }
        
        // 默认进度
        return {
            completed: {},
            totalCompleted: 0,
            byLevel: { 1: 0, 2: 0, 3: 0, 4: 0 }
        };
    }

    /**
     * 保存进度
     */
    saveProgress() {
        GameUtils.saveToLocalStorage('vcf_practice_progress', this.progress);
    }

    /**
     * 重置进度
     */
    resetProgress() {
        this.progress = {
            completed: {},
            totalCompleted: 0,
            byLevel: { 1: 0, 2: 0, 3: 0, 4: 0 }
        };
        this.saveProgress();
    }

    /**
     * 获取统计信息
     * @returns {Object}
     */
    getStatistics() {
        const progress = this.getProgress();
        const puzzlesByLevel = {
            1: this.puzzles.filter(p => p.level === 1).length,
            2: this.puzzles.filter(p => p.level === 2).length,
            3: this.puzzles.filter(p => p.level === 3).length,
            4: this.puzzles.filter(p => p.level === 4).length
        };

        return {
            totalPuzzles: this.puzzles.length,
            completedPuzzles: progress.completed,
            completionPercentage: progress.percentage,
            puzzlesByLevel: puzzlesByLevel,
            completedByLevel: progress.byLevel,
            currentPuzzle: this.currentPuzzle ? this.currentPuzzle.id : null,
            currentStep: this.currentStep
        };
    }
}

// 模块信息
const VCF_PRACTICE_MODULE_INFO = {
    name: 'VCFPracticeManager',
    version: '5.0.0',
    dependencies: ['GameUtils'],
    description: 'VCF练习管理器 - 40道VCF题库及验证系统'
};

VCFPracticeManager.__moduleInfo = VCF_PRACTICE_MODULE_INFO;

// 导出到window对象
if (typeof window !== 'undefined') {
    window.VCFPracticeManager = VCFPracticeManager;
}
