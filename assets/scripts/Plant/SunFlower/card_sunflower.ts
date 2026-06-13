import GameScene from "../../GameScene";
import ResMgr from "../../ResMgr";
import Sound from "../../Sound";

const { ccclass, property } = cc._decorator;

@ccclass
export default class card_sunflower extends cc.Component {
    //声明变量
    graw: null | cc.Node = null;
    grawSprite: null | cc.Sprite = null;
    timer: number = 0;//计时器时间
    coldTime: number = 5;//冷却时间

    plantStatic: null | cc.Node = null;//植物UI体
    plantAction: null | cc.Node = null;//植物实体

    // 拖动状态标记：防止触摸异常导致自动种植
    isDragging: boolean = false;

    start() {
        this.graw = this.node.getChildByName("graw");//获取遮罩的节点
        this.grawSprite = this.graw.getComponent(cc.Sprite);//获取这个遮罩的sprite组件
        this.grawSprite.fillRange = 1;

        //获取植物UI体的预制体
        this.plantStatic = cc.instantiate(ResMgr.Instance.getPrefab("SunFlowerUI"))
        this.plantStatic.active = false;
        this.plantStatic.parent = GameScene.instance.node;

        //  关闭预览植物的触摸交互，不让它挡住手指事件
        this.plantStatic.touchable = false;

        //绑定触摸事件
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    update(dt: number) {   //冷却没结束，继续计时
        if (this.grawSprite.fillRange > 0) {
            this.timer += dt;
            this.grawSprite.fillRange = 1 - this.timer / this.coldTime;
        }
    }

    //== 事件回调函数==//
    onTouchStart(event: any) {
        if (this.grawSprite.fillRange > 0) return;
        console.log("点击了卡牌");
        //显示植物UI体
        this.plantStatic.active = true;
        this.plantStatic.position = GameScene.instance.node.convertToNodeSpaceAR(event.getLocation()); //将触摸位置转换为节点空间坐标
    }

    onTouchMove(event: any) {
        if (this.grawSprite.fillRange > 0) return;
        console.log("移动了卡牌")
        // this.plantStatic.position = GameScene.instance.node.convertToNodeSpaceAR(event.getLocation()); //将触摸位置转换为节点空间坐标

        // 1. 获取手指当前的屏幕坐标
        const touchPos = event.getLocation();

        // 2. 调用GameScene的getGridPos方法，算出手指对应哪个格子
        //    找到就返回 {row, col}，找不到就返回 null
        const gridPos = GameScene.instance.getGridPos(touchPos);

        // 3. 能吸附到合法空格子 → 自动对齐到草块中心
        if (gridPos && GameScene.instance.canPlant(gridPos.row, gridPos.col)) {
            this.plantStatic.position = GameScene.instance.getCellCenter(gridPos.row, gridPos.col);
        }
        else {
            // 不能吸附 → 老老实实跟着鼠标走，全程可见、不半透明
            this.plantStatic.position = GameScene.instance.node.convertToNodeSpaceAR(touchPos);
        }
    }

    onTouchEnd(event: any) {
        if (this.grawSprite.fillRange > 0) return;
        this.isDragging = false;
        this.plantStatic.active = false;
    }
    onTouchCancel(event: any) {
        if (this.grawSprite.fillRange > 0) return;
        this.plantStatic.active = false;
        // this.plantAction = cc.instantiate(ResMgr.Instance.getPrefab("SunFlower"));
        // this.plantAction.position = GameScene.instance.node.convertToNodeSpaceAR(event.getLocation()); //将触摸位置转换为节点空间坐标
        // this.plantAction.parent = GameScene.instance.node;
        // this.plantAction.active = true;
        // this.timer =0;
        // this.grawSprite.fillRange = 1;

        // 1. 获取手指松开时的屏幕坐标
        const touchPos = event.getLocation();
        // 2. 算出松开位置对应的格子
        const gridPos = GameScene.instance.getGridPos(touchPos);

        // 3. 判断：找不到格子 或者 格子已经有植物了 → 不种植，直接退出
        if (!gridPos || !GameScene.instance.canPlant(gridPos.row, gridPos.col)) {
            return;
        }

        // 4. 能吸附且格子空闲 → 创建真实的向日葵植物
        this.plantAction = cc.instantiate(ResMgr.Instance.getPrefab("SunFlower"));
        // 调用统一种植方法，内部自动放位置、标记格子已占用
        const isSuccess = GameScene.instance.plantAtGrid(gridPos.row, gridPos.col, this.plantAction);

        // 5. 种植成功后播放音效、开启卡牌冷却
        if (isSuccess) {
            Sound.Instance.playEffect("plant");
            this.timer = 0;
            this.grawSprite.fillRange = 1;
            console.log(`向日葵种植成功！第${gridPos.row + 1}行，第${gridPos.col + 1}列`);
        }

    }
}
