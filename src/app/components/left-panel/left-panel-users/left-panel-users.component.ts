import { Component, OnInit, OnDestroy, ChangeDetectorRef, Output, EventEmitter, Input } from '@angular/core';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { UserFilter } from '../../users/class/user-filter';
import { LeftPanelUsersService } from './services/left-panel-users.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { LeftPanelService } from 'src/app/services/left-panel/left-panel.service';
import { UserFilters } from '../../users/class/user-filters';
import { UsersService } from 'src/app/services/users/users.service';
import { UserCount } from '../../users/class/user-count';
import { UserGlobalFilter } from '../../users/class/user-global-filters';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DELETE_GLOBAL_USERS_FILTER } from 'src/app/const/confirm';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { UserFilterSaveComponent } from '../../users/user-filter-save/user-filter-save.component';

@Component({
  selector: 'app-left-panel-users',
  templateUrl: './left-panel-users.component.html',
  styleUrls: ['./left-panel-users.component.scss'],
  providers: [LeftPanelUsersService]
})
export class LeftPanelUsersComponent implements OnInit, OnDestroy {
  open: boolean = false;
  filter: UserFilters = new UserFilters();
  userCount: UserCount = new UserCount();
  selectedGlobalFilter: UserGlobalFilter = new UserGlobalFilter();
  globalFilters: Array<UserGlobalFilter> = [];
  isGetGlobalFilters: boolean = false;
  @Input() activePage: string = "";
  page: number = 0;
  showLoadMoreUpdates = false;
  showPreloaderGlobalFilters: boolean = false;
  @Output() onChangeState = new EventEmitter();
  @Output() onGoToLink = new EventEmitter();
  @Output() onOpenPanel = new EventEmitter();
  constructor(private usersStateService: UsersStateService,
    private leftPanelUsersService: LeftPanelUsersService,
    public cd: ChangeDetectorRef,
    private leftPanelService: LeftPanelService,
    private leftPanelStateService: LeftPanelStateService,
    private usersService: UsersService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    public customerPortalStateService: CustomerPortalStateService,
  ) { }

  ngOnInit() {
    this.leftPanelStateService.onToggleLeftPanel.subscribe(data => {
      if (data) this.open = false;
    })
    this.leftPanelStateService.onChangeState.subscribe(state => {
      if (!this.leftPanelService.isUsersPage(state)) this.open = false;
      if (this.leftPanelService.isUsersPage(state) && !this.isGetGlobalFilters && !this.customerPortalStateService.isCustomerPortal && this.usersStateService.getCurrentUser()) this.getGLobalFilters();

    })
    this.leftPanelStateService.onFirstOpen.subscribe(data => {
      if (this.leftPanelService.isUsersPage(data)) this.open = true;
    })
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
    if (this.leftPanelService.isUsersPage(this.leftPanelStateService.activePage) && !this.isGetGlobalFilters && !this.customerPortalStateService.isCustomerPortal && this.usersStateService.getCurrentUser()) this.getGLobalFilters();
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_GLOBAL_USERS_FILTER) this.onDeleteGlobalFilter(this.usersStateService.getGlobalFilterForRemove());
      }
    })
    this.getUsersCount();
  }
  onDeleteGlobalFilter(filter) {
    this.usersService.deleteGlobalFilter(filter.id).subscribe(data => {

    })
  }
  getUsersCount() {
    this.usersService.getusersCount().subscribe(data => {
      this.userCount = new UserCount(data);
    })
  }
  public close() {
    this.open = false;
  }

  openPanel() {
    this.onOpenPanel.emit(null);
  }

  public goToState() {
    this.onChangeState.emit('new-users');
  }
  setGlobalFilter(filter) {
    this.selectedGlobalFilter = filter;
    console.log("this.selectedGlobalFilter", this.selectedGlobalFilter);
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
  toggleFilter(event) {
    event.target.parentNode.classList.toggle('show-filter');
  }
  public getGLobalFilters() {
    this.isGetGlobalFilters = true;
    this.showPreloaderGlobalFilters = true;
    this.usersService.getFilters(this.page, false).subscribe((data: any) => {
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
  public goToAll() {
    this.goToState();
    this.onShowAll();
  }
  setShowArchivedCompanies(data) {
    this.filter.setIsArchive(data);
    this.usersStateService.setShowArchivedCompanies(data);
  }
  onSetFilterClientType(data) {
    this.filter.setClientType(data);
    this.usersStateService.onInitFilter(this.filter);
  }
  onShowAll() {
    this.filter.setClientType(null);
    this.setShowArchivedCompanies(false);
    this.usersStateService.onInitFilter(this.filter);
  }
  onShowArchived() {
    this.filter.setClientType(null);
    this.setShowArchivedCompanies(true);
    this.usersStateService.onInitFilter(this.filter);
  }

  public trackByIndex(index, item) {
    return index;
  }
  ngOnDestroy(): void {
    this.leftPanelUsersService.onUnsubscribe();
  }
}
