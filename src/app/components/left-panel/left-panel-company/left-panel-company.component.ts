import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Company } from 'src/app/interfaces/company/company';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { QuoteStateService } from 'src/app/states/quote/quote-state.service';
import { CompanyAssigned } from '../../companies/class/company-assigned';
import { CompanyProfile } from '../../companies/class/company-profile';

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

  constructor(//private quoteStateService: QuoteStateService,
    public router: Router,
    private permissionsService: PermissionsService,
    public companiesStateService: CompaniesStateService,
    public activateRoute: ActivatedRoute,
    private leftPanelStateService: LeftPanelStateService,
  ) { }

  ngOnInit() {
    this.companyId = this.companiesStateService.getCompanyRoutingId();
    if (this.companyId != this.companiesStateService.getCompanyIdForassignedDocumentCategory()) this.companiesStateService.getCategoriesDocuments(this.companyId);
    if (this.companyId === this.companiesStateService.getCompanyIdForassignedDocumentCategory()) this.assignedDocumentCategories = this.companiesStateService.getAssignedDocumentCategories();
    let onGetAssignedDocumentCategories = this.companiesStateService.onGetAssignedDocumentCategories.subscribe(data => {
      this.assignedDocumentCategories = data;
    })
    this.sub.add(onGetAssignedDocumentCategories);
    this.companiesStateService.onChangeSelectedCompanyId.subscribe(data => {
      this.companyId = data;
    })
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
      [`${this.companiesStateService.getCurrentCompany().name.replaceAll(' ', '')}/company/`, this.companyId, section]);
  }
  goToCompanyDocumentsCategory(id) {

    this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().name.replaceAll(' ', '')}/company/`, this.companyId, 'documents'], {
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
  getCompanyLogoUrl() {
    if (this.selectedCompany && this.selectedCompany.logo && this.selectedCompany.logo && this.selectedCompany.logo.base64 && !this.selectedCompany.logo.cropped) return this.selectedCompany.logo.base64;
    if (this.selectedCompany && this.selectedCompany.logo && this.selectedCompany.logo.cropped && this.selectedCompany.logo.cropped.id) return `/file/${this.selectedCompany.logo.cropped.id}`;
    if (this.selectedCompany && this.selectedCompany.logo && this.selectedCompany.logo.origin && this.selectedCompany.logo.origin.id) return `/file/${this.selectedCompany.logo.origin.id}`;
    return '/company/default/logo.jpg';
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
