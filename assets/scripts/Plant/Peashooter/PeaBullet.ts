const {ccclass, property} = cc._decorator
@ccclass
export default class NewClass extends cc.Component {
    speed:number = 200;

    start () {
    }

    update (dt: number) {
        this.node.position = cc.v3(
            this.node.position.x +dt *this.speed,
            this.node.position.y
        );
        if(this.node.position.x>400)
        {
            this.node.removeFromParent();
        }
    }
}
