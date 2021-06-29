import { Component, OnInit, OnDestroy, ChangeDetectorRef, Output, EventEmitter, Input } from '@angular/core';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { UserFilter } from '../../users/class/user-filter';
import { LeftPanelUsersService } from './services/left-panel-users.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';

@Component({
  selector: 'app-left-panel-users',
  templateUrl: './left-panel-users.component.html',
  styleUrls: ['./left-panel-users.component.scss'],
  providers: [LeftPanelUsersService]
})
export class LeftPanelUsersComponent implements OnInit, OnDestroy {
  open: boolean = false;
  showArchivedCompanies: boolean = false;
  filter: UserFilter = new UserFilter();
  @Input() activePage: string = "";
  @Output() onChangeState = new EventEmitter();
  @Output() onGoToLink = new EventEmitter();
  @Output() onOpenPanel = new EventEmitter();
  constructor(private usersStateService: UsersStateService,
    private leftPanelUsersService: LeftPanelUsersService,
    public cd: ChangeDetectorRef,
    private leftPanelStateService: LeftPanelStateService,
  ) { }

  ngOnInit() {
    this.leftPanelStateService.onToggleLeftPanel.subscribe(data => {
      if (data) this.open = false;
    })
    this.leftPanelStateService.onChangeState.subscribe(state => {
      if (!this.isUsersPage(state)) this.open = false
    })
    this.leftPanelStateService.onFirstOpen.subscribe(data => {
      if (this.isUsersPage(data)) this.open = true;
    })
  }
  public close() {
    this.open = false;
  }
  isUsersPage(state) {
    return (state === 'new-users')
  }
  openPanel() {
    this.onOpenPanel.emit(null);
  }
  closeMobileFilter() {
    document.body.querySelector('app-left-panel-users').classList.remove('show');
  }
  public goToState() {
    this.onChangeState.emit('new-users');
  }

  toggleFilter(event) {
    event.target.parentNode.classList.toggle('show-filter');
  }

  onSetFilterClientType(data) {
    this.filter.setClientType(data);
    this.usersStateService.onInitFilter(this.filter);
  }
  onShowAll() {
    this.filter.setClientType(null);
    this.usersStateService.setOnShowArchived(false);
    this.showArchivedCompanies = false;
    this.usersStateService.setShowArchivedCompanies(false);
  }
  onShowArchived() {
    this.filter.setClientType(null);
    this.usersStateService.setOnShowArchived(true);
    this.showArchivedCompanies = true;
    this.usersStateService.setShowArchivedCompanies(true);
  }
  public trackByIndex(index, item) {
    return index;
  }
  ngOnDestroy(): void {
    this.leftPanelUsersService.onUnsubscribe();
  }
}
