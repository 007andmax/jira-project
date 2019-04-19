import { Component, OnInit } from '@angular/core';
// @ts-ignore
import { UpgradeModule } from "@angular/upgrade/static";
import { setUpLocationSync } from '@angular/router/upgrade';

import { UsersService } from "./services/users/users.service";
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private serverUrl = '/realtime';
  private title = 'WebSockets chat';
  private stompClient;

  constructor(private upgrade: UpgradeModule,
              private userService: UsersService
              ){

  }

  ngOnInit() {
    this.upgrade.bootstrap(document.body, ['quicktech']);
    setUpLocationSync(this.upgrade);
    this.userService.getCurrentUser();
    console.log('test');
    this.initializeWebSocketConnection();
  }

  initializeWebSocketConnection(){
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    console.log(this.stompClient, '123------');
    this.stompClient.connect({}, function(frame) {
      console.log(this.stompClient, '1351235123513252135123------');
    });
  }


}
