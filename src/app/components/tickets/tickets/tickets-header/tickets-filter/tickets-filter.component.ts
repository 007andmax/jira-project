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
import { TicketsPriority } from 'src/app/components/setting/ticket-settings-page/tickets-priority/class/tickets-priority';
import { TicketsFilterDropDownComponent } from './tickets-filter-drop-down/tickets-filter-drop-down.component';
import { TicketsFilterCompaniesDropDownComponent } from './tickets-filter-companies-drop-down/tickets-filter-companies-drop-down.component';
import * as moment from "moment";
import { TicketsFilterCreatedDropDownComponent } from './tickets-filter-created-drop-down/tickets-filter-created-drop-down.component';
import { TitleListType } from '../class/title-list-type';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';

@Component({
  selector: 'app-tickets-filter',
  templateUrl: './tickets-filter.component.html',
  styleUrls: ['./tickets-filter.component.scss']
})
export class TicketsFilterComponent implements OnInit, OnDestroy {
  @ViewChild('usersDp', { static: true }) usersDp: TicketsFilterDropDownComponent;
  @ViewChild('companyDp', { static: true }) companyDp: TicketsFilterCompaniesDropDownComponent;
  @ViewChild('techUsersDp', { static: true }) techUsersDp: TicketsFilterDropDownComponent;
  @ViewChild('priorityDp', { static: true }) priorityDp: TicketsFilterDropDownComponent;
  @ViewChild('tagsDp', { static: true }) tagsDp: TicketsFilterTagsComponent;
  @ViewChild('filterStatus', { static: true }) filterStatus: TicketsFilterStatusComponent;
  @ViewChild('datesDp', { static: true }) datesDp: TicketsFilterCreatedDropDownComponent;
  public ticketsFilter: TicketsFilter = new TicketsFilter();
  globalFilter: TicketGlobalFilter = new TicketGlobalFilter();
  listType: string = "USERS";
  selectedTechUser: string = null;
  selectedStatus: string = null;
  selectedUser: string = null;
  users = [];
  techUsersList = [];
  listsStatus = [new ItemStatus('Unassigned', 'unassigned', 'UNASSIGNED'),
  new ItemStatus('Completed', 'completed', 'CLOSED'),
  new ItemStatus('In Progress', 'inProgress', 'OPEN'),
  new ItemStatus('On Hold', 'onHold', 'ON_HOLD')];
  ticketPriorities: Array<TicketsPriority> = [];
  ticketsStatus: Array<TicketStatusFilter> = [];
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
    public customerPortalStateService: CustomerPortalStateService,
    private leftPanelStateService: LeftPanelStateService,
    public tagsStateService: TagsStateService) { }



  ngOnInit() {
    /* CAUSTOM LOGIC FOR COUNTS TICKETS - We will need to remove this logic once we will completely remove the angularJS framework. */
    /* START */
    if (this.customerPortalStateService.isCustomerPortal && this.companiesState.getCompanies().length > 0) this.checkCompanyCustomerUser();
    let getOnCompanies = this.companiesState.getOnCompanies().subscribe((data) => {
      if (this.customerPortalStateService.isCustomerPortal) this.checkCompanyCustomerUser();
    })
    this.sub.add(getOnCompanies);
    let onTicketFilters = this.customerPortalStateService.onTicketFilters.subscribe(data => {
      this.checkCompanyCustomerUser();
      this.checkUserCustomerUser();
    });
    this.sub.add(onTicketFilters);
    this.listType = this.ticketsStateService.getListType();
    this.ticketsFilter.setListType(this.listType);
    /* END */
    let getOnChangeTypeFilter = this.ticketsStateService.getOnChangeTypeFilter().subscribe(type => {
      this.listType = type;
      this.ticketsFilter = new TicketsFilter();
      this.datesDp.clearWithOutChanges();
      this.usersDp.clearWithOutChanges();
      if (!this.ticketsFilter.isDisbledCompany) this.companyDp.clearWithOutChanges();
      this.techUsersDp.clearWithOutChanges();
      this.tagsDp.clearWithOutChanges();
      this.priorityDp.clearWithOutChanges();
      this.ticketsFilter.setSortBy(null);
      this.ticketsFilter.setListType(type);
      this.ticketsStatus.forEach(item => item.selected = false);
      this.ticketsStateService.onInitFilter(this.ticketsFilter);
      if (type !== 'RECURRING_TICKETS') this.getCount();
    })
    this.sub.add(getOnChangeTypeFilter);
    let getOnChangeTagsFilter = this.ticketsStateService.getOnChangeTagsFilter().subscribe(tags => {
      this.ticketsFilter.setTags(tags);
      this.ticketsStateService.onInitFilter(this.ticketsFilter);
      this.getCount();
    });
    this.sub.add(getOnChangeTagsFilter);
    if (this.usersStateService.getAllUsers().length > 0) {
      this.onGetTechUsers(this.usersStateService.getAllUsers());
      this.onGetUsers();
    }
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.onGetTechUsers(data);
      this.onGetUsers();
    })
    this.sub.add(getOnUsers);
    let getOnUpdateCounts = this.ticketsStateService.getOnUpdateCounts().subscribe(data => {
      this.ticketsCounts = new TicketsCounts(data);
      this.ticketsStateService.onInitCount(this.ticketsCounts[(this.listType === 'USERS') ? 'USER' : this.listType]);
      this.cd.detectChanges();
    })
    this.sub.add(getOnUpdateCounts);
    this.getTicketsStatus();
    this.getTicketPriority();
    let onGetTicketsStatus = this.ticketsStateService.onGetTicketsStatus.subscribe(data => {
      this.getTicketsStatus();
      if (this.globalFilter.id) this.getCountsStatus();
    })
    this.sub.add(onGetTicketsStatus);
    let onInitGlobalFilter = this.ticketsStateService.onInitGlobalFilter.subscribe((data: TicketGlobalFilter) => {
      this.globalFilter = new TicketGlobalFilter(JSON.parse(JSON.stringify(data)));
      let selectedCompanies: Array<Company> = this.companiesState.getCompanies().filter(item => data.clientCompanyIds.some(companyId => companyId == item.id));
      if (selectedCompanies.length > 0) {
        this.companyDp.selectedItems = selectedCompanies;
        this.onSelectCompany(selectedCompanies);
      } else if (!this.ticketsFilter.isDisbledCompany) {
        this.companyDp.clearWithOutChanges();
        this.onSelectCompany([]);
      }

      let createdUser: Array<User> = this.usersStateService.getAllUsers().filter(item => data.createdUserIds.some(userId => userId == item.id));
      if (createdUser.length > 0) {
        this.usersDp.selectedTag = createdUser;
        this.onSelectUser(createdUser);
      } else {
        this.usersDp.clearWithOutChanges();
        this.onSelectUser([]);
      }
      let techUser: Array<User> = this.usersStateService.getAllUsers().filter(item => data.assignedUsersIds.some(userId => userId == item.id));
      if (techUser.length > 0) {
        this.techUsersDp.selectedTag = techUser;
        this.onSelectTechUser(techUser);
      } else {
        this.techUsersDp.clearWithOutChanges();
        this.onSelectTechUser([]);
      }
      let status = this.ticketsStatus.filter(item => data.statusIds.some(statusId => statusId == item.id));
      this.ticketsStatus.forEach(item => item.selected = false);
      if (status.length > 0) {
        status.forEach(item => item.selected = true);
        this.ticketsFilter.setStatus(status);
        this.globalFilter.setStatusIds(status.map(item => item.id));
        let findStatus = this.listsStatus.find(statusElemt => status.some(item => item.title === statusElemt.title));
        if (findStatus) {
          this.ticketsFilter.setCustomStatus(false);
          this.setTypeFilterWithoutChange(findStatus.status);
        } else {
          this.ticketsFilter.setCustomStatus(true);
          this.setTypeFilterWithoutChange("OPEN");
        }
      } else {
        this.ticketsFilter.setStatus([]);
        this.globalFilter.setStatusIds([]);
        this.ticketsFilter.setCustomStatus(false);
      }
      let tags = this.tagsStateService.getTags().filter(item => data.tagIds.some(tagId => tagId == item.id)).map(item => new CompanyTag(item));
      if (tags.length > 0) {
        this.tagsDp.selectedTag = tags;
        this.onChangeTags(tags);
      } else {
        this.onChangeTags([]);
        this.tagsDp.clearWithOutChanges();
      }
      let priorityLevel = this.ticketPriorities.filter(item => data.priorityIds.some(priorityId => priorityId == item.id));
      if (priorityLevel.length > 0) {
        this.priorityDp.selectedTag = priorityLevel;
        this.onSelectPriority(priorityLevel);
      } else {
        this.onSelectPriority([]);
        this.priorityDp.clearWithOutChanges();
      }
      if (data.customDateRange) {
        this.onSelectCustomDateRange(data.customDateRange);
        this.datesDp.selectItemWithOutChanges(this.datesDp.list.find(item => item.type == data.customDateRange));
      } else if (data.startDate && data.endDate) {
        this.onSelectDates({ start: data.startDate, end: data.endDate });
        this.datesDp.selectItemWithOutChanges(new TitleListType('Custom Date range', 'CUSTOM'));
        this.datesDp.changeSelectedDateModel(data.startDate, data.endDate);
      } else {
        this.datesDp.clearWithOutChanges();
        this.ticketsFilter.clearDates();
        this.ticketsFilter.setCustomDateRange(null);
      }
      this.setTypeFilterWithoutChange("ALL");
      this.ticketsStateService.onInitFilter(this.ticketsFilter);
      this.getCount();
      this.onChangeCounterFilter();
      if (this.ticketsStatus.length > 0 && this.globalFilter.isUseFilters()) this.getCountsStatus();
      if (this.ticketsStatus.length > 0 && !this.globalFilter.isUseFilters()) this.clearCountsStatus();
    })
    this.sub.add(onInitGlobalFilter);
    /* let onGetGlobalFilters = this.ticketsStateService.onGetGlobalFilters.subscribe(data => {
       if (!data.find(item => item.id == this.globalFilter.id)) {
         this.globalFilter = new TicketGlobalFilter();
         if (this.ticketsFilter.checkUse()) this.onClearAll();
       }
     })
     this.sub.add(onGetGlobalFilters);*/
    let onChangeFilterField = this.ticketsStateService.onChangeFilterField.subscribe(data => {
      this.ticketsFilter.onFilter(data);
      this.applyFilters();
    })
    this.sub.add(onChangeFilterField);
  }
  /**
* @description Reset count status list
*/
  private clearCountsStatus() {
    this.ticketsStatus.forEach(item => item.setCount(0));
  }
  /**
* @description Get list status and sort
*/
  private getTicketsStatus() {
    this.ticketsStatus = this.ticketsStateService.getTicketsStatus().map(item => new TicketStatusFilter(item)).sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ?
      1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0));
  }
  /**
* @description Init request to get counts 
*/
  private getCountsStatus() {
    this.ticketsService.getCounts(this.ticketsFilter.getDataForStatusCounts(this.ticketsStatus)).subscribe(counts => {
      for (const key in counts) {
        let index = this.ticketsStatus.findIndex(item => item.name == key);
        if (index > -1) this.ticketsStatus[index].setCount(counts[key])
      }
    })
  }
  /**
* @description Init request to get priorites list
*/
  getTicketPriority() {
    if (this.ticketsStateService.getTicketsPriorities().length === 0) {
      this.ticketsService.getTicketsPriorities().subscribe((data: any) => {
        this.ticketPriorities = data.priorityLevels.map(item => new TicketsPriority(item)).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
          1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
        this.ticketsStateService.onSetTicketsPriorities(this.ticketPriorities);
        this.priorityDp.list = this.ticketPriorities;
      })
    } else {
      this.ticketPriorities = this.ticketsStateService.getTicketsPriorities();
      this.priorityDp.list = this.ticketPriorities;
    }
  }
  /**
* @description Get filters tickets and disabled company dropdown
*/
  private checkCompanyCustomerUser() {
    this.ticketsFilter = this.customerPortalStateService.getTicketsFilter();
    let selectedCompanies = [this.companiesState.getCompanies().find(item => item.id == localStorage.getItem('company_info_id'))];
    this.companyDp.selectItemsWithOutChanges(selectedCompanies);
    this.companyDp.isDisabled = true;
    this.companyDp.setRemovable(false);
    this.ticketsFilter.isDisbledCompany = true;
    this.onChangeCounterFilter();
    this.onGetUsers();
  }
  /**
* @description Check if use customer use and disable user dropdown
*/
  private checkUserCustomerUser() {
    let customerCompanyInfo = this.usersStateService.getCurrentUser().customerCompaniesInfo.find(item => item.companyId === localStorage.getItem('company_info_id'));
    if (customerCompanyInfo && customerCompanyInfo.customerUserRole.getPermission('VIEW_MY_TICKETS') && !customerCompanyInfo.customerUserRole.getPermission('VIEW_ALL_TICKETS')) {
      let users = this.usersStateService.getAllUsers().filter(item => item.id === this.usersStateService.getCurrentUser().id);
      this.usersDp.selectedTag = users;
      this.onSelectUser(users);
      this.usersDp.isDisabled = true;
    } else {
      this.usersDp.clearWithOutChanges();
    }
  }
  /**
* @description Clear all dropdown and "ticketsFilter"
*/
  public onClearAll() {

    if (!this.ticketsFilter.isDisbledCompany) this.ticketsFilter.setCompanies([]);
    this.ticketsFilter.setTechUsers([]);
    this.ticketsFilter.setUsers([]);
    this.ticketsFilter.clearDates();
    this.ticketsFilter.setCustomDateRange(null);
    this.datesDp.clearWithOutChanges();
    if (this.ticketsFilter.selectedStatus.length > 0) {
      this.listType = "ALL";
      this.ticketsFilter.setListType("ALL");
    }
    this.ticketsFilter.setStatus([]);
    this.ticketsFilter.setTags([]);
    this.usersDp.clearWithOutChanges();
    if (!this.ticketsFilter.isDisbledCompany) this.companyDp.clearWithOutChanges();
    this.techUsersDp.clearWithOutChanges();
    this.tagsDp.clearWithOutChanges();
    this.ticketsFilter.setCustomStatus(false);
    this.ticketsStateService.onInitFilter(this.ticketsFilter);
    this.onChangeCounterFilter();
    if (this.listType !== 'RECURRING_TICKETS') this.getCount();
    this.ticketsStateService.onChangeLeftPanelFilter(this.listType);
  }
  /**
  * @description Check which filters use, and update count by Output event
  */
  public onChangeCounterFilter() {
    let count = 0;
    if (this.ticketsFilter.selectedCompanies.length > 0) count++;
    if (this.ticketsFilter.selectedTechUsers.length > 0) count++;
    if (this.ticketsFilter.selectedUsers.length > 0) count++;
    if (this.ticketsFilter.selectedStatus.length > 0) count++;
    if (this.ticketsFilter.selectedPriorityLevels.length > 0) count++;
    if (this.ticketsFilter.customDateRange || this.ticketsFilter.startDate && this.ticketsFilter.endDate) count++;
    this.changeCountFilter.emit(count);
  }
  /**
  * @description Init get request count tickets
  */
  private getCount() {
    this.ticketsFilter.setSearchText("");
    this.ticketsService.getCount(this.ticketsFilter.getDataForRequest()).subscribe(res => {
      this.ticketsStateService.onInitCount(res);
    })
  }
  /**
  * @description Hide tickets filters aside
  */
  close() {
    this.onClose.emit(null);
  }
  /**
 * @description Show modal show add / edit Global filter
 */
  saveFilter() {
    const conrainer = (this.leftPanelStateService.activePage == "new-tickets") ? "app-tickets" : "company-tickets";
    const modalRef = this.modalService.open(TicketsFilterSaveComponent, { windowClass: 'xs-modal user-modal', container: conrainer, backdrop: 'static', keyboard: false });
    modalRef.componentInstance.globalFilter = new TicketGlobalFilter(JSON.parse(JSON.stringify(this.globalFilter)));
    this.cd.detectChanges();
  }
  /**
 * @description Set new value "listType" without Output event
 * @param {String} type - new value listType
 */
  public setTypeFilterWithoutChange(type) {
    this.listType = type;
    this.ticketsFilter.setListType(type);
  }
  /**
* @description Set new value "listType"
* @param {String} type - new value listType
*/
  public setTypeFilter(type) {
    this.listType = type;
    this.ticketsFilter.setListType(type);
    this.ticketsStateService.onInitFilter(this.ticketsFilter);
    if (type !== 'RECURRING_TICKETS') this.getCount();
  }

  /**
* @description Get filter users from global list
*/
  public onGetUsers() {
    this.users = this.usersStateService.getAllUsers().filter(user => {
      return user.accountType !== 'TECH' && !user.deletedAt && user.customerCompaniesInfo.some(item => {
        return this.companiesState.getCompanies().some(company => company.accountType === "CLIENT" && !company.deletedAt && company.id == item.companyId);
      })
    }).sort((a, b) => (`${a.firstName} ${a.lastName}`.toLowerCase() > `${b.firstName} ${b.lastName}`.toLowerCase()) ?
      1 : ((`${b.firstName} ${b.lastName}`.toLowerCase() > `${a.firstName} ${a.lastName}`.toLowerCase()) ? -1 : 0));
  }
  /**
* @description Get filter tech users from global list
* @param {Array} data - List of Objects User
*/
  onGetTechUsers(data) {
    if (this.customerPortalStateService.isCustomerPortal) this.checkUserCustomerUser();
    this.techUsersList = data.filter(item => {
      if (item.accountType === 'TECH' && !item.deletedAt) {
        return item;
      }
    }).sort((a, b) => (`${a.firstName} ${a.lastName}`.toLowerCase() > `${b.firstName} ${b.lastName}`.toLowerCase()) ?
      1 : ((`${b.firstName} ${b.lastName}`.toLowerCase() > `${a.firstName} ${a.lastName}`.toLowerCase()) ? -1 : 0));
  }
  /**
* @description Set new values dates from datepicker
* @param {Object} value - new value dates
*/
  public onSelectDates(value) {
    if (value.start !== '' && value.end !== '') {
      this.ticketsFilter.setStartDate(moment(new Date(value.start)).format('YYYY-MM-DD'));
      this.ticketsFilter.setEndDate(moment(new Date(value.end)).format('YYYY-MM-DD'));
      this.globalFilter.setStartDate(moment(new Date(value.start)).format('YYYY-MM-DD'));
      this.globalFilter.setEndDate(moment(new Date(value.end)).format('YYYY-MM-DD'));
      this.ticketsFilter.setCustomDateRange(null);
      this.globalFilter.setCustomDateRange(null);
    } else {
      this.ticketsFilter.clearDates()
      this.globalFilter.clearDates();
    }
  }
  /**
* @description Set new values "customDateRange"
* @param {String} data - new value "customDateRange"
*/
  public onSelectCustomDateRange(data) {
    this.ticketsFilter.setCustomDateRange(data);
    this.globalFilter.setCustomDateRange(data);
    this.ticketsFilter.clearDates()
    this.globalFilter.clearDates();
  }
  /**
* @description Set new values companies
* @param {Array} items - new value Array of Object Companies
*/
  public onSelectCompany(items) {
    this.ticketsFilter.setCompanies(items);
    this.globalFilter.setClientCompaies(items.map(item => (item.id)));
  }
  /**
* @description Set new values tech users
* @param {Array} items - new value Array of Object Users
*/
  public onSelectTechUser(items) {
    this.ticketsFilter.setTechUsers(items);
    this.globalFilter.setAssignedUsersIds(items.map(item => item.id));
  }
  /**
 * @description Set new values priorities
 * @param {Array} item - new value Array of Object Priority
 */
  public onSelectPriority(item) {
    this.ticketsFilter.setPriorityLevels(item);
    this.globalFilter.setPriorityIds(item.map(item => item.id));
  }
  /**
* @description Set new values status
* @param {Array} item - new value Array of Object Status
* @param {Object} event - Object from input
*/
  public onSelectStatus(item, event) {
    if (!event.target.checked) {
      item.selected = false;
    } else {
      item.selected = true;
    }
    this.ticketsFilter.setStatus(this.ticketsStatus.filter(status => status.selected));
    this.globalFilter.setStatusIds(this.ticketsStatus.filter(status => status.selected).map(item => item.id));
    if (this.ticketsStatus.filter(status => status.selected).length > 1) {
      this.setTypeFilterWithoutChange("ALL");
    } else {
      let findStatus = this.listsStatus.find(status => this.ticketsStatus.filter(status => status.selected).some(item => item.title === status.title));
      if (findStatus) {
        this.ticketsFilter.setCustomStatus(false);
        this.setTypeFilterWithoutChange(findStatus.status);
      } else {
        this.ticketsFilter.setCustomStatus(true);
        this.setTypeFilterWithoutChange("OPEN");
      }
    }
  }
  /**
* @description Set new values users
* @param {Array} item - new value Array of Object Users
*/
  public onSelectUser(item) {
    this.ticketsFilter.setUsers(item);
    this.globalFilter.setCreatedUserIds(item.map(item => item.id));
  }
  /**
  * @description Set new values tags
  * @param {Array} tags - new value Array of Object Tags
  */
  onChangeTags(tags) {
    this.ticketsFilter.setTags(tags);
    this.globalFilter.setTagIds(tags.map(item => (item.id)));
  }
  /**
  * @description Set new value "listType" without Output event
  * @param {String} data - new value
  */
  setTypeSearchFilterWithoutChange(data) {
    this.setTypeFilterWithoutChange(data);
    this.ticketsStateService.onChangeLeftPanelFilter(data);
  }
  /**
 * @description Apply ticket filters
 */
  applyFilters() {
    if (!this.ticketsFilter.sortBy) this.setTypeFilterWithoutChange("ALL");
    this.ticketsFilter.setSearchText("");
    this.ticketsStateService.onInitFilter(this.ticketsFilter);
    if (this.listType !== 'RECURRING_TICKETS') this.getCount();
    if (!this.ticketsFilter.sortBy) this.ticketsStateService.onChangeLeftPanelFilter("ALL");
    this.onChangeCounterFilter();
    this.close();
    this.getCountsStatus();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  /**
* @description Track list by index, retrun index
* @param {Number} index - selected 
* @param {Object} item - Object for use tracking
* @returns {Number} This is the result
*/
  public trackByIndex(index, item) {
    return index;
  }
}
