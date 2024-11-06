import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Company } from 'src/app/interfaces/company/company';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { CompanyAssigned } from '../../companies/class/company-assigned';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';

@Component({
  selector: 'app-left-panel-company',
  templateUrl: './left-panel-company.component.html',
  styleUrls: ['./left-panel-company.component.scss']
})
export class LeftPanelCompanyComponent implements OnInit, OnDestroy {
  open: boolean = false;
  toogleCategoriesDocuments: boolean = true;
  selectedCategoryDocument: string;
  @Input() activePage: string = "";
  @Input() selectedCompany: Company;
  companyId: string;
  assignedDocumentCategories: Array<CompanyAssigned> = [];
  sub: Subscription = new Subscription();
  @Output() onGoToLink = new EventEmitter();
  @Output() onChangeState = new EventEmitter();
  constructor(
    public router: Router,
    private permissionsService: PermissionsService,
    public companiesStateService: CompaniesStateService,
    public activateRoute: ActivatedRoute,
    private leftPanelStateService: LeftPanelStateService,
    private customerPortalStateService: CustomerPortalStateService,
    private usersStateService: UsersStateService,
  ) { }

  ngOnInit() {
    this.companyId = this.companiesStateService.getCompanyRoutingId();
    if (this.companyId != this.companiesStateService.getCompanyIdForassignedDocumentCategory() && !this.customerPortalStateService.isCustomerPortal) this.companiesStateService.getCategoriesDocuments(this.companyId);
    if (this.companyId === this.companiesStateService.getCompanyIdForassignedDocumentCategory()) this.assignedDocumentCategories = this.companiesStateService.getAssignedDocumentCategories().sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
    let onGetAssignedDocumentCategories = this.companiesStateService.onGetAssignedDocumentCategories.subscribe(data => {
      this.assignedDocumentCategories = data.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
        1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
    })
    this.sub.add(onGetAssignedDocumentCategories);
    let onChangeSelectedCompanyId = this.companiesStateService.onChangeSelectedCompanyId.subscribe(data => {
      this.companyId = data;
    })
    this.sub.add(onChangeSelectedCompanyId);
    this.activePage = this.leftPanelStateService.activePage;
    let getOnBillingPage = this.leftPanelStateService.getOnCompanyPage().subscribe(data => {
      this.activePage = data;
    })
    this.sub.add(getOnBillingPage);
    let queryParams = this.activateRoute.queryParams.subscribe(
      (queryParam: any) => {
        this.selectedCategoryDocument = queryParam.categoryId;
      }
    );
    this.sub.add(queryParams);
  }
  public close() {
    this.open = false;
  }
  goToCompanySection(section) {
    this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().techDomain}/company/`, this.companyId, section]);
  }
  goToCompanyDocumentsCategory(id) {

    this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().techDomain}/company/`, this.companyId, 'documents'], {
      queryParams: {
        categoryId: id,
      }
    });
  }
  getLinkSection(section) {
    return `company/${this.companyId}/${section}`;
  }

  checkLogo() {
    return (this.selectedCompany && this.selectedCompany.logo && this.selectedCompany.logo.cropped && this.selectedCompany.logo.cropped.id || this.selectedCompany && this.selectedCompany.logo && this.selectedCompany.logo.origin && this.selectedCompany.logo.origin.id)
  }
  public getCompanyInfoPermissions(action) {
    let compnayInfo = this.usersStateService.getCurrentUser().customerCompaniesInfo.find(item => item.companyId == this.companyId)
    if (this.usersStateService.getCurrentUser().accountType == "TECH") return true;
    return (compnayInfo && this.usersStateService.getCurrentUser().accountType == "CLIENT" && compnayInfo.customerUserRole.getPermission(action))
  }
  public goToState(state) {
    this.onChangeState.emit(state);
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  /**
   * Get companies list
   * @param list
   */
  private getCompaniesNames(list) {

    const filteredArray = [];
    list.map((item) => {
      filteredArray.push({
        companyId: item.id,
        name: item.name
      })
    });
    return filteredArray;
  }
}
