import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { USERS } from 'src/app/const/emails';
import { LeftPanelService } from 'src/app/services/left-panel/left-panel.service';
import { TagsService } from 'src/app/services/tags/tags.service';
import { UsersService } from 'src/app/services/users/users.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { DraftEmailStateService } from 'src/app/states/draft-email/draft-email-state.service';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { PhoneNumber } from 'src/class/phone-number';
import { CompanySubscriptionStateService } from '../../companies/company-subscription/class/company-subscription-state.service';
import { StatusColor } from '../../tickets/class/status-color';
import { TicketsListService } from '../../tickets/tickets/services/tickets-list.service';
import { User } from '../class/user';
import { UserProfile } from '../class/user-profile';
import { UserValidate } from '../class/user-validate';
import { UsersAsideDetailTicketsComponent } from './users-aside-detail-tickets/users-aside-detail-tickets.component';

@Component({
  selector: 'users-aside-detail',
  templateUrl: './users-aside-detail.component.html',
  styleUrls: ['./users-aside-detail.component.scss'],
  providers: [TicketsListService]
})
export class UsersAsideDetailComponent implements OnInit, OnDestroy {
  user: UserProfile = new UserProfile();
  open: boolean = false;
  toggleEditJobDescription = false;
  showFullJobDescription: boolean = false;
  validate: UserValidate = new UserValidate();
  tab: string = 'tickets';
  companies = [];
  selectedCompany = null;

  @ViewChild('ticketsDetail') ticketsDetail: UsersAsideDetailTicketsComponent;
  sub: Subscription = new Subscription();
  constructor(public ticketsListService: TicketsListService,
    private usersStateService: UsersStateService,
    private usersService: UsersService,
    private tagsService: TagsService,
    public cd: ChangeDetectorRef,
    private leftPanelService: LeftPanelService,
    private ticketsStateService: TicketsStateService,
    private draftEmailStateService: DraftEmailStateService,
    private companySubscriptionState: CompanySubscriptionStateService,
    private companiesStateService: CompaniesStateService,) { }


  ngOnInit() {
    let openDetailAside = this.usersStateService.openDetailAside.subscribe(data => {
      this.usersStateService.setUserForEdit(data);
      this.companySubscriptionState.onEditMode(this.user.subscription);
      this.user.onEdit(data);
      this.tab = 'tickets';
      this.cd.detectChanges();
      if (this.ticketsDetail) {
        this.ticketsDetail.setDefaultScoll();
        this.ticketsDetail.onScroll();
      }
      this.validate.addPhoneNumbers(this.user.phoneNumbers);
      this.selectedCompany = this.companiesStateService.getCompanies().find(item => item.id === this.user.companyId);
      this.open = true;
    })
    this.sub.add(openDetailAside);
    this.leftPanelService.getColors().subscribe((data: any) => {
      let listColors = data.map(item => {
        return new StatusColor(item.backgroundColor, item.borderColor);
      })
      this.ticketsStateService.onColorStatus(listColors);
    })

    if (this.companiesStateService.getCompanies().length > 0) this.getClientsList(this.companiesStateService.getCompanies());
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
      this.getClientsList(data);
    })
  }
  onChangeJobDescription(event) {
    this.user.jobDescription = event.target.value;
  }
  onCheckEmail() {
    if (this.user.primaryEmail && this.user.primaryEmail.length > 0) this.validate.checkValidPrimaryEmail(this.user.primaryEmail);
    if (this.user.primaryEmail && this.user.primaryEmail.length > 0 && this.selectedCompany) this.onCheckValidPrimaryEmail();

  }
  onCheckPhoneNumber(i) {
    this.validate.checkValidPhoneNumber(i, this.user.phoneNumbers[i].number);

  }
  onUpdatePhoneNumber() {
    if (this.validate.isValidate(this.user)) this.updateUser();
  }
  onCheckValidPrimaryEmail() {
    this.usersService.checkValidPrimaryEmail(this.user.primaryEmail, this.selectedCompany.id, this.user.id).subscribe((data: any) => {

      this.validate.setExistPrimaryContactEmail(data.value);
      if (this.validate.isValidate(this.user)) this.updateUser();

      this.cd.detectChanges();
    })
  }
  onSelectCompany(data) {
    this.selectedCompany = data;
    this.user.serCompanyId(data.id);
    this.updateUser();
  }
  getClientsList(data) {
    this.companies = data.filter(item => item.accountType === 'CLIENT' && !item.deletedAt).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
  }
  getJobDescription(val) {
    let value = val;
    if (val && val.length >= 120 && !this.showFullJobDescription) return value.substring(0, 120);
    return val;
  }
  public showAsideForDraftEmail() {
    this.draftEmailStateService.setAction(USERS);
    this.draftEmailStateService.resetSelectedUsers();
    this.draftEmailStateService.addSelectedUser(this.user);
    this.draftEmailStateService.toggleAsideForAdd();
  }
  onChangeTags(data) {
    let ids = data.map(item => {
      return { id: item.id }
    });
    this.tagsService.setTagsUser(this.user.id, ids).subscribe(data => {

    })
  }
  setTab(data) {
    this.tab = data;
  }
  close() {
    this.open = false;
    this.showFullJobDescription = false;
    this.usersStateService.hideDetailUser();
    this.validate = new UserValidate();
  }

  updateUser() {
    this.usersService.updateUser(this.user.getUserForUpdate(this.usersStateService.getuserForEdit())).subscribe(data => {

    })
  }
  onChangeSubscriptions(data) {
    let subscription = {
      id: this.usersStateService.getuserForEdit().subscription.id,
      invoice: true,
      ticket: true,
      ticketManager: true,
    }
    data.forEach(item => subscription[item.field] = item.selected);
    this.usersService.setSubscriptions(subscription).subscribe(res => {

    })
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
