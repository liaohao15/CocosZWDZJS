import ResMgr from "../ResMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Zombie extends cc.Component {
    speed: number = 16;
    isMove: boolean = true;

    protected start(): void {

    }
    update(dt: any) {
        if (this.isMove) {
            this.node.position = cc.v3(
                this.node.position.x - dt * this.speed,
                this.node.position.y);

            if (this.node.position.x < -300) {
                this.isMove = false;
                this.node.runAction(cc.scaleTo(4, 4));
                console.log("游戏结束");
            }
        }
    }

    // update (dt) {}
}
