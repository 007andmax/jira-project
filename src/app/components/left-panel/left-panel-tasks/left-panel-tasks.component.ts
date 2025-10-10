import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { DELETE_GLOBAL_USERS_FILTER } from 'src/app/const/confirm';
import { LeftPanelService } from 'src/app/services/left-panel/left-panel.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { UsersService } from 'src/app/services/users/users.service';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { UserCount } from '../../users/class/user-count';
import { UserFilters } from '../../users/class/user-filters';
import { UserGlobalFilter } from '../../users/class/user-global-filters';
import { LeftPanelUsersService } from '../left-panel-users/services/left-panel-users.service';
import { TasksFilters } from '../../tasks/class/tasks-filters';
import { CompanySetting } from '../../companies/class/company-setting';
import { TasksStateService } from 'src/app/states/tasks/tasks-state.service';
import { User } from '../../users/class/user';

@Component({
  selector: 'app-left-panel-tasks',
  templateUrl: './left-panel-tasks.component.html',
  styleUrls: ['./left-panel-tasks.component.scss'],
  providers: [LeftPanelUsersService]
})
export class LeftPanelTasksComponent {
  open: boolean = false;
  filter: TasksFilters = new TasksFilters();
  techUsersList = [];
  quickFilter: Array<CompanySetting> = [
    new CompanySetting('Upcoming', 'UPCOMING'),
    new CompanySetting('Overdue', 'OVERDUE')];
  @Input() activePage: string = "";
  sub: Subscription = new Subscription();
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
    private permissionsService: PermissionsService,
    private tasksStateService: TasksStateService
  ) { }

  ngOnInit() {
    let onToggleLeftPanel = this.leftPanelStateService.onToggleLeftPanel.subscribe(data => {
      if (data) this.open = false;
    })
    this.sub.add(onToggleLeftPanel);
    let onChangeState = this.leftPanelStateService.onChangeState.subscribe(state => {
      if (!this.leftPanelService.isTasksPage(state)) {
        this.open = false;
        this.filter = new TasksFilters();
      } else {
        this.initFilterForDashboard();
      }
    })
    this.sub.add(onChangeState);
    let onFirstOpen = this.leftPanelStateService.onFirstOpen.subscribe(data => {
      if (this.leftPanelService.isTasksPage(data)) {
        this.initFilterForDashboard();
        this.open = true;
      }
    })
    this.sub.add(onFirstOpen);
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.onGetTechUsers(data);
    })
    this.sub.add(getOnUsers);
    let getOnGetCurrentuser = this.usersStateService.getOnGetCurrentuser().subscribe((data) => {
      if (this.leftPanelService.isTasksPage(this.activePage) && this.filter.techUser == null) this.initFilterForDashboard();
    })
    this.sub.add(getOnGetCurrentuser);
    let onGetCurrentUser = this.usersStateService.onGetCurrentUser.subscribe(res => {
      if (!this.filter.techUser && this.leftPanelService.isTasksPage(this.activePage)) this.initFilterForDashboard();
    })
    this.sub.add(onGetCurrentUser);
  }
  toggleTechUser(data) {
    this.filter.setTechUser(data);
    this.tasksStateService.onInitFilter(this.filter);
    this.cd.detectChanges();
  }
  setStatus(data) {
    this.filter.setFilter(data ? data.value : null);
    this.tasksStateService.onInitFilter(this.filter);
  }
  onGetTechUsers(data) {
    this.techUsersList = data.filter(item => {
      if (item.accountType === 'TECH' && !item.deletedAt) {
        return item;
      }
    }).sort((a, b) => (`${a.firstName} ${a.lastName}`.toLowerCase() > `${b.firstName} ${b.lastName}`.toLowerCase()) ?
      1 : ((`${b.firstName} ${b.lastName}`.toLowerCase() > `${a.firstName} ${a.lastName}`.toLowerCase()) ? -1 : 0));
  }
  public close() {
    this.open = false;
  }

  openPanel() {
    this.onOpenPanel.emit(null);
  }
  initFilterForDashboard() {
    this.filter.filter = null;
    this.filter.techUser = this.usersStateService.getCurrentUser();
    this.tasksStateService.setFilter(this.filter);
  }
  public goToState(data) {
    if (this.activePage !== data) {
      if (data === 'tasks-dashboard') {
        this.initFilterForDashboard();
      } else {
        this.filter = new TasksFilters();
        this.tasksStateService.setFilter(this.filter);
      }
    }
    this.onChangeState.emit(data);
  }

  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  blockClick(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  toggleFilter(event) {
    event.target.parentNode.classList.toggle('show-filter');
  }


  public trackByIndex(index, item) {
    return index;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.leftPanelUsersService.onUnsubscribe();
  }
  public trackById(index, item) {
    return item.id;
  }
}
