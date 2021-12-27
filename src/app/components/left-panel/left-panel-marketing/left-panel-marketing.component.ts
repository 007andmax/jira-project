import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { UserCustomSubscription } from '../../users/class/user-custom-subscription';
import { UserFilter } from '../../users/class/user-filter';
import { LeftPanelUsersService } from '../left-panel-users/services/left-panel-users.service';

@Component({
  selector: 'left-panel-marketing',
  templateUrl: './left-panel-marketing.component.html',
  styleUrls: ['./left-panel-marketing.component.scss'],
  providers: [LeftPanelUsersService]
})
export class LeftPanelMarketingComponent implements OnInit {
  open: boolean = false;
  filter: UserFilter = new UserFilter();
  listCustomSubscription: Array<UserCustomSubscription> = [];
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
      if (!this.isMarketingPage(state)) this.open = false
    })
    this.leftPanelStateService.onFirstOpen.subscribe(data => {
      if (this.isMarketingPage(data)) this.open = true;
    })
    this.listCustomSubscription = this.usersStateService.getListCustomSubscription();
    this.usersStateService.onGetListCustomSubscription.subscribe(data => {
      this.listCustomSubscription = data;
      this.listCustomSubscription.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
        1 : (b.name.toLowerCase() > a.name.toLowerCase() ? -1 : 0));
    })
    this.usersStateService.getOnFilter().subscribe((data) => {

      this.filter.setLeftFilters(data.clientType, data.company, data.clientIndustry, data.title, data.defaultSubscriptions, data.customSubscriptions);

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
  isMarketingPage(state) {
    return (state === 'marketing')
  }
  openPanel() {
    this.onOpenPanel.emit(null);
  }
  closeMobileFilter() {
    document.body.querySelector('app-left-panel-users').classList.remove('show');
  }
  public goToState() {
    this.onChangeState.emit('marketing');
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

}
