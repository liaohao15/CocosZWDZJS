import GameScene from "../../GameScene";
import ResMgr from "../../ResMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SunFlower extends cc.Component {
    timer1:number = 5;
    timer2:number = 2;

    start () 
    {
       this.playNormal();
    }

    playNormal()
    {
        this.node.getComponent(cc.Animation).play("SunFlowerNormalAnimation");
        this.scheduleOnce(this.playLight,this.timer1);
    }

    playLight()
    {
        this.node.getComponent(cc.Animation).play("SunFlowerLightAnimation");
        this.scheduleOnce(this.createSun,this.timer2);
    }

    createSun()
    {
        let sunLight = cc.instantiate(ResMgr.Instance.getPrefab("SunLight"));
        sunLight.parent = GameScene.instance.node;
        sunLight.position = cc.v3(this.node.position.x + 40,this.node.position.y + 40);
        this.playNormal();
    }

    // update (dt) {}
}
