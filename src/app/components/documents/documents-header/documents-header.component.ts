import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { AppService } from 'src/app/states/app/app.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { DocumentsFilterComponent } from './documents-filter/documents-filter.component';
import { Subscription } from 'rxjs';

@Component({
    selector: 'documents-header',
    templateUrl: './documents-header.component.html',
    styleUrls: ['./documents-header.component.css'],
    standalone: true
})
export class DocumentsHeaderComponent implements OnInit {
  toggleFilter: boolean = false;
  countFilter: number = 0;
  activePage: string = "";
  @ViewChild('filter', { static: true }) filter: DocumentsFilterComponent;
  @Output() onChangeFilterField = new EventEmitter<any>();
  @Output() onSelectAll = new EventEmitter<any>();
  @Output() onSearch = new EventEmitter<any>();
  @Input() selectAll: boolean = false;
  @Input() companyId: string;
  @Input() showAssignedCompanies: boolean = false;

  sub: Subscription = new Subscription();
  searchText: string = "";
  /**
   * Creates an instance of the PasswordManagerComponent with the injected services
    * @param {PasswordManagerService} passwordManagerService Service to work with filters
   * @param {permissionsService} permissionsService to work with permissions service
   */
  constructor(
    private leftPanelStateService: LeftPanelStateService,
    private permissionsService: PermissionsService,
    private router: Router,
    public appService: AppService,
    private companiesStateService: CompaniesStateService,
  ) { }

  /**
   * Initializes Password manager header. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.activePage = this.leftPanelStateService.activePage;
    let onFirstOpen = this.leftPanelStateService.onFirstOpen.subscribe(data => {
      this.activePage = data;
    })
    this.sub.add(onFirstOpen);
  }
  clearSearch() {
    this.searchText = "";
    this.onSearch.emit("");
  }
  back() {
    this.leftPanelStateService.goToState('new-documents');
  }
  getTextCountFilters() {
    return `Filters${(this.countFilter > 0) ? ' (' + this.countFilter + ')' : ''}`;
  }
  toggleAll(data) {
    this.selectAll = true;
    this.onSelectAll.emit(data);
  }
  public onFilter(field) {
    this.onChangeFilterField.emit(field);
  }
  clearAll() {
    this.filter.onClearAll();
  }
  search(event) {
    this.onSearch.emit(event.target.value);
  }
  goToAddDocument() {
    if (this.getPermissions('CREATE_DOCUMENT')) {
      this.router.navigate(
        [`${this.companiesStateService.getCurrentCompany().techDomain}/documents/add`], { queryParams: { companyId: this.companyId } });
    }
  }
  goToTemplates() {
    this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().techDomain}/documents/templates`], { queryParams: { companyId: this.companyId } });
  }
  onChangeCountFilter(data) {
    this.countFilter = data;
  }

  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
