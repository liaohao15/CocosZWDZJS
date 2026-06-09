import Sound from "./Sound";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    start () {
                  //进行背景音乐播放
                  Sound.Instance.playMusic("bgm0");
    }

    // update (dt) {}
}
