import GameScene from "../../GameScene";
import ResMgr from "../../ResMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class card_peashooter extends cc.Component {
    //声明变量
    graw: null | cc.Node = null;
    grawSprite: null | cc.Sprite = null;
    timer: number = 0;//计时器时间
    coldTime: number = 5;//冷却时间

    plantStatic: null | cc.Node = null;//植物UI体
    plantAction: null | cc.Node = null;//植物实体

    start() {
        this.graw = this.node.getChildByName("graw");
        this.grawSprite = this.graw.getComponent(cc.Sprite);
        this.grawSprite.fillRange = 1;

        //获取植物UI体的预制体
        this.plantStatic = cc.instantiate(ResMgr.Instance.getPrefab("PeashooterUI"))
        this.plantStatic.active = false;
        this.plantStatic.parent = GameScene.instance.node;

        //绑定触摸事件
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    update(dt: number) {
        if (this.grawSprite.fillRange > 0) {
            this.timer += dt;
            this.grawSprite.fillRange = 1 - this.timer / this.coldTime;
        }
    }

    //== 事件回调函数==//
    onTouchStart(event: any) {
        if (this.grawSprite.fillRange > 0) return;
        //显示植物UI体
        this.plantStatic.active = true;
        this.plantStatic.position = GameScene.instance.node.convertToNodeSpaceAR(event.getLocation()); //将触摸位置转换为节点空间坐标
    }


    onTouchMove(event: any) {
        if(this.grawSprite.fillRange >0)return;
        console.log("移动了卡牌")  
        this.plantStatic.position = GameScene.instance.node.convertToNodeSpaceAR(event.getLocation()); //将触摸位置转换为节点空间坐标
    }

    onTouchEnd(event: any) {
        if (this.grawSprite.fillRange > 0) return;
        this.plantStatic.active = false;
    }

    onTouchCancel(event: any) {
        if (this.grawSprite.fillRange > 0) return;
        this.plantStatic.active = false;
        this.plantAction = cc.instantiate(ResMgr.Instance.getPrefab("Peashooter"));
        this.plantAction.position = GameScene.instance.node.convertToNodeSpaceAR(event.getLocation()); //将触摸位置转换为节点空间坐标
        this.plantAction.parent = GameScene.instance.node;
        this.plantAction.active = true;
        this.timer = 0;
        this.grawSprite.fillRange = 1;
    }
}
