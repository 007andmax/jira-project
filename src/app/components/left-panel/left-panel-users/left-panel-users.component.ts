import { Component, OnInit, OnDestroy, ChangeDetectorRef, Output, EventEmitter, Input } from '@angular/core';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { UserFilter } from '../../users/class/user-filter';
import { LeftPanelUsersService } from './services/left-panel-users.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { LeftPanelService } from 'src/app/services/left-panel/left-panel.service';
import { UserFilters } from '../../users/class/user-filters';

@Component({
  selector: 'app-left-panel-users',
  templateUrl: './left-panel-users.component.html',
  styleUrls: ['./left-panel-users.component.scss'],
  providers: [LeftPanelUsersService]
})
export class LeftPanelUsersComponent implements OnInit, OnDestroy {
  open: boolean = false;
  filter: UserFilters = new UserFilters();
  @Input() activePage: string = "";
  @Output() onChangeState = new EventEmitter();
  @Output() onGoToLink = new EventEmitter();
  @Output() onOpenPanel = new EventEmitter();
  constructor(private usersStateService: UsersStateService,
    private leftPanelUsersService: LeftPanelUsersService,
    public cd: ChangeDetectorRef,
    private leftPanelService: LeftPanelService,
    private leftPanelStateService: LeftPanelStateService,
  ) { }

  ngOnInit() {
    this.leftPanelStateService.onToggleLeftPanel.subscribe(data => {
      if (data) this.open = false;
    })
    this.leftPanelStateService.onChangeState.subscribe(state => {
      if (!this.leftPanelService.isUsersPage(state)) this.open = false
    })
    this.leftPanelStateService.onFirstOpen.subscribe(data => {
      if (this.leftPanelService.isUsersPage(data)) this.open = true;
    })
    let geLefttFilter = this.usersStateService.getOnFilter().subscribe((data) => {
      this.filter.setData(data);
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

  toggleFilter(event) {
    event.target.parentNode.classList.toggle('show-filter');
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
