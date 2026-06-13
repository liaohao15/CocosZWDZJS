import Sound from "../../Sound";

const {ccclass, property} = cc._decorator;

@ccclass
export default class sunLight extends cc.Component {

    start () 
    {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.scheduleOnce(this.onTouchStart,3);
     }

    onTouchStart()
    {
        console.log("点击了阳光");
        Sound.Instance.playEffect("points");
        let move  = cc.moveTo(0.8,cc.v2(-358,267));
        let scale = cc.scaleTo(0.8,0.2,0.2);
        let fade = cc.fadeOut(1.2);
        let action  = cc.spawn(move,scale,fade);
        let clear = cc.callFunc(this.clearSelf,this);
        let sumAct = cc.sequence(action,clear);
        this.node.runAction(sumAct,)
    }

    clearSelf()
    {
        this.node.removeFromParent();
    }
    // update (dt) {}
}
