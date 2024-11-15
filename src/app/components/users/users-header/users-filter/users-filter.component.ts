import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CrmCompanyIndustry } from 'src/app/components/setting/crm-settings/crm-company-industry/class/crm-company-industry';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { CrmStateService } from 'src/app/states/crm/crm-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { UsersFilterSubscriptionsComponent } from './users-filter-subscriptions/users-filter-subscriptions.component';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { UserFilters } from '../../class/user-filters';
import { TicketsFilterCompaniesDropDownComponent } from 'src/app/components/tickets/tickets/tickets-header/tickets-filter/tickets-filter-companies-drop-down/tickets-filter-companies-drop-down.component';
import { UserDefaultSubscription } from '../../class/user-default-subscription';
import { UsersFilterJobTitleComponent } from './users-filter-job-title/users-filter-job-title.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserFilterSaveComponent } from '../../user-filter-save/user-filter-save.component';
import { UserGlobalFilter } from '../../class/user-global-filters';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { Company } from 'src/app/interfaces/company/company';
import { TagsStateService } from 'src/app/states/tags/tags-state.service';
import { CompanyTag } from 'src/app/components/companies/company-tags/class/company-tag';
import { UserDefaultSubscriptionItem } from '../../class/user-default-subscription-item';
import { UsersFilterTagsComponent } from './users-filter-tags/users-filter-tags.component';
import { MarketingSubscriptionType } from 'src/app/components/setting/marketing-email/marketing-subscription-type/class/marketing-subscription-type';
import { MarketingEmailStateService } from 'src/app/states/marketing-email/marketing-email-state.service';
import { MODE_MARKETING_USERS_LIST } from 'src/app/const/users';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { UsersFilterCustomSubscriptionsComponent } from './users-filter-custom-subscriptions/users-filter-custom-subscriptions.component';
import { UsersFilterDefaultSubscriptionComponent } from './users-filter-default-subscription/users-filter-default-subscription.component';

