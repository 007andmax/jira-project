import { Injectable } from '@angular/core';

import { UsersService } from "../users/users.service";
import { CompaniesService } from "../company/companies.service";
import { QuoteRealTimeService } from "../../components/billing/quotes/quote-realtime/quote-realtime.service";
import { RecurringTicketsRealTimeService } from '../../components/tickets/recurring-tickets/services/recurring-tickets-real-time.service';
import { PasswordManagerService } from '../password-manager/password-manager.service';
import { UsersStateService } from '../../states/users/users-state.service';
import { CompaniesRealTimeService } from '../../states/company/companies-real-time.service';
import { DevicesRealTimeService } from '../../states/devices/devices-real-time.service';
import { UsersRealTimeService } from '../../states/users/users-real-time.service';
import { TaxesRealTimeService } from '../../states/taxes/taxes-real-time.service';
import { GlNumberRealTimeService } from '../../states/gl-number/gl-number-real-time.service';
import { InventoryRealTimeService } from '../../states/inventory/inventory-real-time.service';
import { TicketsRealTimeService } from '../../states/tickets/tickets-real-time.service';
import { BillableRealTimeService } from '../../states/billable/billable-real-time.service';
import { InvoiceRealTimeService } from '../../states/invoice/invoice-real-time.service';
import { PaymentsRealTimeService } from '../../states/payments/payments-real-time.service';
import { DefaultServicesRealTimeService } from '../../states/default-services/default-services-real-time.service';
import { ContractsRealTimeService } from '../../states/contracts/contracts-real-time.service';

import { ShellRealTimeService } from '../../states/shell/shell-real-time.service';
import { AppService } from '../../states/app/app.service';
import { PasswordManagerStateService } from '../../states/password-manager/password-manager-state.service';
import { TagsRealTimeService } from 'src/app/states/tags/tags-real-time.service';
import { DocumentsRealTimeService } from 'src/app/states/documents/documents-real-time.service';
import { RxStompService } from '@stomp/ng2-stompjs';
import { Stomp } from '@stomp/stompjs';
import { environment } from 'src/environments/environment';
import * as SockJS from 'sockjs-client';


