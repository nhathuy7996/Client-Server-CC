import { sys } from 'cc'; 
import { METHOD, RequestBase } from '../network/RequestBase';
export class mRect {
    width: number;
    height: number;
    left: number;
    top: number;
    bottom: number;
    right: number

}
export const utils = {

 /**
 * Post data to server
 * @param endpoint API endpoint path
 * @param data Data to post
 * @returns Promise with server response
 */
   callAPI(endpoint: string, method: METHOD, data: any, callback: any) {
    let request = new RequestBase(endpoint, method);

    // Handle response
    request.Send(data, callback);
  }
 
}