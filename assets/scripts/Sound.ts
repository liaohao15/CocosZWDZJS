enum recordKey{
    musicKey = "MySusicVol1",
    soundKey = "MySoundVol1"
}

export default class Sound  {
	/**
     * 单例
     */
    private static _instance: Sound = null;
    public static get Instance(): Sound {
        if (!this._instance) {
            this._instance = new Sound();
        }
        return this._instance;
    }

    sounds:cc.AudioClip[] = [];

    //分开的音量控制大小
    //背景音乐
    private musicVolume:number = 1;
    //音效
    private effectVolume:number = 1;
    
    constructor(){
    	this.initAudioEngine();
    }

    loadSound(cb = null){
        let progress = (completedCount,totalCount,item)=>{
             //console.log("加载音频:",completedCount,totalCount,item);
        };
        let onload = (err, assets)=>{
            // console.log('Table.loadSound',assets);
            for (var i = 0; i < assets.length; i++) {
                let asset = assets[i];
                this.sounds[asset._name] = asset;
            }
            if(cb!=null)
                cb();
        };
        cc.loader.loadResDir("Audio",cc.AudioClip,progress, onload);
    }
    getSound(name){
        return this.sounds[name];
    }

   

    /**
    * 播放背景音乐
    * @param {string||cc.AudioClip} file 播放的文件
    * @param {boolean} loop== true 默认背景音乐循环播放
    */
    
    playMusic(file:string,loop = true){
    	// this.stopMusic();
    	if (!file) {return;}

        this.playMusic_Clip(this.getSound(file));
    }

    public playMusic_Clip(file:cc.AudioClip,loop = true){
        if (!file) {return;}
        //cc.audioEngine.stopMusic();
        // if(cc.audioEngine.isMusicPlaying()){
        //     console.log("======正在播放中======");
        // }
        cc.audioEngine.playMusic(file, loop);
        //播放新的音乐的时候,同时设置音量大小
        cc.audioEngine.setMusicVolume(this.musicVolume);
    }

    /**停止当前的背景音乐*/
    stopMusic(){
    	cc.audioEngine.stopMusic();
    }

    /**暂停当前的背景音乐*/
    pauseMusic(){
        cc.audioEngine.pauseMusic();
    }

    /**恢复当前的背景音乐*/
    resumeMusic(){
        cc.audioEngine.resumeMusic();
    }

    /**
    * 播放音效
    * @param {string||cc.AudioClip} file 播放的文件
    */
    playEffect(file:string,loop = false){
    	this.playEffect_Clip(this.getSound(file));
    }

    public playEffect_Clip(file:cc.AudioClip,loop = false){
        if (!file) {return;}
        let id = cc.audioEngine.playEffect(file, loop);
        //console.log("音效ID:",id);
        //能播放音效的时候,设置音量大小
        cc.audioEngine.setVolume(id,this.effectVolume);
    }


    /**设置背景音乐音量*/
    setMusicVolume(volume){
        //给设置对话框调用的函数
        //先给当前程序使用的成员变量赋值更新
        this.musicVolume = volume;
        //保存到本地数据仓库
        cc.sys.localStorage.setItem(recordKey.musicKey, volume);
        //将当前的音量调整为最新的音量值
        cc.audioEngine.setMusicVolume(this.musicVolume);
    }

     /**设置音效的音量*/
    setEffectVolume(volume){
        //给设置对话框调用的函数
         //先给当前程序使用的成员变量赋值更新
        this.effectVolume = volume;
         //保存到本地数据仓库
        cc.sys.localStorage.setItem(recordKey.soundKey, volume);
    }

    /**获取背景音乐音量大小 */
    getMusicVolume():number
    {
        //从本地仓库里面获取到音量数据,获取到的是一个字符串
        let str = cc.sys.localStorage.getItem(recordKey.musicKey);
        this.musicVolume = 1;
        if(str != null)
        {
            //假如该字符串不为空,则说明不是第一次启动程序,
            //则将从本地仓库里面获取到的音量数据,并转换为数字类型 0~1之间的浮点数
            this.musicVolume = parseFloat(str);//数据转换
        }
        return this.musicVolume;
    }
     /**获取音效音量大小 */
    getEffectVolume():number
    {
        //从本地仓库里面获取到音量数据,获取到的是一个字符串
        let str = cc.sys.localStorage.getItem(recordKey.soundKey);
        this.effectVolume = 1;
        if(str != null)
        {
            //假如该字符串不为空,则说明不是第一次启动程序,
            //则将从本地仓库里面获取到的音量数据,并转换为数字类型 0~1之间的浮点数
            this.effectVolume = parseFloat(str);
        }
        return this.effectVolume;
    }
    /**
    设置音频播放完成回调
    */
    setFinishCallback(audioID,callback){
    	cc.audioEngine.setFinishCallback(audioID, callback);
    }

    /**初始化当前音乐管理器(引擎) */
    initAudioEngine()
    {
        this.getMusicVolume();
        this.getEffectVolume();
    }
}