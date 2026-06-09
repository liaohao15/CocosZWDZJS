import ResMgr from "./ResMgr";
import Sound from "./Sound";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    start () {
        //加载资源
        ResMgr.Instance.LoadRes(() => {
            //加载音频资源
            Sound.Instance.loadSound(()=>{
                //设置音效
                Sound.Instance.setMusicVolume(1);
                Sound.Instance.setEffectVolume(1);
                //进行音效 播放
                  Sound.Instance.playEffect("logo");
            });
        });
    
        

        setTimeout(() => {
            console.log("切换场景，logotomenu");
            cc.director.loadScene('MenuScene');
        }, 5.0 * 1000);

    }

}
