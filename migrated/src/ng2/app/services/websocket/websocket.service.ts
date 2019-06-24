import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { UsersService } from "../users/users.service";
import { CompaniesService } from "../company/companies.service";
import { QuoteRealTimeService } from "../../components/billing/quotes/quote-realtime/quote-realtime.service";


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private serverUrl = '/realtime';
  private stompClient;

  constructor(
    private usersService: UsersService,
    private companiesService: CompaniesService,
    private quoteRealTimeService: QuoteRealTimeService
  ) {
  }

  initializeWebSocketConnection(){
    let ws =  new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function() {
      that.subsribeToPermissions();
      that.subsribeToQuote();
    });
  }

  subsribeToPermissions() {
    setTimeout(() => {
      this.stompClient.subscribe("/user/watch/permissions", (message) => {
        var newChange = JSON.parse(message.body);
        this.usersService.changeUserPermissions(newChange.data.permissions);
        if (message.body) {}
      });
    }, 3000);
  }

  subsribeToQuote() {
    setTimeout(() => {
      this.companiesService.getTechCompany().subscribe((res) => {
        this.stompClient.subscribe(`/user/watch/saleQuotes/${res['id']}`, (message) => {
          var newChange = JSON.parse(message.body);
          this.quoteRealTimeService.handleRealTimeChanges(newChange);
          if (message.body) {
            console.log('test')
          }
        });
      });
    }, 3000);
  }

}
