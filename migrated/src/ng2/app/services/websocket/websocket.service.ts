import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { UsersService } from "../users/users.service";
import { CompaniesService } from "../company/companies.service";
import { QuoteRealTimeService } from "../../components/billing/quotes/quote-realtime/quote-realtime.service";
import { RecurringTicketsRealTimeService } from '../../components/tickets/recurring-tickets/services/recurring-tickets-real-time.service';
import { PasswordManagerService } from '../password-manager/password-manager.service';
import { UsersStateService } from '../../states/users/users-state.service';
import { CompaniesRealTimeService } from '../../states/company/companies-real-time.service';
import { DevicesRealTimeService } from '../../states/devices/devices-real-time.service';

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
    private devicesRealTimeService: DevicesRealTimeService,
    private companiesService: CompaniesService,
    private quoteRealTimeService: QuoteRealTimeService,
    private recurringTicketsRealTimeService: RecurringTicketsRealTimeService,
    private usersState:UsersStateService,
    private companiesRealTimeService:CompaniesRealTimeService,
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
      that.subsribeToUsers();
      that.subsribeToDevices();
      that.subsribeToCompany();
      that.subsribeToPasswordRecods();
    });
  }
private subsribeToDevices () {
  setTimeout(() => {
      this.stompClient.subscribe(`/user/watch/device`, (message) => {
        var newChange = JSON.parse(message.body);
        this.devicesRealTimeService.handleRealTimeChanges(newChange);
        if (message.body) {
       
        }
      });
  }, 3000);
}
  private subsribeToUsers () {
    console.log('subsribeToUsers');
   /* setTimeout(() => {
      this.stompClient.subscribe("/user/watch/user", (message) => {
        var newChange = JSON.parse(message.body);
        console.log('newChange',newChange);
      //  this.usersState.changeUserPermissions(newChange.data.permissions);
      //  if (message.body) {}
      if (newChange.action === 'USER_SAVED') {

        var currentUser = getCurrentUser();
        if (currentUser.id === newChange.data.id) {
          var permissions = currentUser.permissions;
          Utils.customizeObj(newChange.data, currentUser);
          currentUser.permissions = permissions;
          return;
        }

        if (newChange.data.company.id !== currentUser.company.id) {
          addOrUpdateClientUser(newChange.data);
        } else {
          var techUser = Utils.findById(storage.usersByCompanies[newChange.data.company.id], newChange.data.id);

          if (techUser) {
            Utils.customizeObj(newChange.data, techUser);
          } else {
            storage.usersByCompanies[newChange.data.company.id] = storage.usersByCompanies[newChange.data.company.id] || [];
            storage.usersByCompanies[newChange.data.company.id].push(Utils.customizeObj(newChange.data));
            Utils.deleteById(storage.deleted, newChange.data.id);
            storage.users.push(Utils.customizeObj(newChange.data));
          }
        }
      } else if (newChange.action === 'USER_ARCHIVED') {
        var user = Utils.findById(storage.deleted, newChange.data.id);
        if (user) {
          Utils.customizeObj(newChange.data, user);
        } else {
          user = Utils.findById(storage.users, newChange.data.id);
          if (user) {
            Utils.customizeObj(newChange.data, user);
          }
          storage.deleted.push(newChange.data);
        }
        Utils.deleteById(storage.users, newChange.data.id);
        Utils.deleteById(storage.clientUsers, newChange.data.id);
        // if (storage.usersByCompanies[newChange.data.company.id]) {
        //   Utils.deleteById(storage.usersByCompanies[newChange.data.company.id], newChange.data.id);
        // }
      } else if (newChange.action === 'USER_ONLINE') {
        var user = Utils.findById(storage.users, newChange.data.id);
        if (user) {
          Utils.defineReadOnlyProperty(user, 'online', !!newChange.data.online);
        }
      } else if (newChange.action === 'COMPANY_ARCHIVED') {
        for (var i = 0; i < storage.users.length; i++) {
          var user = storage.users[i];
          if (user.company.id === newChange.data.id) {
            var archivedUser = Utils.findById(storage.deleted, user.id);
            if (!archivedUser) {
              user.deletedAt = Date.now();
              storage.deleted.push(user);
            }
            storage.users.splice(i, 1);
            storage.clientUsers.splice(storage.clientUsers.indexOf(user), 1);
            i--;
          }
        }
        // delete storage.usersByCompanies[newChange.data.id];
      } else if (newChange.action === 'USERS_DEARCHIVED') {
        newChange.data.forEach(addOrUpdateClientUser);
      }
      });
    }, 3000);*/
  }
  /**
   * subscribe to quote permissions realtime
   */
  public subsribeToPermissions() {
    setTimeout(() => {
      this.stompClient.subscribe("/user/watch/permissions", (message) => {
        var newChange = JSON.parse(message.body);
        this.usersState.changeUserPermissions(newChange.data.permissions);
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
   * subscribe to company realtime
   */
  public subsribeToCompany() {
    setTimeout(() => {
     console.log('subsribeToCompany');
        this.stompClient.subscribe(`/user/watch/company`, (message) => {
          var newChange = JSON.parse(message.body);
          this.companiesRealTimeService.handleRealTimeChanges(newChange);
          if (message.body) {
            console.log('test')
          }
       
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
