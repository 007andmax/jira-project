import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { UsersService } from "../users/users.service";
import { CompaniesService } from "../company/companies.service";
import { QuoteRealTimeService } from "../../components/billing/quotes/quote-realtime/quote-realtime.service";
import { RecurringTicketsRealTimeService } from '../../components/tickets/recurring-tickets/services/recurring-tickets-real-time.service';
import { PasswordManagerService } from '../password-manager/password-manager.service';

/**
 * Websocket service to work with api
 */
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private serverUrl = '/realtime';
  private stompClient;

  /**
   * Users api service constructor
   * @param {UsersService} usersService Service to work users
   * @param {CompaniesService} companiesService Service to work with companies
   * @param {QuoteRealTimeService} quoteRealTimeService Service to work with real time
   */
  constructor(
    private usersService: UsersService,
    private companiesService: CompaniesService,
    private quoteRealTimeService: QuoteRealTimeService,
    private recurringTicketsRealTimeService: RecurringTicketsRealTimeService,
    private passwordManagerService: PasswordManagerService,

    
  ) {
  }

  public initializeWebSocketConnection(){
    let ws =  new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function() {
      that.subsribeToPermissions();
      that.subsribeToQuote();
      that.subsribeToRecurringTickets();
      that.subsribeToPasswordRecods();
    });
  }

  /**
   * subscribe to quote permissions realtime
   */
  public subsribeToPermissions() {
    setTimeout(() => {
      this.stompClient.subscribe("/user/watch/permissions", (message) => {
        var newChange = JSON.parse(message.body);
        this.usersService.changeUserPermissions(newChange.data.permissions);
        if (message.body) {}
      });
    }, 3000);
  }

  /**
   * subscribe to quote realtime
   */
  public subsribeToQuote() {
    setTimeout(() => {
      this.companiesService.getTechCompany().subscribe((res) => {
        this.stompClient.subscribe(`/user/watch/saleQuotes/${res['id']}`, (message) => {
          var newChange = JSON.parse(message.body);
          this.quoteRealTimeService.handleRealTimeChanges(newChange);
          if (message.body) {
         
          }
        });
      });
    }, 3000);
  }

   /**
   * subscribe to recurring tickets realtime
   */
  public subsribeToRecurringTickets() {
   
    setTimeout(() => {
      this.companiesService.getTechCompany().subscribe((res) => {
        this.stompClient.subscribe(`/user/watch/recurringTickets/${res['id']}`, (message) => {
          var newChange = JSON.parse(message.body);
          this.recurringTicketsRealTimeService.handleRealTimeChanges(newChange);
          if (message.body) {
         
          }
        });
      });
    }, 3000);
  }

   /**
   * subscribe to recurring tickets realtime
   */
  public subsribeToPasswordRecods() {
   
    setTimeout(() => {
     
        this.stompClient.subscribe(`/user/watch/passwordRecords`, (message) => {
          var newChange = JSON.parse(message.body);
          this.passwordManagerService.handleRealTimeChanges(newChange);
        
        });
     
    }, 3000);
  }

}
