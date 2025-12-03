import { EventEmitter, Injectable } from '@angular/core';

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
import { NonContractServicesRealTimeService } from '../../states/non-contract-services/non-contract-services-real-time.service';
import { ContractsRealTimeService } from '../../states/contracts/contracts-real-time.service';

import { ShellRealTimeService } from '../../states/shell/shell-real-time.service';
import { AppService } from '../../states/app/app.service';
import { PasswordManagerStateService } from '../../states/password-manager/password-manager-state.service';
import { TagsRealTimeService } from 'src/app/states/tags/tags-real-time.service';
import { DocumentsRealTimeService } from 'src/app/states/documents/documents-real-time.service';
import { KafkaRealTimeService } from 'src/app/states/kafka/kafka-real-time.service';
import { Stomp } from '@stomp/stompjs';
import { environment } from 'src/environments/environment';
import SockJS from 'sockjs-client/dist/sockjs';
import { ConstantsService } from '../constants/constants.service';
import { CrmRealTimeService } from 'src/app/states/crm/crm-real-time.service';
import { MarketingEmailRealTimeService } from 'src/app/states/marketing-email/marketing-email-real-time.service';
import { WebsocketStateService } from 'src/app/states/websocket/websocket-state.service';
import { SupportPageCategoriesRealTimeService } from 'src/app/components/super-admin/state/support-page-categories/support-page-categories-real-time.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';
import { NoteRealTimeService } from 'src/app/states/note/note-real-time.service';
import { EmailTemplateRealTimeService } from 'src/app/states/email-template/email-template-real-time.service';
import { CustomerRoleRealTimeService } from 'src/app/states/customer-role/customer-role-real-time.service';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { DeviceTagsRealTimeService } from 'src/app/states/device-tags/device-tags-real-time.service';
import { FileManagementRealTimeService } from 'src/app/states/file-management/file-management-real-time.service';
import { SubscriptionServicesRealTimeService } from 'src/app/states/subscription-services/subscription-services-real-time.service';
import { ApiKeysRealTimeService } from 'src/app/states/api-keys/api-keys-real-time.service';
import { NotificationsRealTimeService } from 'src/app/states/notifications/notifications-real-time.service';
import { TasksRealTimeService } from 'src/app/states/tasks/tasks-real-time.service';


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
  private userFilters;
  public IsKafkaConnected: boolean = false;
  onInit: EventEmitter<any> = new EventEmitter();
  isInit: boolean = false;
  isResetWebSocket: boolean = false;
  ws;
  blockWebSocket: boolean = false;
  isLogOut: boolean = false;
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
    private nonContractServicesRealTimeService: NonContractServicesRealTimeService,
    private contractsRealTimeService: ContractsRealTimeService,
    private shellRealTimeService: ShellRealTimeService,
    private tagsRealTimeService: TagsRealTimeService,
    private documentsRealTimeService: DocumentsRealTimeService,
    private kafkaRealTimeService: KafkaRealTimeService,
    private constantsService: ConstantsService,
    private crmRealTimeService: CrmRealTimeService,
    private marketingEmailRealTimeService: MarketingEmailRealTimeService,
    private websocketStateService: WebsocketStateService,
    private supportPageCategoriesRealTimeService: SupportPageCategoriesRealTimeService,
    private leftPanelStateService: LeftPanelStateService,
    private devicesStateService: DevicesStateService,
    private noteRealTimeService: NoteRealTimeService,
    private emailTemplateRealTimeService: EmailTemplateRealTimeService,
    private customerRoleRealTimeService: CustomerRoleRealTimeService,
    private customerPortalStateService: CustomerPortalStateService,
    private deviceTagsRealTimeService: DeviceTagsRealTimeService,
    private fileManagementRealTimeService: FileManagementRealTimeService,
    private subscriptionServicesRealTimeService: SubscriptionServicesRealTimeService,
    private apiKeysRealTimeService: ApiKeysRealTimeService,
    private notificationsRealTimeService: NotificationsRealTimeService,
    private tasksRealTimeService: TasksRealTimeService

  ) {
  }

  public initializeWebSocketConnection() {
    if (this.usersState.getCurrentUser().role !== "SUPER_ADMIN") this.onInitConnect();
    if (this.usersState.getCurrentUser().role === "SUPER_ADMIN") this.onInitSuperAdminConnect();
  }
  onInitConnect() {
    this.ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(this.ws);
    this.stompClient.logRawCommunication = true;
    this.onConnect();
    let that = this;
    this.stompClient.onConnect = (data) => {
      //   that.subsribeToKafka();
      if (!that.customerPortalStateService.isCustomerPortal) that.subsribeToPermissions();
      that.subsribeToUsers();
      that.subsribeToDevices();
      that.subsribeToCompany();
      if (!that.customerPortalStateService.isCustomerPortal) that.subsribeToPasswordRecods();
      if (!that.customerPortalStateService.isCustomerPortal) that.subsribeToTaxes();
      if (!that.customerPortalStateService.isCustomerPortal) that.subsribeToCategories();
      if (!that.customerPortalStateService.isCustomerPortal) that.subsribeToProducts();
      that.subsribeToTicketActualNumber();
      if (!that.customerPortalStateService.isCustomerPortal) that.subsribeToTicketsFilters();
      that.subsribeToTickets();
      if (!that.customerPortalStateService.isCustomerPortal) that.subsribeToCmdShellOutput();
      if (!that.customerPortalStateService.isCustomerPortal) that.subsribeToBillable();
      if (!that.customerPortalStateService.isCustomerPortal) that.subsribeToInvoiceNumber();
      if (!that.customerPortalStateService.isCustomerPortal) that.subsribeToBillableCount();
      that.subsribeToInvoice();
      that.subsribeToPayments();
      if (!that.customerPortalStateService.isCustomerPortal) that.subsribeToSubmittedService();
      if (!that.customerPortalStateService.isCustomerPortal) that.subsribeToSubmittedServiceAgreement();
      if (!that.customerPortalStateService.isCustomerPortal) that.subsribeToSubmittedFileManagement();
      that.subsribeToSubmittedOneTimeConnection();
      that.subsribeToLockScreen();
      that.subsribeToTicketPriority();
      that.subsribeToAgentNotification();
      if (!that.customerPortalStateService.isCustomerPortal) that.subsribeToTags();
      if (!that.customerPortalStateService.isCustomerPortal) that.subsribeToDocuments();
      if (!that.customerPortalStateService.isCustomerPortal) that.subsribeToDocumentsCategory();
      if (!that.customerPortalStateService.isCustomerPortal) that.subsribeToCrm();
      if (!that.customerPortalStateService.isCustomerPortal) that.subsribeToCustomSubscription();
      that.subsribeToNoteTemplateSubscription();
      if (!that.customerPortalStateService.isCustomerPortal) that.subsribeToEmailNotification();
      that.subsribeToCustomerRole();
      that.subsribeToSubscriptionService();
      if (data.command === "CONNECTED") this.websocketStateService.initConnection();
      that.subsribeToApiKeys();
      that.subsribeToNotifications();
      that.subsribeToTasks();
      that.subsribeToQuotesNumber();
      that.onInit.emit(true);
      that.isInit = true;
    }
    this.stompClient.debug = (data) => {
      console.log("debug", data);
    }
    this.stompClient.onWebSocketClose = (data) => {
      if (!this.isLogOut) this.usersService.isAuthorized().subscribe(res => {
        setTimeout(() => {
          this.onInitConnect();
        }, 20000);
      })
    };
    this.appService.onSessionScreen.subscribe(data => {
      this.blockWebSocket = data;
    })
  }
  onInitSuperAdminConnect() {
    this.ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(this.ws);
    this.stompClient.logRawCommunication = true;
    this.onConnect();
    let that = this;
    this.stompClient.onConnect = (data) => {
      that.subsribeToSupportCategory();
      that.subsribeToTags();
      if (data.command === "CONNECTED") this.websocketStateService.initConnection();
    }
    this.stompClient.debug = (data) => {
      console.log("debug", data);
    }
    this.stompClient.onWebSocketClose = (data) => {
      setTimeout(() => {
        this.onInitSuperAdminConnect();
      }, 20000);
    }
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
  private subsribeToSubscriptionService() {
    setTimeout(() => {
      this.stompClient.subscribe(`/user/watch/subscriptionService`, (message) => {
        var newChange = JSON.parse(message.body);
        this.subscriptionServicesRealTimeService.handleRealTimeChanges(newChange);
        if (message.body) {

        }
      });
      this.devicesStateService.initWebSocket();
    }, 3000);
  }
  private subsribeToDevices() {
    setTimeout(() => {
      this.stompClient.subscribe(`/user/watch/device`, (message) => {
        var newChange = JSON.parse(message.body);
        this.devicesRealTimeService.handleRealTimeChanges(newChange);
        if (message.body) {

        }
      });
      this.devicesStateService.initWebSocket();
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
  private subsribeToApiKeys() {

    setTimeout(() => {
      this.stompClient.subscribe("/user/watch/apiKey", (message) => {
        var newChange = JSON.parse(message.body);
        this.apiKeysRealTimeService.handleRealTimeChanges(newChange);
        if (message.body) {
        }
      });
    }, 3000);
  }
  private subsribeToAgentNotification() {

    setTimeout(() => {
      this.stompClient.subscribe("/user/watch/agent", (message) => {
        var newChange = JSON.parse(message.body);
        this.deviceTagsRealTimeService.handleRealTimeChanges(newChange);
        if (message.body) {
        }
      });
    }, 3000);
  }
  private subsribeToEmailNotification() {

    setTimeout(() => {
      this.stompClient.subscribe("/user/watch/companyEmailNotification", (message) => {
        var newChange = JSON.parse(message.body);
        this.emailTemplateRealTimeService.handleRealTimeChanges(newChange);
        if (message.body) {
        }
      });
    }, 3000);
  }
  private subsribeToNotifications() {

    setTimeout(() => {
      this.stompClient.subscribe("/user/watch/userNotification", (message) => {
        var newChange = JSON.parse(message.body);
        this.notificationsRealTimeService.handleRealTimeChanges(newChange);
        if (message.body) {
        }
      });
    }, 3000);
  }

  private subsribeToCustomerRole() {

    setTimeout(() => {
      this.stompClient.subscribe("/user/watch/customerRole", (message) => {
        var newChange = JSON.parse(message.body);
        this.customerRoleRealTimeService.handleRealTimeChanges(newChange);
        if (message.body) {
        }
      });
    }, 3000);
  }
  private subsribeToTasks() {

    setTimeout(() => {
      this.stompClient.subscribe("/user/watch/tasks", (message) => {
        var newChange = JSON.parse(message.body);
        this.tasksRealTimeService.handleRealTimeChanges(newChange);
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

  public subsribeToSupportCategory() {
    setTimeout(() => {
      this.stompClient.subscribe("/user/watch/supportCategory", (message) => {
        var newChange = JSON.parse(message.body);
        this.supportPageCategoriesRealTimeService.handleRealTimeChanges(newChange);//permissions
        if (message.body) { }
      });
    }, 3000);
  }

  /**
 * @description Subscribe to quote realtime Customer Users
*/
  public subsribeToQuoteCustomerUsers(clientCompId) {
    this.quoteRealTimeService.subsribeToQuoteCustomerUsers = this.stompClient.subscribe(`/user/watch/saleQuotes/${clientCompId}`, (message) => {
      var newChange = JSON.parse(message.body);
      this.quoteRealTimeService.handleRealTimeChanges(newChange);
      if (message.body) {

      }
    });
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
  public subsribeToQuotesNumber() {
    setTimeout(() => {
      this.stompClient.subscribe(`/user/watch/number/SALE_QUOTE`, (message) => {
        var newChange = JSON.parse(message.body);
        this.quoteRealTimeService.handleRealTimeNumber(newChange);
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

  public subsribeToUserSubscriptions(id) {

    setTimeout(() => {
      this.stompClient.subscribe(`/user/watch/subscription/${id}`, (message) => {
        var newChange = JSON.parse(message.body);
        this.usersRealTimeService.handleRealTimeSubscriptions(newChange);
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
  public subsribeToTicketTasks(id) {

    this.ticketsRealTimeService.ticketTaskSubscription = this.stompClient.subscribe(`/user/watch/ticketTasks/${id}`, (message) => {
      var newChange = JSON.parse(message.body);
      this.ticketsRealTimeService.handleRealTimeChangesTicketTasks(newChange);

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

  public subsribeToCrm() {

    setTimeout(() => {

      this.stompClient.subscribe(`/user/watch/crm`, (message) => {
        var newChange = JSON.parse(message.body);
        this.crmRealTimeService.handleRealTimeChanges(newChange);

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
  public subsribeToTicketsFilters() {

    setTimeout(() => {

      this.stompClient.subscribe(`/user/watch/ticketFilters`, (message) => {
        var newChange = JSON.parse(message.body);
        this.ticketsRealTimeService.handleRealTimeChangesTicketFilters(newChange);

      });

    }, 3000);
  }

  public subsribeToUsersFilters() {

    setTimeout(() => {

      this.userFilters = this.stompClient.subscribe(`/user/watch/userFilters`, (message) => {
        var newChange = JSON.parse(message.body);
        this.usersRealTimeService.handleRealTimeChangesUsersFilters(newChange);

      });

    }, 3000);
  }

  public subsribeToTicketsCustomerUsers(clientCompId) {
    this.ticketsRealTimeService.subsribeToTicketsCustomerUser = this.stompClient.subscribe(`/user/watch/tickets/${clientCompId}`, (message) => {
      var newChange = JSON.parse(message.body);
      this.ticketsRealTimeService.handleRealTimeChangesTickets(newChange);
    });
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
  public subsribeToInvoiceCustomerUsers(clientCompId) {
    this.invoiceRealTimeService.subsribeToInvoiceCustomerUsers = this.stompClient.subscribe(`/user/watch/receivableInvoice/${clientCompId}`, (message) => {
      var newChange = JSON.parse(message.body);
      this.invoiceRealTimeService.handleRealTimeChangesInvoice(newChange);
    });
  }
  public subsribeToPaymentsCustomerUsers(clientCompId) {
    this.paymentsRealTimeService.subsribeToPaymentsCustomerUsers = this.stompClient.subscribe(`/user/watch/payments/${clientCompId}`, (message) => {
      var newChange = JSON.parse(message.body);
      this.paymentsRealTimeService.handleRealTimeChanges(newChange);
    });
  }
  public subsribeToDevicesCustomerUsers(clientCompId) {
    this.devicesRealTimeService.subsribeToDevicesCustomerUsers = this.stompClient.subscribe(`/user/watch/device/${clientCompId}`, (message) => {
      var newChange = JSON.parse(message.body);
      this.devicesRealTimeService.handleRealTimeChanges(newChange);
    });
    this.devicesStateService.initWebSocket();
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
        this.nonContractServicesRealTimeService.handleRealTimeChanges(newChange);
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
  public subsribeToSubmittedFileManagement() {
    setTimeout(() => {
      this.stompClient.subscribe(`/user/watch/fileManagement`, (message) => {
        var newChange = JSON.parse(message.body);
        this.fileManagementRealTimeService.handleRealTimeChanges(newChange);
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

  public subsribeToTicketPriority() {
    setTimeout(() => {
      this.netScanSub = this.stompClient.subscribe(`/user/watch/customPriority`, (message) => {
        var newChange = JSON.parse(message.body);
        this.ticketsRealTimeService.handleRealTimeChangesTicketPriority(newChange);
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
  public subsribeToKafka() {
    if (this.stompClient.connected) {
      this.stompClient.subscribe(`/user/watch/kafka`, (message) => {
        var newChange = JSON.parse(message.body);
        this.kafkaRealTimeService.handleRealTimeChanges(newChange);
      });
      this.IsKafkaConnected = true;
    }
    else {
      setTimeout(() => this.subsribeToKafka(), 3000);
    }
  }

  public subsribeToCustomSubscription() {

    setTimeout(() => {

      this.stompClient.subscribe(`/user/watch/customSubscription`, (message) => {
        var newChange = JSON.parse(message.body);
        this.marketingEmailRealTimeService.handleRealTimeChanges(newChange);

      });

    }, 3000);
  }

  public subsribeToNoteTemplateSubscription() {

    setTimeout(() => {

      this.stompClient.subscribe(`/user/watch/ticketNoteTemplate`, (message) => {
        var newChange = JSON.parse(message.body);
        this.noteRealTimeService.handleRealTimeChanges(newChange);

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
  public unSubsribeUsersFilters() {
    if (this.userFilters) this.userFilters.unsubscribe();
  }
  public getClient() {
    return this.stompClient;
  }
}

