import { Component, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { PasswordManagerService } from 'src/app/services/password-manager/password-manager.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { AppService } from 'src/app/states/app/app.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { IntegrationsStateService } from 'src/app/states/integrations/integrations-state.service';
import { ManageCardsStateService } from 'src/app/states/manage-cards/manage-cards-state.service';
import { PasswordManagerStateService } from 'src/app/states/password-manager/password-manager-state.service';

@Component({
    selector: 'app-manage-cards-header',
    templateUrl: './manage-cards-header.component.html',
    styleUrls: ['./manage-cards-header.component.scss'],
    standalone: true
})
export class ManageCardsHeaderComponent {
  toggleFilter: boolean = false;
  toggleSearch: boolean = false;
  showAddCategory: boolean = false;
  countFilter: number = 0;
  //@ViewChild('filters', { static: true }) filters: PasswoordManagerFiltersComponent;
  // filter: FilterPasswordManager = new FilterPasswordManager();
  @Output() onChangeFilterField = new EventEmitter<any>();
  @Output() onSearch = new EventEmitter<any>();
  sub: Subscription = new Subscription();
  searchText: string = "";
  /**
   * Creates an instance of the PasswordManagerComponent with the injected services
    * @param {PasswordManagerService} passwordManagerService Service to work with filters
   * @param {permissionsService} permissionsService to work with permissions service
   */
  constructor(
    public integrationsStateService: IntegrationsStateService,
    private permissionsService: PermissionsService,
    private manageCardsStateService: ManageCardsStateService,
    public companiesStateService: CompaniesStateService,
    public appService: AppService,
  ) { }

  /**
   * Initializes Password manager header. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    /* let geLefttFilter = this.passwordManagerStateService.getOnFilter().subscribe((data) => {
       this.filter.setFilter(data);
       this.onChangeCounterFilter();
     })
     this.sub.add(geLefttFilter);
     let onToggleFilter = this.passwordManagerStateService.onToggleFilter.subscribe(data => {
       this.toggleFilter = data;
     })
     this.sub.add(onToggleFilter);*/
  }
  /* public onChangeCounterFilter() {
     this.countFilter = 0;
     if (this.filter.selectedCategory) this.countFilter++;
     if (this.filter.selectedCompany) this.countFilter++;
     if (this.filter.selectedDate) this.countFilter++;
     if (this.filter.selectedUserOrDevice) this.countFilter++;
   }*/
  clearSearch() {
    this.searchText = "";
    this.onSearch.emit("");
  }

  getTextCountFilters() {
    return `Filters${(this.countFilter > 0) ? ' (' + this.countFilter + ')' : ''}`;
  }
  public onFilter(field) {
    this.onChangeFilterField.emit(field);
  }
  onKeyUp(event) {
    if (event.keyCode === 13) this.onSearch.emit(event.target.value);
  }
  public addCard() {
    this.manageCardsStateService.openAsideForAdd();
  }
  onChangeCountFilter(data) {
    this.countFilter = data;
  }
  onToggleFilter(data) {
    this.toggleFilter = data;
    //  this.passwordManagerStateService.changeToggleFilter(this.toggleFilter);
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  refreshFilters() {
    //this.filters.applyFilters();
  }
  isExistFilters() {
    /* return this.filter.selectedCompany ||
       this.filter.selectedDate ||
       this.filter.selectedUserOrDevice ||
       this.filter.selectedCategory*/
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
