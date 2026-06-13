import GameScene from "../../GameScene";
import ResMgr from "../../ResMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    interval: number = 0.5;

    start() {
        this.schedule(this.shoot, this.interval);
    }

    shoot() 
    {
        let PeaBullet = cc.instantiate(ResMgr.Instance.getPrefab("PeaBullet"));
        PeaBullet.parent = GameScene.instance.node;
        PeaBullet.position = cc.v3(this.node.position.x + 32, this.node.position.y + 20);
    }
}
