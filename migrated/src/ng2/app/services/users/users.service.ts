import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from '../../../environments/environment';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';


@Injectable({
  providedIn: 'root',
})
export class UsersService {

  private apiUrl = environment.apiUrl;
  public currentUser: any;
  private serverUrl = '/realtime';
  private title = 'WebSockets chat';
  private stompClient;

  constructor(
    private http: HttpClient
  ) {

  }
  getAllusers(){
    return this.http.get(this.apiUrl + 'users');
  }

  getCurrentUser(){
    return this.http.get(this.apiUrl + 'users/current').subscribe((res) => {
      this.currentUser = res;
      let ws = new SockJS(this.serverUrl);
      this.stompClient = Stomp.over(ws);
      setTimeout(() => {
        console.log('getCurrentUser');
          this.stompClient.subscribe("/user/watch/permissions/", (message) => {
            console.log('123512351235');
            if (message.body) {
              console.log('test')
            }
          });

      }, 3000);

    });
  }

}
