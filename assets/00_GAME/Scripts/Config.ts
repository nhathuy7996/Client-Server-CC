import { _decorator, Size, SpriteFrame, View } from 'cc';
const { ccclass } = _decorator;

@ccclass('Config')
export class Config {


   static designResolutionSize: Size = View.instance.getDesignResolutionSize()

   static visibleSize: Size = View.instance.getVisibleSize()

   static heightScaling: number = Math.round(Config.visibleSize.height / Config.designResolutionSize.height * 100) / 100


   static host: string = 'http://localhost:3103';

   static level: number = 0
   static uName: string = ''
   static urlImg: string = ''
   static token: string = ''
   static avatar: SpriteFrame;

}