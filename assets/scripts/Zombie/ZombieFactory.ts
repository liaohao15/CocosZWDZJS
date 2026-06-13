import ResMgr from "../ResMgr";
import Sound from "../Sound";
import Zombie from "./Zombie";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ZombieFactory extends cc.Component {
    public static killZombieNum:number = 0;
    private static zombienum : number = 9;

    private spawnPosList : cc.Vec2[] = [
       cc.v2(450, 180),   // 第0行
        cc.v2(450, 82),    // 第1行
        cc.v2(450, -21),   // 第2行
        cc.v2(450, -112),  // 第3行
        cc.v2(450, -212)   // 第4行
    ]

    protected start(): void {
        this.schedule(this.createZombie,3,ZombieFactory.zombienum,5);
    }
    
    createZombie()
    {
        Sound.Instance.playEffect("groan");
        let zombie = cc.instantiate(ResMgr.Instance.getPrefab("Zombie"));
        zombie.parent = this.node;
       
        // 1. 生成 0~4 的随机整数，对应数组的5个下标
        const randomIndex = Math.floor(Math.random() * this.spawnPosList.length);
        // 2. 从数组里取出随机选中的坐标点（包含x和y）
        const randomPos = this.spawnPosList[randomIndex];
        // 3. 把僵尸位置设置为这个随机坐标
        zombie.position = cc.v3(randomPos.x, randomPos.y);
    }

    // update (dt) {}
}
