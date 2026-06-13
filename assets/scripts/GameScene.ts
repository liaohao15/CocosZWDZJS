import Sound from "./Sound";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameScene extends cc.Component {

    //单例模式，只有一个GameScene实例
    public static instance: GameScene | null = null;

    //格子坐标
    private gridPosition: Array<Array<cc.Vec2>> = [];
    //格子状态
    private gridState: Array<Array<boolean>> = [];

    //草地节点
    @property({ displayName: "草地节点" })
    grassField:  null |cc.Node = null;
    //吸附最大距离
    @property({ displayName: "吸附最大距离" })
    snapDistance: number = 40;


    protected onLoad(): void {
        //赋值单例
        GameScene.instance = this;

        this.grassField = cc.find("Canvas/background1");
        //初始化所有格子的坐标和状态
        this.initGrid();
    }

    start() {
        //进行背景音乐播放
        Sound.Instance.playMusic("bgm2");
    }

    private initGrid() {
        this.gridPosition = [
            //第0行
            [cc.v2(-287, 170), cc.v2(-220, 170), cc.v2(-138, 170),
            cc.v2(-56, 170), cc.v2(22, 170), cc.v2(104, 170),
            cc.v2(187, 170), cc.v2(263, 170), cc.v2(346, 170)],
            //第1行
            [cc.v2(-287, 76), cc.v2(-220, 76), cc.v2(-138, 76),
            cc.v2(-56, 76), cc.v2(22, 76), cc.v2(104, 76),
            cc.v2(187, 76), cc.v2(263, 76), cc.v2(346, 76)],
            // 第2行
             [cc.v2(-287, -23), cc.v2(-220, -23), cc.v2(-138, -23),
            cc.v2(-56, -23), cc.v2(22, -23), cc.v2(104, -23),
            cc.v2(187, -23), cc.v2(263, -23), cc.v2(346, -23)],
            // 第3行
             [cc.v2(-298, -124), cc.v2(-220, -124), cc.v2(-138, -124),
            cc.v2(-56, -124), cc.v2(22, -124), cc.v2(104, -124),
            cc.v2(187, -124), cc.v2(263, -124), cc.v2(346, -124)],
            // 第4行
            [cc.v2(-300, -219), cc.v2(-220, -219), cc.v2(-138, -219),
            cc.v2(-56, -219), cc.v2(22, -219), cc.v2(104, -219),
            cc.v2(187, -219), cc.v2(263, -219), cc.v2(346, -219)]];

        //初始化格子状态
        this.gridState = [];
        for (let row = 0; row < 5; row++) {
            this.gridState[row] = [];
            for (let col = 0; col < 9; col++) {
                this.gridState[row][col] = false;//全部设置false，即可以种植
            }
        }

    }

    public getGridPos(worldPos: cc.Vec2): { row: number, col: number } | null {
        //把屏幕坐标转换成Canvas节点的局部坐标
        const touchLocal = this.node.convertToNodeSpaceAR(worldPos);

        //记录目前找到的最近的格子
        let minDistance = Infinity; // 记录最小距离，初始设为无穷大（相当于没有冠军）
        let nearestRow = -1;       // 记录最近格子的行号，初始-1表示还没找到
        let nearestCol = -1;       // 记录最近格子的列号，初始-1表示还没找到

        //双层循环，逐个检查所有45个格子
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 9; col++) {
                // 从坐标表里取出当前正在检查的这个格子的坐标
                const cellPos = this.gridPosition[row][col];
                // 计算手指位置到当前格子中心的直线距离
                // .sub()：两个坐标相减，得到横向和纵向的差值
                // .mag()：求向量长度，对应数学里的勾股定理，算出两点直线距离
                const distance = touchLocal.sub(cellPos).mag();

                // 打擂台逻辑
                // 如果当前格子的距离，比之前记录的「最小距离」还要小
                if (distance < minDistance) {
                    // 就更新最小距离为当前格子的距离
                    minDistance = distance;
                    // 更新最近格子的行号
                    nearestRow = row;
                    // 更新最近格子的列号
                    nearestCol = col;
                }
                // 继续检查下一个格子
            }
        }
        if (minDistance <= this.snapDistance) {
            // 返回这个格子的行号和列号
            return { row: nearestRow, col: nearestCol };
        }
        // 距离太远，不吸附，返回空
        return null;
    }

      //根据行列号，获取格子中心的屏幕坐标
    public getCellCenter(row: number, col: number): cc.Vec2 {
        return this.gridPosition[row][col];
    }

    
    // 检查某个格子能不能种植
    public canPlant(row: number, col: number): boolean {
        // 先检查行列号有没有超出5行9列的范围
        if (row < 0 || row >= 5 || col < 0 || col >= 9) {
            return false;
        }
        // 格子状态是 false（空闲）才能种，取反后返回
        return !this.gridState[row][col];
    }

      //在指定格子种植植物
    public plantAtGrid(row: number, col: number, plantNode: cc.Node): boolean {
        // 先检查能不能种
        if (!this.canPlant(row, col)) {
            // 不能种就销毁植物节点，避免占用内存
            plantNode.destroy();
            return false;
        }

        // 设置植物位置到格子中心
        plantNode.position = this.getCellCenter(row, col);
        // 把植物挂到场景节点下，才会显示在屏幕上
        plantNode.parent = this.node;
        // 非常重要：标记这个格子已被占用，以后不能再种
        this.gridState[row][col] = true;

        return true;
    }

}
