import { Component, OnInit, ElementRef, ChangeDetectorRef, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { TicketsFilter } from '../../class/tickets-filter';
import { Company } from 'src/app/interfaces/company/company';
import { TicketsCounts } from '../../class/tickets-counts';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { LeftPanelService } from 'src/app/services/left-panel/left-panel.service';
import { ItemStatus } from 'src/app/components/tickets/class/item-status';
import { Subscribable, Subscription } from 'rxjs';
import { TagsRealTimeService } from 'src/app/states/tags/tags-real-time.service';
import { AppService } from 'src/app/states/app/app.service';
import { TicketsFilterTagsComponent } from './tickets-filter-tags/tickets-filter-tags.component';
import { StatusColor } from '../../../class/status-color';
import { TicketStatus } from 'src/app/components/setting/ticket-settings-page/tickets-status/class/ticket-status';
import { TicketStatusFilter } from '../class/ticket-status-filter';
import { CompanyDropDownComponent } from 'src/app/components/shared/company-drop-down/company-drop-down.component';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { TicketGlobalFilter } from '../../class/ticket-global-filter';
import { TagsStateService } from 'src/app/states/tags/tags-state.service';
import { CompanyTag } from 'src/app/components/companies/company-tags/class/company-tag';
import { User } from 'src/app/components/users/class/user';
import { TicketsFilterSaveComponent } from '../tickets-filter-save/tickets-filter-save.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TicketsFilterStatusComponent } from './tickets-filter-status/tickets-filter-status.component';

@Component({
  selector: 'app-tickets-filter',
  templateUrl: './tickets-filter.component.html',
  styleUrls: ['./tickets-filter.component.scss']
})
export class TicketsFilterComponent implements OnInit, OnDestroy {
  @ViewChild('usersDp') usersDp: DropDownComponent;
  @ViewChild('companyDp') companyDp: CompanyDropDownComponent;
  @ViewChild('techUsersDp') techUsersDp: DropDownComponent;
  @ViewChild('statusDp') statusDp: DropDownComponent;
  @ViewChild('tagsDp') tagsDp: TicketsFilterTagsComponent;
  @ViewChild('filterStatus') filterStatus: TicketsFilterStatusComponent;
  public ticketsFilter: TicketsFilter = new TicketsFilter();
  globalFilter: TicketGlobalFilter = new TicketGlobalFilter();
  listType: string = "USERS";
  public selectedCompany: Company = null;
  selectedTechUser: string = null;
  selectedStatus: string = null;
  selectedUser: string = null;
  users = [];
  techUsersList = [];
  techUsersNamesList = [];
  listsStatus = [new ItemStatus('Unassigned', 'unassigned', 'UNASSIGNED'),
  new ItemStatus('Completed', 'completed', 'CLOSED'),
  new ItemStatus('In Progress', 'inProgress', 'OPEN'),
  new ItemStatus('On Hold', 'onHold', 'ON_HOLD')];
  ticketsStatus: Array<TicketStatusFilter> = [];
  blockFilterUser: boolean = false;
  ticketsCounts: TicketsCounts;
  sub: Subscription = new Subscription();
  @Output() onClose = new EventEmitter();
  @Output() changeCountFilter = new EventEmitter<any>();
  constructor(private ticketsStateService: TicketsStateService,
    private companiesState: CompaniesStateService,
    private ticketsService: TicketsService,
    private usersStateService: UsersStateService,
    private modalService: NgbModal,
    public cd: ChangeDetectorRef,
    public appService: AppService,
    private customerPortalStateService: CustomerPortalStateService,
    public tagsStateService: TagsStateService,
    private leftPanelService: LeftPanelService) { }



  ngOnInit() {
    /* CAUSTOM LOGIC FOR COUNTS TICKETS - We will need to remove this logic once we will completely remove the angularJS framework. */
    /* START */
    if (this.customerPortalStateService.isCustomerPortal && this.companiesState.getCompanies().length > 0) this.checkCompanyCustomerUser();
    let getOnCompanies = this.companiesState.getOnCompanies().subscribe((data) => {
      if (this.customerPortalStateService.isCustomerPortal) this.checkCompanyCustomerUser();
      //this.getCount();
    })
    this.sub.add(getOnCompanies);
    let onTicketFilters = this.customerPortalStateService.onTicketFilters.subscribe(data => {
      this.checkCompanyCustomerUser();
      this.checkUserCustomerUser();
      //  this.getCount();
    });
    this.sub.add(onTicketFilters);
    this.listType = this.ticketsStateService.getListType();
    this.ticketsFilter.setListType(this.listType);
    /* END */
    let getOnChangeTypeFilter = this.ticketsStateService.getOnChangeTypeFilter().subscribe(type => {
      this.listType = type;
      this.ticketsFilter.setListType(type);
      console.log("getOnChangeTypeFilter", this.listType);
      this.ticketsStateService.onInitFilter(this.ticketsFilter);
      if (type !== 'RECURRING_TICKETS') this.getCount();
    })
    this.sub.add(getOnChangeTypeFilter);
    let getOnChangeTagsFilter = this.ticketsStateService.getOnChangeTagsFilter().subscribe(tags => {
      this.ticketsFilter.setTags(tags);
      console.log("getOnChangeTagsFilter", this.ticketsFilter);
      this.ticketsStateService.onInitFilter(this.ticketsFilter);
      this.getCount();
    });
    this.sub.add(getOnChangeTagsFilter);
    if (this.usersStateService.getAllUsers().length > 0) this.onGetTechUsers(this.usersStateService.getAllUsers());
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.onGetTechUsers(data);
    })
    this.sub.add(getOnUsers);
    //    this.getCounts();

    let getOnUpdateCounts = this.ticketsStateService.getOnUpdateCounts().subscribe(data => {
      this.ticketsCounts = new TicketsCounts(data);
      this.ticketsStateService.onInitCount(this.ticketsCounts[(this.listType === 'USERS') ? 'USER' : this.listType]);
      this.cd.detectChanges();
    })
    this.sub.add(getOnUpdateCounts);
    this.getTicketsStatus();
    let onGetTicketsStatus = this.ticketsStateService.onGetTicketsStatus.subscribe(data => {
      this.getTicketsStatus();
      if (this.globalFilter.id) this.getCountsStatus();
    })
    this.sub.add(onGetTicketsStatus);
    let onInitGlobalFilter = this.ticketsStateService.onInitGlobalFilter.subscribe((data: TicketGlobalFilter) => {
      console.log("onInitGlobalFilter", data);
      this.globalFilter = data;
      this.selectedCompany = this.companiesState.getCompanies().find(item => item.id == data.clientCompanyId);
      if (this.selectedCompany) {
        this.companyDp.selectItemWithOutChanges(this.companiesState.getCompanies().find(item => item.id == data.clientCompanyId));
        this.ticketsFilter.setCompany(this.companiesState.getCompanies().find(item => item.id == data.clientCompanyId));
      } else {
        this.companyDp.clearWithOutChanges();
        this.selectedCompany = null;
        this.ticketsFilter.setCompany(null);
        this.users = [];
      }

      let createdUser: User = this.usersStateService.getAllUsers().find(item => data.createdUserId == item.id);
      if (createdUser) {
        this.selectedUser = `${createdUser.firstName} ${createdUser.lastName}`;
        this.usersDp.selectItemWithOutChanges(this.selectedUser);
        this.ticketsFilter.setUser(createdUser);
      } else {
        this.usersDp.clearWithOutChanges();
        this.ticketsFilter.setUser(null);
        this.selectedUser = null;
      }
      let techUser: User = this.usersStateService.getAllUsers().find(item => data.assignedUsersIds.some(userId => userId == item.id));
      if (techUser) {
        this.selectedTechUser = `${techUser.firstName} ${techUser.lastName}`;
        this.techUsersDp.selectItemWithOutChanges(this.selectedTechUser);
        this.ticketsFilter.setTechUser(techUser);
      } else {
        this.techUsersDp.clearWithOutChanges();
        this.ticketsFilter.setTechUser(null);
        this.selectedTechUser = null;
      }
      let status = this.ticketsStatus.find(item => item.id == data.statusId);
      this.ticketsStatus.forEach(item => item.selected = false);
      if (status) {
        status.selected = true;
        this.ticketsFilter.setStatus(status.name);
        let findStatus = this.listsStatus.find(status => status.title === status.title);
        if (findStatus) {
          this.ticketsFilter.setCustomStatus(false);
          this.setTypeFilterWithoutChange(findStatus.status);
        } else {
          this.ticketsFilter.setCustomStatus(true);
          this.setTypeFilterWithoutChange("OPEN");
        }
      } else {
        this.ticketsFilter.setStatus(null);
        this.ticketsFilter.setCustomStatus(false);
      }
      let tags = this.tagsStateService.getTags().filter(item => data.tagIds.some(tagId => tagId == item.id)).map(item => new CompanyTag(item));
      if (tags.length > 0) {
        this.tagsDp.selectedTag = tags;
        this.ticketsFilter.setTags(tags);
      } else {
        this.ticketsFilter.setTags([]);
        this.tagsDp.clearWithOutChanges();
      }
      this.setTypeFilterWithoutChange("ALL");
      console.log("this.ticketsFilter 1", this.ticketsFilter);
      this.ticketsStateService.onInitFilter(this.ticketsFilter);
      this.getCount();
      this.onChangeCounterFilter();
      if (this.ticketsStatus.length > 0) this.getCountsStatus();
    })
    this.sub.add(onInitGlobalFilter);
    let onGetGlobalFilters = this.ticketsStateService.onGetGlobalFilters.subscribe(data => {
      if (!data.find(item => item.id == this.globalFilter.id)) {
        this.globalFilter = new TicketGlobalFilter();
        if (this.ticketsFilter.checkUse()) this.onClearAll();
      }
    })
    this.sub.add(onGetGlobalFilters);
  }
  private getTicketsStatus() {
    this.ticketsStatus = this.ticketsStateService.getTicketsStatus().map(item => new TicketStatusFilter(item)).sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ?
      1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0));
  }
  private getCountsStatus() {
    this.ticketsService.getCounts(this.ticketsFilter.getDataForStatusCounts(this.ticketsStatus)).subscribe(counts => {
      console.log("counts", counts);
      for (const key in counts) {
        let index = this.ticketsStatus.findIndex(item => item.name == key);
        if (index > -1) this.ticketsStatus[index].setCount(counts[key])
      }
    })
  }
  private checkCompanyCustomerUser() {
    this.ticketsFilter = this.customerPortalStateService.getTicketsFilter();
    this.selectedCompany = this.companiesState.getCompanies().find(item => item.id == localStorage.getItem('company_info_id'));
    this.companyDp.selectItemWithOutChanges(this.selectedCompany);
    this.companyDp.isDisabled = true;
    this.ticketsFilter.isDisbledCompany = true;
    this.onGetUsers(this.usersStateService.getAllUsers().filter(user => user.customerCompaniesInfo.find(clientCompany => clientCompany.companyId === this.selectedCompany.id)));
  }
  private checkUserCustomerUser() {
    let customerCompanyInfo = this.usersStateService.getCurrentUser().customerCompaniesInfo.find(item => item.companyId === localStorage.getItem('company_info_id'));
    if (customerCompanyInfo && customerCompanyInfo.customerUserRole.getPermission('VIEW_MY_TICKETS') && !customerCompanyInfo.customerUserRole.getPermission('VIEW_ALL_TICKETS')) {
      let user = this.usersStateService.getAllUsers().find(item => item.id === this.usersStateService.getCurrentUser().id);
      this.selectedUser = `${user.firstName} ${user.lastName}`;
      this.usersDp.selectItemWithOutChanges(this.selectedUser);
      this.usersDp.isDisabled = true;
    } else {
      this.usersDp.clearWithOutChanges();
    }
  }
  public onClearAll() {

    if (!this.ticketsFilter.isDisbledCompany) this.ticketsFilter.setCompany(null);
    this.ticketsFilter.setTechUser(null);
    this.ticketsFilter.setUser(null);
    if (this.ticketsFilter.selectedStatus) {
      this.listType = "ALL";
      this.ticketsFilter.setListType("ALL");
    }
    this.ticketsFilter.setStatus(null);
    this.ticketsFilter.setTags([]);
    this.usersDp.clearWithOutChanges();
    if (!this.ticketsFilter.isDisbledCompany) this.companyDp.clearWithOutChanges();
    this.techUsersDp.clearWithOutChanges();
    if (this.statusDp) this.statusDp.clearWithOutChanges();
    this.tagsDp.clearWithOutChanges();
    this.ticketsFilter.setCustomStatus(false);
    //  this.listType = "ALL";
    // this.ticketsFilter.setListType("ALL");
    console.log("onClearAll", this.ticketsFilter)
    this.ticketsStateService.onInitFilter(this.ticketsFilter);
    this.onChangeCounterFilter();
    if (this.listType !== 'RECURRING_TICKETS') this.getCount();
    this.ticketsStateService.onChangeLeftPanelFilter(this.listType);
    if (this.appService.checkMobile()) this.close();
  }

  public onChangeCounterFilter() {
    let count = 0;
    if (this.ticketsFilter.selectedCompany) count++;
    if (this.ticketsFilter.selectedTechUser) count++;
    if (this.ticketsFilter.selectedUser) count++;
    if (this.ticketsFilter.selectedStatus) count++;
    this.changeCountFilter.emit(count);
  }
  private getCount() {
    this.ticketsService.getCount(this.ticketsFilter.getDataForRequest()).subscribe(data => {
      this.ticketsStateService.onInitCount(data);
    })
  }
  getCountByField(field) {
    return (this.ticketsCounts) ? this.ticketsCounts[field] : 0;
  }
  close() {
    this.onClose.emit(null);
  }
  saveFilter() {
    const modalRef = this.modalService.open(TicketsFilterSaveComponent, { windowClass: 'xs-modal user-modal', container: "app-tickets", backdrop: 'static', keyboard: false });
    modalRef.componentInstance.globalFilter = new TicketGlobalFilter(JSON.parse(JSON.stringify(this.globalFilter)));
    this.cd.detectChanges();
  }
  public setTypeFilterWithoutChange(type) {
    this.listType = type;
    this.ticketsFilter.setListType(type);
  }
  public setTypeFilter(type) {
    this.listType = type;
    this.ticketsFilter.setListType(type);
    if (!this.appService.checkMobile()) {
      console.log("setTypeFilter 3", this.ticketsFilter);
      this.ticketsStateService.onInitFilter(this.ticketsFilter);
      if (type !== 'RECURRING_TICKETS') this.getCount();
    }
  }

  public onGetUsers(data) {
    this.users = data.filter(item => {
      if (item.accountType !== 'TECH' && !item.deletedAt) {
        return item;
      }
    });
  }
  onGetTechUsers(data) {
    if (this.customerPortalStateService.isCustomerPortal) this.checkUserCustomerUser();
    this.techUsersList = data.filter(item => {
      if (item.accountType === 'TECH' && !item.deletedAt) {
        return item;
      }
    });
    this.techUsersNamesList = this.getTechUserList();
  }
  public onSelectCompany(item) {

    this.blockFilterUser = true;
    this.usersDp.clearClient();
    if (!item) {
      this.ticketsFilter.setCompany(null);
      this.users = [];
      this.globalFilter.setClientCompanyId(null);
    } else {
      this.globalFilter.setClientCompanyId(item.id);
      this.ticketsFilter.setCompany(item);
      this.selectedCompany = null;
      this.onGetUsers(this.usersStateService.getAllUsers().filter(user => user.customerCompaniesInfo.find(clientCompany => clientCompany.companyId === item.id)));
      //  this.filter.setCompany(item.id);
      //  this.usersStateService.onInitFilter(this.filter);

    }
  }
  public onSelectTechUser(item) {

    if (!item) {
      this.ticketsFilter.setTechUser(null);
      this.globalFilter.setAssignedUsersIds([]);
    } else {
      this.selectedTechUser = null;

      //  this.filter.setCompany(item.id);
      //  this.usersStateService.onInitFilter(this.filter);
      let indexTechUser = this.techUsersList.findIndex(user => `${user.firstName} ${user.lastName}` === item);
      if (indexTechUser > -1) {
        this.ticketsFilter.setTechUser(this.techUsersList[indexTechUser]);
        this.globalFilter.setAssignedUsersIds([this.techUsersList[indexTechUser].id]);
      }
    }
  }

  public onSelectStatus(item, event) {
    console.log("onSelectStatus", item);
    if (!event.target.checked) {
      item.selected = false;
      this.setTypeFilterWithoutChange("ALL");
      this.ticketsFilter.setStatus(null);
      this.ticketsFilter.setCustomStatus(false);
      this.globalFilter.setStatusId(null);
    } else {
      item.selected = true;
      this.ticketsFilter.setStatus(item.name);
      this.globalFilter.setStatusId(item.id);
      let findStatus = this.listsStatus.find(status => status.title === item.title);
      if (findStatus) {
        this.ticketsFilter.setCustomStatus(false);
        this.setTypeFilterWithoutChange(findStatus.status);
      } else {
        this.ticketsFilter.setCustomStatus(true);
        this.setTypeFilterWithoutChange("OPEN");
      }
      this.ticketsStatus.forEach(status => {
        if (status.id != item.id) status.selected = false;
      })
    }
  }
  public onSelectUser(item) {

    if (!item) {
      this.ticketsFilter.setUser(null);
      this.globalFilter.setCreatedUserId(null);
    } else {
      this.selectedUser = null;

      //  this.filter.setCompany(item.id);
      //  this.usersStateService.onInitFilter(this.filter);
      let indexhUser = this.users.findIndex(user => `${user.firstName} ${user.lastName}` === item);
      if (indexhUser > -1) {
        this.ticketsFilter.setUser(this.users[indexhUser]);
        this.globalFilter.setCreatedUserId(this.users[indexhUser].id);
      }
    }
    this.blockFilterUser = false;
  }

  onChangeTags(tags) {
    //   this.ticketsStateService.onChangeTagsFilter(tags);
    this.ticketsFilter.setTags(tags);
    this.globalFilter.setTagIds(tags.map(item => (item.id)));
  }

  applyFilters() {
    this.setTypeFilterWithoutChange("ALL");
    console.log("applyFilters", this.ticketsFilter);
    this.ticketsStateService.onInitFilter(this.ticketsFilter);
    if (this.listType !== 'RECURRING_TICKETS') this.getCount();
    this.ticketsStateService.onChangeLeftPanelFilter("ALL");
    this.onChangeCounterFilter();
    this.close();
    this.getCountsStatus();
  }
  getTechUserList() {
    return this.techUsersList.map(item => {
      return `${item.firstName} ${item.lastName}`
    }).sort((a, b) => (a.toLowerCase() > b.toLowerCase()) ?
      1 : ((b.toLowerCase() > a.toLowerCase()) ? -1 : 0));
  }
  getUserList() {
    return this.users.map(item => {
      return `${item.firstName} ${item.lastName}`
    }).sort((a, b) => (a.toLowerCase() > b.toLowerCase()) ?
      1 : ((b.toLowerCase() > a.toLowerCase()) ? -1 : 0));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  public trackByIndex(index, item) {
    return index;
  }
}
