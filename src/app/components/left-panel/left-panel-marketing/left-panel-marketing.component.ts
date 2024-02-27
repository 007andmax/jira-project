import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { LeftPanelService } from 'src/app/services/left-panel/left-panel.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { MarketingEmailStateService } from 'src/app/states/marketing-email/marketing-email-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { MarketingSubscriptionType } from '../../setting/marketing-email/marketing-subscription-type/class/marketing-subscription-type';
import { UserCustomSubscription } from '../../users/class/user-custom-subscription';
import { UserFilter } from '../../users/class/user-filter';
import { LeftPanelUsersService } from '../left-panel-users/services/left-panel-users.service';
import { UserFilters } from '../../users/class/user-filters';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { UserGlobalFilter } from '../../users/class/user-global-filters';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from 'src/app/services/users/users.service';
import { DELETE_GLOBAL_USERS_FILTER } from 'src/app/const/confirm';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';

@Component({
  selector: 'left-panel-marketing',
  templateUrl: './left-panel-marketing.component.html',
  styleUrls: ['./left-panel-marketing.component.scss'],
  providers: [LeftPanelUsersService]
})
export class LeftPanelMarketingComponent implements OnInit {
  open: boolean = false;
  filter: UserFilters = new UserFilters();
  listCustomSubscription: Array<MarketingSubscriptionType> = [];
  selectedGlobalFilter: UserGlobalFilter = new UserGlobalFilter();
  globalFilters: Array<UserGlobalFilter> = [];
  isGetGlobalFilters: boolean = false;
  page: number = 0;
  showLoadMoreUpdates = false;
  showPreloaderGlobalFilters: boolean = false;
  @Input() activePage: string = "";
  @Output() onChangeState = new EventEmitter();
  @Output() onGoToLink = new EventEmitter();
  @Output() onOpenPanel = new EventEmitter();
  sub: Subscription = new Subscription();
  constructor(private usersStateService: UsersStateService,
    private leftPanelUsersService: LeftPanelUsersService,
    public cd: ChangeDetectorRef,
    private leftPanelService: LeftPanelService,
    private marketingEmailStateService: MarketingEmailStateService,
    private leftPanelStateService: LeftPanelStateService,
    public customerPortalStateService: CustomerPortalStateService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private usersService: UsersService,
    private permissionsService: PermissionsService,
  ) { }

  ngOnInit() {
    this.leftPanelStateService.onToggleLeftPanel.subscribe(data => {
      if (data) this.open = false;
    })
    this.leftPanelStateService.onChangeState.subscribe(state => {
      if (!this.leftPanelService.isMarketingPage(state)) this.open = false;
      if (this.leftPanelService.isMarketingPage(state) && !this.isGetGlobalFilters && !this.customerPortalStateService.isCustomerPortal && this.usersStateService.getCurrentUser()) this.getGLobalFilters();

    })
    this.leftPanelStateService.onFirstOpen.subscribe(data => {
      if (this.leftPanelService.isMarketingPage(data)) this.open = true;
    })
    this.listCustomSubscription = this.marketingEmailStateService.getListCustomSubscription();
    let onGetListCustomSubscription = this.marketingEmailStateService.onGetListCustomSubscription.subscribe(data => {
      this.listCustomSubscription = data;
    })
    this.sub.add(onGetListCustomSubscription);
    let geLefttFilter = this.usersStateService.getOnFilter().subscribe((data) => {
      this.filter.setData(data);
    })
    let onClearGlobalFilter = this.usersStateService.onClearGlobalFilter.subscribe((data) => {
      this.selectedGlobalFilter = new UserGlobalFilter();
    })
    this.usersStateService.getOnGetCurrentuser().subscribe(data => {
      if (!this.isGetGlobalFilters && !this.customerPortalStateService.isCustomerPortal) this.getGLobalFilters();
    })
    let onInitGlobalFilter = this.usersStateService.onInitGlobalFilter.subscribe((data) => {
      this.selectedGlobalFilter = data;
    });
    if (this.leftPanelService.isMarketingPage(this.leftPanelStateService.activePage) && !this.isGetGlobalFilters && !this.customerPortalStateService.isCustomerPortal && this.usersStateService.getCurrentUser()) this.getGLobalFilters();
  }
  onDeleteGlobalFilter(filter) {
    this.usersService.deleteGlobalFilter(filter.id).subscribe(data => {

    })
  }
  setGlobalFilter(filter) {
    this.selectedGlobalFilter = filter;
    this.usersStateService.onChangeGlobalFilter(filter);
    this.usersStateService.changeToggleFilter(true);
  }
  blockClick(event) {
    event.preventDefault();
    event.stopPropagation();
  }
  removeFilter(filter) {
    this.confirmStateService.setConfirmAction(DELETE_GLOBAL_USERS_FILTER);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    this.usersStateService.setGlobalFilterForRemove(filter);
  }
  public getGLobalFilters() {
    this.isGetGlobalFilters = true;
    this.showPreloaderGlobalFilters = true;
    this.usersService.getFilters(this.page, true).subscribe((data: any) => {
      this.globalFilters = [...this.globalFilters, ...data.userFilterDtos.map(item => new UserGlobalFilter(item)).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
        1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0))];
      this.usersStateService.setGlobalFilters(this.globalFilters);
      this.page++;
      this.showPreloaderGlobalFilters = false;
      if (data.totalElements > this.globalFilters.length) {
        this.showLoadMoreUpdates = true;
      } else {
        this.showLoadMoreUpdates = false;
      }
    })
  }
  onChangeCustomSubscription(data) {
    this.usersStateService.onInitLeftPanelMarketingFilter(data);
    this.filter.setCustomSubscriptions([data]);
    this.usersStateService.onInitFilter(this.filter);

  }
  public close() {
    this.open = false;
  }
  public goToAll() {
    this.goToState();
    this.clearSubscription();
  }
  openPanel() {
    this.onOpenPanel.emit(null);
  }
  public goToState() {
    this.onChangeState.emit('marketing');
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }

  toggleFilter(event) {
    event.target.parentNode.classList.toggle('show-filter');
  }
  getSelecteSubscription() {
    return (this.filter.getCustomSubscriptions().length === 1) ? this.filter.getCustomSubscriptions()[0] : null;
  }
  clearSubscription() {
    if (this.filter.getCustomSubscriptions().length === 1) {
      this.usersStateService.onInitLeftPanelMarketingFilter(null);
      this.filter.setCustomSubscriptions([]);
      this.usersStateService.onInitFilter(this.filter);
    }
  }
  public trackByIndex(index, item) {
    return index;
  }
  ngOnDestroy(): void {
    this.leftPanelUsersService.onUnsubscribe();
  }
  public trackById(index, item) {
    return item.id;
  }
}
