const {ccclass, property} = cc._decorator;

@ccclass
export default class card_wallnut extends cc.Component {
//声明变量
    graw: null | cc.Node = null;
    grawSprite: null | cc.Sprite = null;
    timer: number = 0;//计时器时间
    coldTime: number = 5;//冷却时间

    start() {
        this.graw = this.node.getChildByName("graw");
        this.grawSprite = this.graw.getComponent(cc.Sprite);
        this.grawSprite.fillRange = 1;
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
}