@Component({
  selector: 'app-users-filter',
  templateUrl: './users-filter.component.html',
  styleUrls: ['./users-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersFilterComponent implements OnInit, OnDestroy {
  @ViewChild('defaultSubscription', { static: true }) defaultSubscription: UsersFilterDefaultSubscriptionComponent;
  @ViewChild('jobTitleDp', { static: true }) jobTitleDp: UsersFilterJobTitleComponent;
  @ViewChild('companiesDp', { static: true }) companiesDp: TicketsFilterCompaniesDropDownComponent;
  @ViewChild('customSubscriptionDp', { static: false }) customSubscriptionDp: UsersFilterCustomSubscriptionsComponent;
  @ViewChild('subscriptionDp', { static: true }) subscriptionDp: UsersFilterSubscriptionsComponent;
  @ViewChild('tagsDp', { static: true }) tagsDp: UsersFilterTagsComponent;
  @Output() onClearAll = new EventEmitter();
  @Output() onClose = new EventEmitter();
  globalFilter: UserGlobalFilter = new UserGlobalFilter();
  listCustomSubscription: Array<MarketingSubscriptionType> = [];
  public filter: UserFilters = new UserFilters();
  MODE_MARKETING_USERS_LIST = MODE_MARKETING_USERS_LIST;
  sub: Subscription = new Subscription();
  constructor(private companiesState: CompaniesStateService,
    private crmStateService: CrmStateService,
    private customerPortalStateService: CustomerPortalStateService,
    public usersStateService: UsersStateService,
    private modalService: NgbModal,
    private leftPanelStateService: LeftPanelStateService,
    public tagsStateService: TagsStateService,
    private marketingEmailStateService: MarketingEmailStateService,
    private permissionsService: PermissionsService,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    let onLeftPanelMarketingFilter = this.usersStateService.onLeftPanelMarketingFilter.subscribe((data) => {
      this.subscriptionDp.clearCustomSubscription();
      this.filter.setCustomSubscriptions([]);
      if (data) {
        this.subscriptionDp.toggleSubscription(this.subscriptionDp.reqSubscriptions.find(item => item.id === data.id));
        this.filter.setCustomSubscriptions([data]);
      }
      this.ref.markForCheck();
    })
    this.sub.add(onLeftPanelMarketingFilter);
    let geLefttFilter = this.usersStateService.getOnFilter().subscribe((data) => {
      this.filter.setIsArchive(data.isArchive);
    });
    this.sub.add(geLefttFilter);
    this.listCustomSubscription = this.marketingEmailStateService.getListCustomSubscription();
    let onGetListCustomSubscription = this.marketingEmailStateService.onGetListCustomSubscription.subscribe(data => {
      this.listCustomSubscription = data;
    })
    this.sub.add(onGetListCustomSubscription);
    let onInitGlobalFilter = this.usersStateService.onInitGlobalFilter.subscribe((data: UserGlobalFilter) => {
      this.globalFilter = new UserGlobalFilter(JSON.parse(JSON.stringify(data)));
      let selectedCompanies: Array<Company> = this.companiesState.getCompanies().filter(item => data.companies.some(companyId => companyId == item.id));
      if (selectedCompanies.length > 0) {
        this.companiesDp.selectedItems = selectedCompanies;
        this.filter.setCompanies(selectedCompanies.map(item => item.id));
      } else if (!this.filter.isDisbledCompany) {
        this.companiesDp.clearWithOutChanges();
        this.onSelectCompany([]);
      }

      let jobTitles = this.crmStateService.getJobTitleList().filter(item => data.jobTitles.some(statusId => statusId == item.id));
      this.jobTitleDp.clearWithOutChanges();
      if (jobTitles.length > 0) {
        jobTitles.forEach(item => item.selected = true);
        this.jobTitleDp.setSelectedItemsWithoutChanges(jobTitles);
        this.filter.setJobTitles(jobTitles.map(item => item.id));
      } else {
        this.filter.setJobTitles([]);
        this.globalFilter.setJobTitles([]);
      }
      let tags = this.globalFilter.tagDtos.map(item => new CompanyTag(item));
      if (tags.length > 0) {
        this.tagsDp.setSelectedTag(tags);
        this.filter.setTags(tags.map(item => item.id));
      } else {
        this.onChangeTags([]);
        this.tagsDp.clearWithOutChanges();
      }
      let customSubscriptions = this.listCustomSubscription.filter(item => data.customSubscriptions.some(userId => userId == item.id));
      if (customSubscriptions.length > 0) {
        if (this.customSubscriptionDp) this.customSubscriptionDp.selectedTag = customSubscriptions;
        this.filter.setCustomSubscriptions(customSubscriptions.map(item => item.id));
      } else {
        this.onSelectCustomSubscription([]);
        if (this.customSubscriptionDp) this.customSubscriptionDp.clearWithOutChanges();
      }
      let defaultSubscriptions = new UserDefaultSubscription({
        invoiceSubscription: new UserDefaultSubscriptionItem({ enabled: data.invoiceSubscription, activated: true }),
        ticketSubscription: new UserDefaultSubscriptionItem({ enabled: data.ticketSubscription, activated: true }),
        ticketManagerSubscription: new UserDefaultSubscriptionItem({ enabled: data.ticketManagerSubscription, activated: true })
      });
      this.filter.setHasAccess(data.hasAccess);
      this.filter.changeDefaultSubscriptions(defaultSubscriptions);
      this.usersStateService.onInitFilter(this.filter);
    })
    this.sub.add(onInitGlobalFilter);
  }
  applyFilters() {
    this.usersStateService.onInitFilter(this.filter);
  }
  onChangeDefaultSubscriptions(data) {
    this.filter.changeDefaultSubscriptions(data);
    this.globalFilter.changeDefaultSubscriptions(data);
  }
  public onChangeTags(items) {
    this.filter.setTags(items.map(item => item.id));
    this.globalFilter.setTags(items.map(item => item.id));
  }
  onChangeHasAccess(event) {
    this.filter.setHasAccess(event.target.checked);
  }
  onChangeCustomSubscription(data) {
    this.filter.setCustomSubscriptions(data);
    this.usersStateService.onInitFilter(this.filter);
  }
  public clearAll() {
    if (!this.companiesDp.isDisabled) {
      this.filter.setCompanies([]);
      this.companiesDp.clearWithOutChanges();
    }
    this.filter.setIsArchive(false);
    this.filter.setJobTitles([]);
    this.jobTitleDp.clearWithOutChanges();
    this.filter.resetDefaultSubscriptions();
    this.defaultSubscription.clearWithOutChanges();
    this.filter.setTags([]);
    this.tagsDp.clearWithOutChanges();
    this.filter.setUserName(null);
    this.filter.setClientType(null);
    this.filter.setHasAccess(false);
    if (this.customSubscriptionDp) this.customSubscriptionDp.clearWithOutChanges();
    this.filter.setCustomSubscriptions([]);
    this.onClearAll.emit(null);
    this.globalFilter = new UserGlobalFilter();
    this.usersStateService.onInitFilter(this.filter);
    this.usersStateService.clearGlobalFilter();
  }
  onSelectTitle(item, event) {
    if (!event.target.checked) {
      item.selected = false;
    } else {
      item.selected = true;
    }
    this.filter.setJobTitles(this.crmStateService.getJobTitleList().filter(title => title.selected).map(item => item.id));
    this.globalFilter.setJobTitles(this.crmStateService.getJobTitleList().filter(title => title.selected).map(item => item.id));
  }
  public onSelectCompany(items) {
    this.filter.setCompanies(items.map(item => item.id));
    this.globalFilter.setCompanies(items.map(item => item.id));
  }
  public onSelectCustomSubscription(items) {
    this.filter.setCustomSubscriptions(items.map(item => item.id));
    this.globalFilter.setCustomSubscriptions(items.map(item => item.id));
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  saveFilter() {
    const conrainer = (this.leftPanelStateService.activePage == "new-users") ? "app-users" : this.leftPanelStateService.activePage == "marketing" ? "marketing" : "company-user";
    const modalRef = this.modalService.open(UserFilterSaveComponent, { windowClass: 'xs-modal user-modal', container: conrainer, backdrop: 'static', keyboard: false });
    modalRef.componentInstance.globalFilter = new UserGlobalFilter(JSON.parse(JSON.stringify(this.globalFilter)));
    this.ref.detectChanges();
  }
  close() {
    this.onClose.emit(null);
  }
  ngOnDestroy(): void {
    this.jobTitleDp.clearWithOutChanges();
    this.sub.unsubscribe();
  }

}
