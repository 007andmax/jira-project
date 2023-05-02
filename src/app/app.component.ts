import { Component, OnInit, ChangeDetectorRef, ViewChild, ApplicationRef } from '@angular/core';
// @ts-ignore
import { UpgradeModule } from "@angular/upgrade/static";
import { setUpLocationSync } from '@angular/router/upgrade';
import { UsersService } from "./services/users/users.service";
import { WebsocketService } from "./services/websocket/websocket.service";
import { UsersStateService } from './states/users/users-state.service';
import { DevicesStateService } from './states/devices/devices-state.service';
import { CompaniesStateService } from './states/company/companies-state.service';
import { AppService } from './states/app/app.service';
import { TaxesStateService } from './states/taxes/taxes-state.service';
import { GlNumberStateService } from './states/gl-number/gl-number-state.service';
import { InventoryStateService } from './states/inventory/inventory-state.service';
import { TicketsStateService } from './states/tickets/tickets-state.service';
import { ConstantsStateService } from './states/constants/constants-state.service';
import { LeftPanelStateService } from './states/left-panel/left-panel-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalLockScreenComponent } from './services/modal/modal-lock-screen/modal-lock-screen.component';
import { ModalSessionScreenComponent } from './services/modal/modal-session-screen/modal-session-screen.component';
import { PasswordManagerStateService } from './states/password-manager/password-manager-state.service';
import { Router } from '@angular/router';
import { PAGE_DEVICE, PAGE_MAIN } from './const/app';
import { TagsStateService } from './states/tags/tags-state.service';
import { DocumentsStateService } from './states/documents/documents-state.service';
import { AppStateService } from './states/app/app-state.service';
import { KafkaStateService } from './states/kafka/kafka-state.service';
import { CrmStateService } from './states/crm/crm-state.service';
import { MarketingEmailStateService } from './states/marketing-email/marketing-email-state.service';
import { PermissionsService } from './services/permissions/permissions.service';
import { CurrentUser } from 'src/class/current-user/current-user';
import { SupportPageCategoriesStateService } from './components/super-admin/state/support-page-categories/support-page-categories-state.service';
import { NoteStateService } from './states/note/note-state.service';
import { EmailTemplateStateService } from './states/email-template/email-template-state.service';
import { GoogleAuthenticatorComponent } from './components/shared/google-authenticator/google-authenticator.component';
import { Subscription } from 'rxjs';
import { CustomerRoleStateService } from './states/customer-role/customer-role-state.service';


