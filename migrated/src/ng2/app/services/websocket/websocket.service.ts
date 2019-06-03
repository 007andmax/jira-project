import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { UsersService } from "../users/users.service";
import { CompaniesService } from "../company/companies.service";


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private serverUrl = '/realtime';
  private stompClient;

  constructor(
    private usersService: UsersService,
    private companiesService: CompaniesService
  ) {
  }

  initializeWebSocketConnection(){
    let ws =  new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function() {
      that.subsribeToPermissions();
      this.subsribeToQuote();
    });
  }

  subsribeToPermissions() {
    setTimeout(() => {
      this.stompClient.subscribe("/user/watch/permissions", (message) => {
        var newChange = JSON.parse(message.body);
        // commit console.log before prod update
        this.usersService.changeUserPermissions(newChange.data.permissions);
        if (message.body) {
          console.log('test')
        }
      });
    }, 3000);
  }

  subsribeToQuote() {
    setTimeout(() => {
      this.stompClient.subscribe(`/saleQuotes/${this.companiesService.getTechCompany()['id']}`, (message) => {
        var newChange = JSON.parse(message.body);
        // commit console.log before prod update
        console.log(newChange, 'newChange');
        if (message.body) {
          console.log('test')
        }
      });
    }, 3000);
  }

}
