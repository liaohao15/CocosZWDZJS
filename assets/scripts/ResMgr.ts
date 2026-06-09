const {ccclass, property} = cc._decorator;

@ccclass
export default class ResMgr{
   /**
     * 单例
     */
   private static _instance: ResMgr = null;
   public static get Instance(): ResMgr {
       if (!this._instance) {
           this._instance = new ResMgr();
       }
       return this._instance;
   }      
   prefabs_res = {};//字典 容器 key  value
   public getPrefab(name): cc.Prefab
   {
       return this.prefabs_res[name];
   }
   LoadRes (fun = null) 
   {
       cc.resources.loadDir("prefabs",cc.Prefab,(error,assets)=>{
           //加载资源完成了
           for(let p of assets)
           {
               //保存到缓存里面
               this.prefabs_res[p.name] = p;
           }
           if(fun !=null)
            fun();
       });
   }
}