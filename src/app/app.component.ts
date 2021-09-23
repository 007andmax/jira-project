import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
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
  main_page: string = PAGE_MAIN;
  PAGE_MAIN = PAGE_MAIN;
  PAGE_DEVICE = PAGE_DEVICE;
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
    private appStateService: AppStateService

  ) { }

  /**
   * Initializes root. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.router.events
      .subscribe((event) => {
        if (this.router.url.includes('/device') && !this.router.url.includes('/devices')) {
          this.main_page = PAGE_DEVICE;
        } else {
          this.main_page = PAGE_MAIN;
        }
      });

    this.devicesState.onInit();
    this.usersStateService.onInit();
    this.companiesState.onInit();
    this.taxesStateService.onInit();
    this.glNumberStateService.onInit();
    this.inventoryStateService.onInit();
    this.ticketsStateService.onInit();
    this.constantsStateService.onInit();
    this.tagsStateService.onInit();
    this.documentsStateService.onInit();
    //  this.userService.getCurrentUser();

    this.websocketService.initializeWebSocketConnection();
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
      this.usersStateService.changeUserPermissions(data);
      this.cd.detectChanges();
    })
    this.appStateService.onChangeDetectorRef.subscribe(data => {
      setTimeout(() => {
        this.cd.detectChanges();
        document.body.click();
      }, 500);
    })
    this.companiesState.onCurrentCompany.subscribe(data => {
      if (this.router.url === "/") this.router.navigate(
        [`${data.name.replaceAll(' ', '')}/tickets/`]);
    })
    this.appService.onToggleMobileAside.subscribe(data => {
      if (data) document.querySelector("html").classList.add("--scrollLock");
      if (!data) document.querySelector("html").classList.remove("--scrollLock");
    })
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
  goToTickets() {
    this.leftPanelStateService.goToState('new-tickets');
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
