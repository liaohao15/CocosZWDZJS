import Sound from "./Sound";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameScene extends cc.Component {
   
    //单例模式，只有一个GameScene实例
    public static instance: GameScene = null;
    protected onLoad () :void
    {
        GameScene.instance = this;
    }

    start () 
    {
        //进行背景音乐播放
        Sound.Instance.playMusic("bgm2");
    }
}
