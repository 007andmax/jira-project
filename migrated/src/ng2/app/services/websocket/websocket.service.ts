import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private serverUrl = '/realtime';
  private stompClient;

  constructor() {
  }

  initializeWebSocketConnection(){
    let ws =  new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    console.log(this.stompClient, '123------');
    this.stompClient.connect({}, function(that) {
      that.stompClient.debug("connected to Stomp");
      that.subsribeToPermissions();
    });
  }

  subsribeToPermissions() {
    setTimeout(() => {
      console.log('getCurrentUser');
      console.log(this.stompClient, 'this.stompClient1');
      this.stompClient.subscribe("/user/watch/permissions", (message) => {
        console.log('123512351235');
        console.log(this.stompClient, 'this.stompClient2');
        var newChange = JSON.parse(message.body);
        // commit console.log before prod update
        console.log(newChange);
        if (message.body) {
          console.log('test')
        }

      });
      console.log(this.stompClient, 'this.stompClient3');

    }, 5000);
  }

}
