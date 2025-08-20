import { _decorator, Component, Node, director, Widget, sys, Prefab, instantiate, Sprite, assetManager, Texture2D, SpriteFrame, UITransform, Label, ImageAsset } from 'cc';
import { Config } from '../Config';
import { METHOD, RequestBase } from '../network/RequestBase';
import { NetworkingPeer } from '../network/NetworkingPeer'; 
const { ccclass, property } = _decorator;

@ccclass('gameMain')
export class gameMain extends Component {

   
    /**
     * get user data from telegram generate token and get user data in game
     * if user is not exist, generate new user data in game
     * assign data user to local storage
     * connect to socket
     */
    GetUserTeleData():void {
        if (Config.token) {
            console.log(`Hello ${Config.uName}`);
            return;
        }  
        
        try {
            //Setting telegram web app
            window.Telegram.WebApp.ready();
            window.Telegram.WebApp.isVerticalSwipesEnabled = false;
            window.Telegram.WebApp.disableVerticalSwipes();
            window.Telegram.WebApp.expand();

            //Get init data from telegram web app
            const initData = window.Telegram.WebApp.initData;
            console.log(window.Telegram.WebApp.initDataUnsafe);
            Config.urlImg = `${Config.host}/proxy-image?url=${window.Telegram.WebApp.initDataUnsafe.user.photo_url}`;
           
            //Send init data to server to generate token and get user data in game 
            let response = new RequestBase(`/api/auth/telegram`, METHOD.POST);
            response.Send({
                initData: Config.host.startsWith('https://nhathuy7996') ? initData :
                    `user=%7B%22id%22%3A1036430681%2C%22first_name%22%3A%22Nh%E1%BA%ADt%20Huy%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22gamedevtoi%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2Fzs6lMJZWyS_NpA1AyVfkFZ5TAXZNlBOrV8VjuVbvsaA.svg%22%7D&chat_instance=3861454897216290496&chat_type=sender&auth_date=1742999357&signature=TZNz2Jr0EbTrY3Mk6ctjwBEMeV6zRzmDBEZta0Qx8BZjHmNJkKbo3W2CPuR4h-HNuDVbame0AtziBhaxVdzICw&hash=99b8cb4bcda36c27f8367b2bd5bcdeb16e0e5689c45346efca251217cb2c84f5`
            }, (res) => {
                console.log(res);

                Config.uName = window.Telegram.WebApp.initDataUnsafe.user.username;
                // Config.userId = res.resJSON.data.user.userId;
                // Config.coin = res.resJSON.data.user.coin;
                // Config.level = res.resJSON.data.user.level;

                //Assign token to config
                Config.token = res.resJSON.data.token;

                //Start connect to socket
                NetworkingPeer.connectToWebSocket();
         
            });
        } catch (e) {
            //Connect with fake token
            console.log(`Connect with fake token`)
            Config.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAzNjQzMDY4MSwidXNlcm5hbWUiOiJnYW1lZGV2dG9pIiwiZmlyc3RfbmFtZSI6Ik5o4bqtdCBIdXkiLCJsYXN0X25hbWUiOiIiLCJpYXQiOjE3NDMwMDU5MDMsImV4cCI6MTc0MzYxMDcwM30.S7tA0pFjVaCUHQM7Nf5fJwjTWzE2kmh82CD-oupD728';
            NetworkingPeer.connectToWebSocket();

            //Load avatar
            this.loadAvatar(`${Config.host}/proxy-image?url=https://t.me/i/userpic/320/zs6lMJZWyS_NpA1AyVfkFZ5TAXZNlBOrV8VjuVbvsaA.svg`);
        }

    }
 
    async start() {
        this.GetUserTeleData();
    }

    /*
    * Load avatar from url
    * use can load avatar throught proxy cause some platform not allow get image from url directly
    * example: https://nhathuy7996.art:3003/proxy-image?url=https://t.me/i/userpic/320/zs6lMJZWyS_NpA1AyVfkFZ5TAXZNlBOrV8VjuVbvsaA.svg
    * @param imageUrl: string
    */
    async loadAvatar(imageUrl: string) {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            assetManager.loadRemote<ImageAsset>(blobUrl, { ext: '.png' }, (err, imageAsset) => {
                if (err || !imageAsset || imageAsset.width === 0) {
                    console.error("❌ Ảnh tải về nhưng không hợp lệ!", err);
                    return;
                }

                console.log("📸 Ảnh đã tải:", imageAsset.width, imageAsset.height);

                const texture = new Texture2D();
                texture.image = imageAsset;

                Config.avatar = new SpriteFrame();
                Config.avatar.texture = texture;

                //this.avatarImage.spriteFrame = Config.avatar;
            });
        } catch (error) {
            console.error("❌ Lỗi tải ảnh:", error);
        }
    }
 
}

