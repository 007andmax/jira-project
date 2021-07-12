import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Company } from 'src/app/interfaces/company/company';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { QuoteStateService } from 'src/app/states/quote/quote-state.service';

@Component({
  selector: 'app-left-panel-company',
  templateUrl: './left-panel-company.component.html',
  styleUrls: ['./left-panel-company.component.scss']
})
export class LeftPanelCompanyComponent implements OnInit, OnDestroy {
  open: boolean = false;
  @Input() activePage: string = "";
  @Input() selectedCompany: Company;
  companyId: string;
  sub: Subscription = new Subscription();
  @Output() onGoToLink = new EventEmitter();
  @Output() onChangeState = new EventEmitter();

  constructor(//private quoteStateService: QuoteStateService,
    private permissionsService: PermissionsService,
    private companiesStateService: CompaniesStateService,
    private leftPanelStateService: LeftPanelStateService) { }

  ngOnInit() {
    this.companyId = this.companiesStateService.getSelectedCompanyId();
    this.companiesStateService.onChangeSelectedCompanyId.subscribe(data => {
      this.companyId = data;
    })
    this.activePage = this.leftPanelStateService.activePage;
    let getOnBillingPage = this.leftPanelStateService.getOnCompanyPage().subscribe(data => {
      this.activePage = data;
    })
    this.sub.add(getOnBillingPage);
  }
  public close() {
    this.open = false;
  }
  isShowDoucments() {
    let ids = ["72381bff-127c-4a63-9d2e-6e952350dcbd", "73221c72-f87c-4519-8235-c4b57ad1cc19"];
    return (this.companiesStateService.getCurrentCompany()) ? ids.find(id => id === this.companiesStateService.getCurrentCompany()) : false;
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
  /* goToDashboard() {
     let body = document.querySelector('.main-container');
     var link = document.createElement('a');
     body.appendChild(link);
     // link.href = `#/clients/companyProfile/${this.company.id}?tabName=dashboard`;
     link.href = `#/company/dashboard/${this.companyId}`
     var e = document.createEvent('MouseEvents');
     e.initEvent('click', true, true);
     link.dispatchEvent(e);
   }*/

  public goToState(state) {
    this.onChangeState.emit(state);
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
