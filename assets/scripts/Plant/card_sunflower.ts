import GameScene from "../GameScene";
import Sound from "../Sound";

const {ccclass, property} = cc._decorator;

@ccclass
export default class card_sunflower extends cc.Component {
//声明变量
    graw: null | cc.Node = null;
    grawSprite: null | cc.Sprite = null;
    timer: number = 0;//计时器时间
    coldTime: number = 5;//冷却时间

    plantStatic:null | cc.Node = null;//植物UI体
    plantAction:null | cc.Node = null;//植物实体

    start() {
        this.graw = this.node.getChildByName("graw");
        this.grawSprite = this.graw.getComponent(cc.Sprite);
        this.grawSprite.fillRange = 1;

        //获取植物UI体
        this.plantStatic = GameScene.instance.node.getChildByName("SunFlowerUI");
        this.plantStatic.active = false;
        //获取植物实体
        this.plantAction = GameScene.instance.node.getChildByName("SunFlower");
        this.plantAction.active = false;

        //绑定触摸事件
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    update(dt: number) {
        if (this.timer >= this.coldTime) {
            console.log("冷却完成，可以再次使用");
            this.timer = 0;
            this.grawSprite.fillRange = 1;
        }
        //dt是实际帧率的时间间隔，单位是秒
        this.timer += dt;
        this.grawSprite.fillRange = 1- this.timer / this.coldTime;
    }

     //== 事件回调函数==//
    onTouchStart(event: any) 
    {
        console.log("点击了卡牌");
        //显示植物UI体
        this.plantStatic.active = true;
        this.plantStatic.position = GameScene.instance.node.convertToNodeSpaceAR(event.getLocation()); //将触摸位置转换为节点空间坐标

    }

    onTouchMove(event: any) {
        console.log("移动了卡牌");
        this.plantStatic.position = GameScene.instance.node.convertToNodeSpaceAR(event.getLocation()); //将触摸位置转换为节点空间坐标
    }

    onTouchEnd(event: any) 
    {
        this.plantStatic.active = false;
        console.log("取消了卡牌");
    }

    onTouchCancel(event: any) 
    {
        this.plantStatic.active = false;
        console.log("放置了卡牌");
        this.plantAction.active = true;
        this.plantAction.position = GameScene.instance.node.convertToNodeSpaceAR(event.getLocation()); //将触摸位置转换为节点空间坐标
        //进行种植音效播放
        Sound.Instance.playEffect("plant");
    }
}