/**
 * Root component
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showPreloader: boolean = true;
  isUsersInit: boolean = false;
  isCompaniesInit: boolean = false;
  isDevicesInit: boolean = false;
  qtListHeaaderScroller;
  qtListBodyScroller;
  toggleLeftPanel: boolean = false;
  toggMobileleLeftPanel: boolean = false;
  hideleLeftPanel: boolean = false;
  showSessionScreen: boolean = false;
  showLockScreen: boolean = false;
  main_page: string;
  PAGE_MAIN = PAGE_MAIN;
  PAGE_DEVICE = PAGE_DEVICE;
  state: string = '';
  currentUser: CurrentUser;
  sub: Subscription = new Subscription();
  @ViewChild('contentLockScreenModal') contentLockScreenModal: ModalLockScreenComponent;
  @ViewChild('contentSessionScreenModal') contentSessionScreenModal: ModalSessionScreenComponent;
  /**
   * Creates an instance of the MainComponent with the injected services
   * @param {UpgradeModule} upgrade service
   * @param {UsersService} userService service
   * @param {WebsocketService} websocketService service
   */
  constructor(
    private upgrade: UpgradeModule,
    private userService: UsersService,
    private usersStateService: UsersStateService,
    private websocketService: WebsocketService,
    private devicesState: DevicesStateService,
    private companiesState: CompaniesStateService,
    private appService: AppService,
    private taxesStateService: TaxesStateService,
    private glNumberStateService: GlNumberStateService,
    private inventoryStateService: InventoryStateService,
    private ticketsStateService: TicketsStateService,
    private constantsStateService: ConstantsStateService,
    private leftPanelStateService: LeftPanelStateService,
    private tagsStateService: TagsStateService,
    private documentsStateService: DocumentsStateService,
    private modalService: NgbModal,
    private router: Router,
    public cd: ChangeDetectorRef,
    private kafkaStateService: KafkaStateService,
    private appRef: ApplicationRef,
    private permissionsService: PermissionsService,
    private appStateService: AppStateService,
    private crmStateService: CrmStateService,
    private marketingEmailStateService: MarketingEmailStateService,
    private customerRoleStateService: CustomerRoleStateService,
    private noteStateService: NoteStateService,
    private supportPageCategoriesStateService: SupportPageCategoriesStateService,
    private emailTemplateStateService: EmailTemplateStateService

  ) { }

  /**
   * Initializes root. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    if (window.location.href.includes('/device') && !window.location.href.includes('/devices') && !window.location.href.includes('/device-ip-summary-device') && !window.location.href.includes('/deviceSetting')) {
      this.main_page = PAGE_DEVICE;
    } else {
      this.main_page = PAGE_MAIN;
    }
    this.usersStateService.onInit();
    this.usersStateService.getOnGetCurrentuser().subscribe(data => {
      this.currentUser = data;
      if (this.currentUser.twoFactorAuthType === "GOOGLE_SECURE" && !this.currentUser.userTOTP.confirmed) this.onCheckGoogleAuthenticator();
      if (this.appService.getIsInit()) return;
      if (data.role !== "SUPER_ADMIN") {
        this.devicesState.onInit();
        this.companiesState.onInit();
        this.taxesStateService.onInit();
        this.glNumberStateService.onInit();
        this.inventoryStateService.onInit();
        this.ticketsStateService.onInit();
        this.constantsStateService.onInit();
        this.tagsStateService.onInit();
        this.documentsStateService.onInit();
        this.crmStateService.onInit();
        this.marketingEmailStateService.onInit();
        this.kafkaStateService.onInit();
        this.noteStateService.onInit();
        this.emailTemplateStateService.onInit();
        this.customerRoleStateService.onInit();
        if (this.state === 'help-center') this.supportPageCategoriesStateService.onInit();
        this.websocketService.initializeWebSocketConnection();
      } else {
        this.supportPageCategoriesStateService.onInit();
        this.websocketService.initializeWebSocketConnection();
        this.companiesState.onInitGetCurrentCompany();
        this.tagsStateService.onInit();
        this.appService.onInit();
        this.showPreloader = false;
        this.cd.detectChanges();
      }
      const selectTarget = (fromElement, selector) => {
        if (!(fromElement instanceof HTMLElement)) {
          return null;
        }
        return fromElement.querySelector(selector);
      };
      const resizeData = {
        tracking: false,
        startWidth: null,
        startCursorScreenX: null,
        handleWidth: 10,
        resizeTarget: null,
        parentElement: null,
        maxWidth: null,
      };


      $(document.body).on('mousedown', '.resize-handle--x', null, (event) => {
        if (event.button !== 0) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        const handleElement = event.currentTarget;
        if (!handleElement.parentElement) {
          console.error(new Error("Parent element not found."));
          return;
        }
        // Use the target selector on the handle to get the resize target.
        const targetSelector = handleElement.getAttribute('data-target');
        const targetElement = selectTarget(handleElement.parentElement, targetSelector);
        if (!targetElement) {
          console.error(new Error("Resize target element not found."));
          return;
        }
        resizeData.startWidth = $(targetElement).outerWidth();
        resizeData.startCursorScreenX = event.screenX;
        resizeData.resizeTarget = targetElement;
        resizeData.parentElement = handleElement.parentElement;
        resizeData.maxWidth = $(handleElement.parentElement).innerWidth() - resizeData.handleWidth;
        resizeData.tracking = true;
      });
      $(window).on('mousemove', null, null, (event) => {
        if (resizeData.tracking) {
          const cursorScreenXDelta = event.screenX - resizeData.startCursorScreenX;
          const newWidth = Math.min(resizeData.startWidth + cursorScreenXDelta, resizeData.maxWidth);
          if (newWidth >= 280 && newWidth <= 560) $(resizeData.resizeTarget).outerWidth(newWidth);
        }
      });
      $(window).on('mouseup', null, null, (event) => {
        if (resizeData.tracking) {
          resizeData.tracking = false;
          localStorage.setItem("width-left-aside", String($(resizeData.resizeTarget).width()));
        }
      });
    })

    //  this.userService.getCurrentUser();


    this.appService.onCheckMobile();
    window.addEventListener('resize', this.appService.onCheckMobile);

    this.devicesState.getOnDevices().subscribe(data => {
      this.isDevicesInit = true;
      this.onCheckInitAll();
    })
    this.usersStateService.getOnUsers().subscribe(data => {
      this.isUsersInit = true;
      this.onCheckInitAll();
    })
    this.companiesState.getOnCompanies().subscribe(data => {
      this.isCompaniesInit = true;
      this.onCheckInitAll();

    })
    this.leftPanelStateService.onToggleLeftPanel.subscribe(data => {
      if (!this.appService.isMobile && this.state !== 'help-center') {
        if (data) $("#aside-left-panel").width("");
        if (!data && localStorage.getItem("width-left-aside") && Math.ceil($("#aside-left-panel").width()) == (64 || 280)) $("#aside-left-panel").outerWidth(localStorage.getItem("width-left-aside"));
        if (!data && !localStorage.getItem("width-left-aside")) $("#aside-left-panel").outerWidth(280);
      }
      this.toggleLeftPanel = data;
      this.cd.detectChanges();
    })
    this.leftPanelStateService.onToggleMobileLeftPanel.subscribe(data => {
      this.toggMobileleLeftPanel = data;
      this.cd.detectChanges();
    })
    this.leftPanelStateService.onHideLeftPanel.subscribe(data => {
      this.hideleLeftPanel = data;
      this.cd.detectChanges();
    })
    this.appService.onLockScreen.subscribe(data => {
      if (!this.showLockScreen) {
        this.contentLockScreenModal.reload = data;
        this.contentLockScreenModal.showModal();
        this.showLockScreen = true;
        this.cd.detectChanges();
      }
    })
    this.appService.onSessionScreen.subscribe(data => {
      if (!this.showSessionScreen) {
        this.contentSessionScreenModal.message = data;
        this.contentSessionScreenModal.showModal();
        this.showSessionScreen = true;
        this.cd.detectChanges();
      }
    })
    this.usersStateService.onChangeUserPermissions.subscribe(data => {
      if (this.companiesState.getCurrentCompany().id === data.company.id) {
        this.usersStateService.changeUserPermissions(data.permissions);
        this.cd.detectChanges();
      }
    })
    this.appStateService.onChangeDetectorRef.subscribe(data => {
      setTimeout(() => {
        this.appRef.tick();
        document.body.click();
      }, 500);
    })
    this.companiesState.onCurrentCompany.subscribe(data => {
      if (!this.currentUser) return;
      if (this.router.url.includes("tickets") && (this.state == "new-tickets" || this.state == '')) {
        this.ticketsStateService.onChangeTypeFilter(this.currentUser.startPage == "MY_TICKETS" ? "USERS" : this.currentUser.startPage);
        this.ticketsStateService.onChangeLeftPanelFilter(this.currentUser.startPage == "MY_TICKETS" ? "USERS" : this.currentUser.startPage);
      }
      if (this.router.url === "/" && this.currentUser.role !== "SUPER_ADMIN" && this.state == 'new-tickets' && this.main_page == PAGE_MAIN && !this.ticketsStateService.getListType()) {
        this.ticketsStateService.onChangeTypeFilter(this.currentUser.startPage == "MY_TICKETS" ? "USERS" : this.currentUser.startPage);
        this.ticketsStateService.onChangeLeftPanelFilter(this.currentUser.startPage == "MY_TICKETS" ? "USERS" : this.currentUser.startPage);
      }
      if (this.router.url === "/" && this.currentUser.role !== "SUPER_ADMIN" && this.state == '' && this.main_page == PAGE_MAIN) {
        this.ticketsStateService.onChangeTypeFilter(this.currentUser.startPage == "MY_TICKETS" ? "USERS" : this.currentUser.startPage);
        this.ticketsStateService.onChangeLeftPanelFilter(this.currentUser.startPage == "MY_TICKETS" ? "USERS" : this.currentUser.startPage);
        this.router.navigate(
          [`${data.name.replaceAll(' ', '')}/tickets/`]);
      }
      if (this.router.url === "/" && this.currentUser.role === "SUPER_ADMIN" && this.state == '') this.router.navigate(
        [`${data.name.replaceAll(' ', '')}/support-page/`]);
    })
    this.appService.onToggleMobileAside.subscribe(data => {
      if (data) document.querySelector("html").classList.add("--scrollLock");
      if (!data) document.querySelector("html").classList.remove("--scrollLock");
    })
    this.leftPanelStateService.onFirstOpen.subscribe(data => {
      this.state = data;
      if (this.state === "ticket-detail") {
        this.leftPanelStateService.toggleLeftPanel(true);
        $("#aside-left-panel").width("");
      } else {
        if (localStorage.getItem("width-left-aside") && Number(localStorage.getItem("width-left-aside")) >= 280 && Number(localStorage.getItem("width-left-aside")) <= 560) $("#aside-left-panel").outerWidth(localStorage.getItem("width-left-aside"));
        if (localStorage.getItem("width-left-aside") && Number(localStorage.getItem("width-left-aside")) < 280) {
          $("#aside-left-panel").outerWidth(280);
          localStorage.setItem("width-left-aside", "280");
        }
        if (!localStorage.getItem("width-left-aside")) $("#aside-left-panel").outerWidth(280);
        if (this.appService.isMobile || (this.currentUser && this.currentUser.role === "SUPER_ADMIN") || this.state === 'help-center') {
          $("#aside-left-panel").width("auto");
        }
      }
    })
    this.leftPanelStateService.onChangeState.subscribe(data => {
      this.state = data;
    })
  }
  onCheckGoogleAuthenticator() {
    const modalRef = this.modalService.open(GoogleAuthenticatorComponent, { windowClass: 'quote-send-modal page-settings', backdrop: 'static', keyboard: false });
    /* let onReset = modalRef.componentInstance.onReset.subscribe(data => {
     })
     let onSetQrCode = modalRef.componentInstance.onSetQrCode.subscribe(data => {
 
     })
     this.sub.add(onSetQrCode);
     this.sub.add(onReset);*/
  }
  ngDoCheck() {
    this.qtListHeaaderScroller = document.querySelector('.qt-page-list__header-thead-container');
    this.qtListBodyScroller = document.querySelector('.qt-page-list__body-table-container');
    if (this.qtListHeaaderScroller && this.qtListBodyScroller) {
      this.qtListHeaaderScroller.removeEventListener('scroll', this.qtListHeaaderScrollerScroll, false);
      this.qtListBodyScroller.removeEventListener('scroll', this.qtListBodyScrollerScroll, false);

      this.qtListHeaaderScroller.addEventListener('scroll', this.qtListHeaaderScrollerScroll, false);
      this.qtListBodyScroller.addEventListener('scroll', this.qtListBodyScrollerScroll, false);
    }
    // if ((<any>document.body.querySelector("#userback_button_container")) && (<any>document.body.querySelector("#userback_button_container")).style.display == "" && this.appService.checkMobile()) (<any>document.body.querySelector("#userback_button_container")).style.display = "none";
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  goToTickets() {
    this.leftPanelStateService.goToState('new-tickets');
  }
  goToPasswordManager() {
    this.leftPanelStateService.goToState('password-manager');
  }
  goToCompanies() {
    this.leftPanelStateService.goToState('new-companies');
  }
  public setShowLockScreen(data) {
    this.showLockScreen = data;
  }
  qtListHeaaderScrollerScroll = () => {
    this.qtListBodyScroller.scrollLeft = this.qtListHeaaderScroller.scrollLeft;
  }
  qtListBodyScrollerScroll = () => {
    this.qtListHeaaderScroller.scrollLeft = this.qtListBodyScroller.scrollLeft;
  }
  private onCheckInitAll() {
    if (this.isCompaniesInit && this.isUsersInit && !this.appService.getIsInit()) {
      this.appService.onInit();
      this.showPreloader = false;
      this.cd.detectChanges();
    }

  }


}
