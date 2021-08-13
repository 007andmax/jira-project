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
import { Stomp } from '@stomp/stompjs';
import { environment } from 'src/environments/environment';
import * as SockJS from 'sockjs-client';
import { ConstantsService } from '../constants/constants.service';


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
    private constantsService: ConstantsService

  ) {
  }

  public initializeWebSocketConnection() {
    this.onInitConnect();
  }
  onInitConnect() {
    console.log("onInitConnect");
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    this.stompClient.logRawCommunication = true;
    this.onConnect();

    let that = this;
    this.stompClient.onConnect = (data) => {
      that.subsribeToPermissions();
      that.subsribeToUsers();
      that.subsribeToDevices();
      that.subsribeToCompany();
      that.subsribeToPasswordRecods();
      that.subsribeToTaxes();
      that.subsribeToCategories();
      that.subsribeToProducts();
      that.subsribeToTicketActualNumber();
      that.subsribeToTickets();
      that.subsribeToCmdShellOutput();
      that.subsribeToBillable();
      that.subsribeToInvoiceNumber();
      that.subsribeToBillableCount();
      that.subsribeToInvoice();
      that.subsribeToSubmittedTicket();
      that.subsribeToPayments();
      that.subsribeToSubmittedService();
      that.subsribeToSubmittedServiceAgreement();
      that.subsribeToSubmittedOneTimeConnection();
      that.subsribeToLockScreen();
      that.subsribeToTags();
      that.subsribeToDocuments();
      that.subsribeToDocumentsCategory();
    }
    this.stompClient.onUnhandledMessage = (data) => {
      console.log("onUnhandledMessage", data);
    }
    this.stompClient.onUnhandledReceipt = (data) => {
      console.log("onUnhandledReceipt", data);
    }
    this.stompClient.debug = (data) => {
      console.log("debug", data);
    }
    this.stompClient.onChangeState = (data) => {
      console.log("onChangeState", data);
    }
    this.stompClient.onDisconnect = (data) => {
      console.log(" onDisconnect", data);
    }
    this.stompClient.onStompError = (data) => {
      console.log("  onStompError", data);
    }
    this.stompClient.onWebSocketClose = (data) => {
      console.log("  onWebSocketClose", data);
      this.checkConnectWithBack();
      // this.connect();
    }
    this.stompClient.onWebSocketError = (data) => {
      console.log("  onWebSocketError", data);
    }
  }
  checkConnectWithBack() {
    console.log("checkConnectWithBack");
    this.constantsService.getConstants().subscribe(data => {
      console.log("data", data);
      this.onInitConnect();
    }, err => {
      console.log("err", err);
      setTimeout(() => {
        this.checkConnectWithBack();
      }, 10000);
    })
  }
  connect() {
    this.stompClient.connect({}, () => {

    });
    this.stompClient.activate();
  }
  onConnect() {
    this.connect();
    let checkOnline = setInterval(() => {
      if (!window.navigator.onLine) this.isResetWebSocket = true;
      if (this.isResetWebSocket && window.navigator.onLine) {
        this.isResetWebSocket = false;
        //  clearInterval(checkOnline);
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