/**
 * Websocket service to work with api
 */
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private serverUrl = 'realtime';
  private stompClient;
  private netScanSub;
  isResetWebSocket: boolean = false;
  /**
   * Users api service constructor
   * @param {UsersService} usersService Service to work users
   * @param {CompaniesService} companiesService Service to work with companies
   * @param {QuoteRealTimeService} quoteRealTimeService Service to work with real time
   */
  constructor(
    private appService: AppService,
    private usersService: UsersService,
    private devicesRealTimeService: DevicesRealTimeService,
    private companiesService: CompaniesService,
    private quoteRealTimeService: QuoteRealTimeService,
    private recurringTicketsRealTimeService: RecurringTicketsRealTimeService,
    private usersState: UsersStateService,
    private companiesRealTimeService: CompaniesRealTimeService,
    private usersRealTimeService: UsersRealTimeService,
    private passwordManagerStateService: PasswordManagerStateService,
    private taxesRealTimeService: TaxesRealTimeService,
    private glNumberRealTimeService: GlNumberRealTimeService,
    private inventoryRealTimeService: InventoryRealTimeService,
    private ticketsRealTimeService: TicketsRealTimeService,
    private paymentsRealTimeService: PaymentsRealTimeService,
    private billableRealTimeService: BillableRealTimeService,
    private invoiceRealTimeService: InvoiceRealTimeService,
    private defaultServicesRealTimeService: DefaultServicesRealTimeService,
    private contractsRealTimeService: ContractsRealTimeService,
    private shellRealTimeService: ShellRealTimeService,
    private tagsRealTimeService: TagsRealTimeService,
    private documentsRealTimeService: DocumentsRealTimeService,

  ) {
  }

  public initializeWebSocketConnection() {

    /* this.stompClient = Stomp.client(environment.apiUrl + this.serverUrl);
     console.log("client", this.stompClient);
     this.stompClient.debug = (data) => {
       console.log(new Date(), data);
     }
     this.onConnect();*/
    //  this.rxStompService.activate();

    this.onInitConnect();
  }
  onInitConnect() {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    this.onConnect();
    this.stompClient.debug = (data) => {
      console.log("debug", new Date(), data);
    }
    this.stompClient.onConnect = (data) => {
      console.log("onConnect", new Date(), data);

    }
    this.stompClient.onDisconnect = (data) => {
      console.log("onDisconnect", new Date(), data);
      this.subsribeToPermissions();
      this.subsribeToUsers();
      this.subsribeToDevices();
      this.subsribeToCompany();
      this.subsribeToPasswordRecods();
      this.subsribeToTaxes();
      this.subsribeToCategories();
      this.subsribeToProducts();
      this.subsribeToTicketActualNumber();
      this.subsribeToTickets();
      this.subsribeToCmdShellOutput();
      this.subsribeToBillable();
      this.subsribeToInvoiceNumber();
      this.subsribeToBillableCount();
      this.subsribeToInvoice();
      this.subsribeToSubmittedTicket();
      this.subsribeToPayments();
      this.subsribeToSubmittedService();
      this.subsribeToSubmittedServiceAgreement();
      this.subsribeToSubmittedOneTimeConnection();
      this.subsribeToLockScreen();
      this.subsribeToTags();
      this.subsribeToDocuments();
      this.subsribeToDocumentsCategory();
    }
    this.stompClient.onStompError = (data) => {
      console.log("onStompError", new Date(), data);
    }

    this.stompClient.onWebSocketError = (data) => {
      console.log("onWebSocketError", new Date(), data);
    }

    this.stompClient.onWebSocketClose = (data) => {
      console.log("onWebSocketClose", new Date(), data);
    }


  }
  connect() {
    let that = this;
    this.stompClient.connect({}, () => {
      console.log("connect");
    });
    console.log("this.stompClient", this.stompClient);
  }
  onConnect() {
    this.connect();


    let checkOnline = setInterval(() => {
      console.log("window.navigator.onLine", window.navigator.onLine);
      if (!window.navigator.onLine) this.isResetWebSocket = true;
      if (this.isResetWebSocket && window.navigator.onLine) {
        this.isResetWebSocket = false;
        clearInterval(checkOnline);
        this.connect();
      }
    }, 1000);
  }

  private subsribeToDevices() {
    setTimeout(() => {
      this.stompClient.subscribe(`/user/watch/device`, (message) => {
        var newChange = JSON.parse(message.body);
        this.devicesRealTimeService.handleRealTimeChanges(newChange);
        if (message.body) {

        }
      });
    }, 3000);
  }
  private subsribeToUsers() {

    setTimeout(() => {
      this.stompClient.subscribe("/user/watch/user", (message) => {
        var newChange = JSON.parse(message.body);
        this.usersRealTimeService.handleRealTimeChanges(newChange);
        if (message.body) {
        }
      });
    }, 3000);
  }
  /**
   * subscribe to quote permissions realtime
   */
  public subsribeToPermissions() {
    setTimeout(() => {
      this.stompClient.subscribe("/user/watch/permissions", (message) => {
        var newChange = JSON.parse(message.body);
        this.usersRealTimeService.handleRealTimePermissions(newChange);//permissions
        if (message.body) { }
      });
    }, 3000);
  }

  /**
   * subscribe to quote realtime
   */
  public subsribeToQuote(id) {
    setTimeout(() => {
      this.stompClient.subscribe(`/user/watch/saleQuotes/${id}`, (message) => {
        var newChange = JSON.parse(message.body);
        this.quoteRealTimeService.handleRealTimeChanges(newChange);
        if (message.body) {

        }
      });
    }, 3000);
  }

  /**
   * subscribe to company realtime
   */
  public subsribeToCompany() {
    setTimeout(() => {
      this.stompClient.subscribe(`/user/watch/company`, (message) => {
        var newChange = JSON.parse(message.body);
        this.companiesRealTimeService.handleRealTimeChanges(newChange);
        if (message.body) {
        }

      });
    }, 3000);
  }

  /**
  * subscribe to recurring tickets realtime
  */
  public subsribeToRecurringTickets(id) {

    setTimeout(() => {
      this.stompClient.subscribe(`/user/watch/recurringTickets/${id}`, (message) => {
        var newChange = JSON.parse(message.body);
        this.recurringTicketsRealTimeService.handleRealTimeChanges(newChange);
        if (message.body) {

        }
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
        this.passwordManagerStateService.handleRealTimeChanges(newChange);

      });

    }, 3000);
  }

  /**
 * subscribe to taxes realtime
 */
  public subsribeToTaxes() {

    setTimeout(() => {

      this.stompClient.subscribe(`/user/watch/taxes`, (message) => {
        var newChange = JSON.parse(message.body);
        this.taxesRealTimeService.handleRealTimeChanges(newChange);

      });

    }, 3000);
  }

  /**
* subscribe to categories realtime
*/
  public subsribeToCategories() {

    setTimeout(() => {

      this.stompClient.subscribe(`/user/watch/productCategory`, (message) => {
        var newChange = JSON.parse(message.body);
        this.inventoryRealTimeService.handleRealTimeChangesCategories(newChange);

      });

    }, 3000);
  }

  /**
* subscribe to categories realtime
*/
  public subsribeToProducts() {

    setTimeout(() => {

      this.stompClient.subscribe(`/user/watch/product`, (message) => {
        var newChange = JSON.parse(message.body);
        this.inventoryRealTimeService.handleRealTimeChangesProducts(newChange);

      });

    }, 3000);
  }

  /**
* subscribe to gl number realtime
*/
  public subsribeToGlNumber(id) {

    setTimeout(() => {

      this.stompClient.subscribe(`/user/watch/glNumber/${id}`, (message) => {
        var newChange = JSON.parse(message.body);
        this.glNumberRealTimeService.handleRealTimeChanges(newChange);

      });

    }, 3000);
  }

  public subsribeToTicket(id) {

    this.ticketsRealTimeService.ticketSubscription = this.stompClient.subscribe(`/user/watch/ticketUpdates/${id}`, (message) => {
      var newChange = JSON.parse(message.body);
      this.ticketsRealTimeService.handleRealTimeChangesTicket(newChange);

    });


  }

  public subsribeToTicketActualNumber() {

    setTimeout(() => {

      this.stompClient.subscribe(`/user/watch/number/TICKET`, (message) => {
        var newChange = JSON.parse(message.body);
        this.ticketsRealTimeService.handleRealTimeChangesActualNumber(newChange);

      });

    }, 3000);
  }
  public subsribeToTickets() {

    setTimeout(() => {

      this.stompClient.subscribe(`/user/watch/tickets`, (message) => {
        var newChange = JSON.parse(message.body);
        this.ticketsRealTimeService.handleRealTimeChangesTickets(newChange);

      });

    }, 3000);
  }

  public subsribeToBillable() {

    setTimeout(() => {

      this.stompClient.subscribe(`/user/watch/billablePage`, (message) => {
        var newChange = JSON.parse(message.body);
        this.billableRealTimeService.handleRealTimeChangesBillable(newChange);

      });

    }, 3000);
  }

  public subsribeToCmdShellOutput() {
    setTimeout(() => {
      this.stompClient.subscribe(`/user/watch/cmdShellOutput`, (message) => {
        var newChange = JSON.parse(message.body);
        this.shellRealTimeService.handleRealTimeChanges(newChange);
      });

    }, 3000);
  }
  public subsribeToInvoiceNumber() {
    setTimeout(() => {
      this.stompClient.subscribe(`/user/watch/number/INVOICE`, (message) => {
        var newChange = JSON.parse(message.body);
        this.invoiceRealTimeService.handleRealTimeChangesNumber(newChange);
      });

    }, 3000);
  }
  public subsribeToBillableCount() {
    setTimeout(() => {
      this.stompClient.subscribe(`/user/watch/leftPanelCounts`, (message) => {
        var newChange = JSON.parse(message.body);
        this.billableRealTimeService.handleRealTimeChangesBillableCount(newChange);
      });

    }, 3000);
  }
  public subsribeToInvoice() {
    setTimeout(() => {
      this.stompClient.subscribe(`/user/watch/receivableInvoice`, (message) => {
        var newChange = JSON.parse(message.body);
        this.invoiceRealTimeService.handleRealTimeChangesInvoice(newChange);
      });

    }, 3000);
  }
  public subsribeToSubmittedTicket() {
    setTimeout(() => {
      this.stompClient.subscribe(`/user/watch/userSubmittedTicket`, (message) => {
        var newChange = JSON.parse(message.body);
        this.usersRealTimeService.handleRealTimeSubmittedTicket(newChange);
      });

    }, 3000);
  }
  public subsribeToPayments() {
    setTimeout(() => {
      this.stompClient.subscribe(`/user/watch/payments`, (message) => {
        var newChange = JSON.parse(message.body);
        this.paymentsRealTimeService.handleRealTimeChanges(newChange);
      });
    });
  }

  public subsribeToSubmittedService() {
    setTimeout(() => {
      this.stompClient.subscribe(`/user/watch/service`, (message) => {
        var newChange = JSON.parse(message.body);
        this.defaultServicesRealTimeService.handleRealTimeChanges(newChange);
      });

    }, 3000);
  }

  public subsribeToSubmittedServiceAgreement() {
    setTimeout(() => {
      this.stompClient.subscribe(`/user/watch/serviceAgreement`, (message) => {
        var newChange = JSON.parse(message.body);
        this.contractsRealTimeService.handleRealTimeChanges(newChange);
      });

    }, 3000);
  }
  public subsribeToSubmittedOneTimeConnection() {
    setTimeout(() => {
      this.stompClient.subscribe(`/user/watch/oneTimeConnection`, (message) => {
        var newChange = JSON.parse(message.body);
        this.devicesRealTimeService.handleRealTimeOneTimeConnection(newChange);
      });

    }, 3000);
  }

  public subsribeToNetScan(companyId) {
    setTimeout(() => {
      this.netScanSub = this.stompClient.subscribe(`/user/watch/netScan/${companyId}`, (message) => {
        var newChange = JSON.parse(message.body);
        this.devicesRealTimeService.handleRealTimeNetScan(newChange);
      });
    }, 3000);

  }
  public subsribeToLockScreen() {
    setTimeout(() => {
      this.netScanSub = this.stompClient.subscribe(`/user/watch/lockScreen/${this.getCookie('LOCK_SCREEN_ID')}`, (message) => {
        var newChange = JSON.parse(message.body);
        if (newChange.action === 'LOCK_SCREEN') this.appService.showLockScreen();
      });
    }, 3000);

  }

  public subsribeToDocumentsCategory() {

    setTimeout(() => {

      this.stompClient.subscribe(`/user/watch/documentCategory`, (message) => {
        var newChange = JSON.parse(message.body);
        this.documentsRealTimeService.handleRealTimeCategoriesChanges(newChange);

      });

    }, 3000);
  }

  public subsribeToDocuments() {

    setTimeout(() => {

      this.stompClient.subscribe(`/user/watch/document`, (message) => {
        var newChange = JSON.parse(message.body);
        this.documentsRealTimeService.handleRealTimeDocumentsChanges(newChange);

      });

    }, 3000);
  }

  public subsribeToTags() {

    setTimeout(() => {

      this.stompClient.subscribe(`/user/watch/tagManagement`, (message) => {
        var newChange = JSON.parse(message.body);
        this.tagsRealTimeService.handleRealTimeChanges(newChange);

      });

    }, 3000);
  }

  getCookie(name) {
    var matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  public unSubsribeNetScan() {
    if (this.netScanSub) this.netScanSub.unsubscribe();
  }
  public getClient() {
    return this.stompClient;
  }
}
