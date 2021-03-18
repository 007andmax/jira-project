import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  showLockScreen: boolean = false;
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
    private modalService: NgbModal,
    public cd: ChangeDetectorRef,

  ) { }

  /**
   * Initializes root. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.upgrade.bootstrap(document.body, ['quicktech']);
    setUpLocationSync(this.upgrade);
    this.userService.getUser();
    this.devicesState.onInit();
    this.usersStateService.onInit();
    this.companiesState.onInit();
    this.taxesStateService.onInit();
    this.glNumberStateService.onInit();
    this.inventoryStateService.onInit();
    this.ticketsStateService.onInit();
    this.constantsStateService.onInit();
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
    this.appService.onLockScreen.subscribe(data => {
      if (!this.showLockScreen) {
        const modalRef = this.modalService.open(ModalLockScreenComponent, {
          windowClass: 'quote-send-modal', backdrop: 'static',
          keyboard: false
        });
        console.log("modalRef", modalRef);
        this.showLockScreen = true;
        this.cd.detectChanges();
      }
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
