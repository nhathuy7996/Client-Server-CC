import { _decorator, Canvas, Component, director, instantiate, Label, Node, path, Prefab, resources, url, Vec3 } from 'cc';
import io from 'socket.io-client/dist/socket.io.js';
import { Singleton } from '../utils/Singleton';
const { ccclass, property } = _decorator;
 
import { Socket } from 'socket.io-client';
import { Config } from '../Config'; 


@ccclass('NetworkingPeer')
export class NetworkingPeer extends Singleton {

  static socket: Socket;
   
  public static connectToWebSocket() {
    
    console.log(`Start connect to websocket`);
    this.socket = io(Config.host, {
      transports: ['websocket'],
      auth: {
        token: Config.token
      }
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');

    });
  }

  public static AddListener(EventMap: string, callback: any) {
    if (!this.socket) {
      console.log(`socket not connected, Delay 1s and try again! ❌`);
      setTimeout(() => {
        this.AddListener(EventMap, callback);
      }, 10);
      return;
    }
    this.socket.on(EventMap, callback);
  }

  public static RemoveListener(EventMap: string, callback: any) {
    this.socket.off(EventMap, callback);
  }

  public static EmmitEvent(EventMap: string, data: any = null) {
    if (!this.socket) {
      console.log(`socket not connected, you emmit event to soon! ❌`);
      return;
    }
    this.socket.emit(EventMap, data);
    

  }  
}
