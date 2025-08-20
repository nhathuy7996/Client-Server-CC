import { _decorator} from 'cc';
import { Config } from '../Config';
const { ccclass, property } = _decorator;

@ccclass('RequestBase')
export class RequestBase {

    _url: string;
    _method: METHOD = METHOD.GET;
    _xhr: XMLHttpRequest;

    constructor(url: string, method: METHOD = METHOD.GET) {
        this._url = `${Config.host}${url}`;
        this._method = method;

        this._xhr = new XMLHttpRequest();
        this._xhr.open(method, url, true);
        this._xhr.setRequestHeader('Content-Type', 'application/json');
        this._xhr.setRequestHeader('Access-Control-Allow-Origin','*');
        this._xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
        this._xhr.setRequestHeader('Access-Control-Allow-Headers', "Content-Type, Authorization, X-Requested-With");
        if(Config.token) this._xhr.setRequestHeader('Authorization', `Bearer ${Config.token}`);
    }

    SetHeader(key: string, value: string){
        this._xhr.setRequestHeader(key, value);
    }

    Send(data: any, callback: any) {

        this._xhr.onreadystatechange = () => {
            if (this._xhr.readyState === 4) {

                if (this._xhr.status >= 200 && this._xhr.status < 300) {
                    
                } else {
                    console.error('Error calling API:', this._xhr.status, this._xhr.statusText);
                    return;
                }

                let response = {
                    status: this._xhr.status,
                    resJSON: JSON.parse(this._xhr.responseText)
                }
                console.log('API response:', response); 
                callback(response);
                
            }
        };
        
        this._xhr.send(JSON.stringify(data));
    }
}

export enum METHOD{
    GET = 'GET',
    POST = 'POST'
}

