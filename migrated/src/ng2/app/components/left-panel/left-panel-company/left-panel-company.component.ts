import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Company } from 'src/ng2/app/interfaces/company/company';
import { PermissionsService } from 'src/ng2/app/services/permissions/permissions.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { LeftPanelStateService } from 'src/ng2/app/states/left-panel/left-panel-state.service';
import { QuoteStateService } from 'src/ng2/app/states/quote/quote-state.service';

@Component({
  selector: 'app-left-panel-company',
  templateUrl: './left-panel-company.component.html',
  styleUrls: ['./left-panel-company.component.scss']
})
export class LeftPanelCompanyComponent implements OnInit, OnDestroy {
  open: boolean = false;
  @Input() activePage: string = "";
  selectedCompany: Company;
  companyId: string;
  sub: Subscription = new Subscription();
  @Output() onGoToLink = new EventEmitter();
  @Output() onChangeState = new EventEmitter();
  constructor(//private quoteStateService: QuoteStateService,
    private permissionsService: PermissionsService,
    private companiesStateService: CompaniesStateService,
    private leftPanelStateService: LeftPanelStateService) { }

  ngOnInit() {
    this.companyId = localStorage.getItem("company_id");
    if (this.companiesStateService.getCompanies().length > 0) this.findSelectedCompany();
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
      this.findSelectedCompany()
    })
    this.sub.add(getOnCompanies);
    this.activePage = this.leftPanelStateService.activePage;
    let getOnBillingPage = this.leftPanelStateService.getOnCompanyPage().subscribe(data => {
      this.activePage = data;
    })
    this.sub.add(getOnBillingPage);
  }
  /* goToDashboard() {
     let body = document.querySelector('.main-container');
     var link = document.createElement('a');
     body.appendChild(link);
     // link.href = `#/clients/companyProfile/${this.company.id}?tabName=dashboard`;
     link.href = `#/ng2/company/dashboard/${this.companyId}`
     var e = document.createEvent('MouseEvents');
     e.initEvent('click', true, true);
     link.dispatchEvent(e);
   }*/
  private findSelectedCompany() {
    this.selectedCompany = this.companiesStateService.getCompanies().find(item => item.id === this.companyId);
  }
  public goToState(state) {
    this.activePage = state;
    this.onChangeState.emit(state);
    //  this.quoteStateService.goToState(state);
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
