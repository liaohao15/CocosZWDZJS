import Sound from "./Sound";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MenuScene extends cc.Component {
    //节点声明
    mxmsBtn: null | cc.Node = null;

    start () {
                  //进行背景音乐播放
                  Sound.Instance.playMusic("bgm1");

                //   //计时器：提供董事会调用服务  --回调函数
                  
                //   this.schedule(()=>{
                //     console.log("自定义的计时器的回调函数被执行");
                //   },1,9,2); 

                //   this.scheduleOnce(()=>{
                //     console.log("单次计时器的回调函数被执行");
                //   },6);    
                  
        //          setTimeout(() => {
        //     console.log("切换场景");
        //     cc.director.loadScene('GameScene');
        // }, 10.0 * 1000);

                    if(this.mxmsBtn == null)
                        {
                            this.mxmsBtn = this.node.getChildByName("mxms");
                            this.mxmsBtn.on("click",this.mxmsCall,this);
                        }       
                }

                mxmsCall(event: any) 
                {
                    console.log("点击了mxms按钮");
                    cc.director.loadScene('GameScene');
                }

                mnms(event: any,str: string) 
                {
                    if (str == "mnms") 
                    {
                    cc.director.loadScene('GameScene');
                    }
                }

                bangzhu(event: any,str: string) 
                {
                    if (str == "bangzhu") 
                    {
                        let isAct = this.node.getChildByName("bangzhuUI").active;
                        this.node.getChildByName("bangzhuUI").active = !isAct;
                    }
                }
}
