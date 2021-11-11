import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Company } from 'src/app/interfaces/company/company';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';

@Component({
    selector: 'breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
    styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {

    selectedCompany: Company;
    state: string = '';
    constructor(private companiesStateService: CompaniesStateService,
        public cd: ChangeDetectorRef,
        private leftPanelStateService: LeftPanelStateService) { }

    ngOnInit() {
        this.leftPanelStateService.onChangeState.subscribe(data => {
            this.state = data;
            this.cd.detectChanges();
        })
        this.leftPanelStateService.onChangeStateWithoutNavigate.subscribe(data => {
            this.state = data;
            this.cd.detectChanges();
        })
    }
    ngDoCheck() {
        if (this.companiesStateService.getSelectedCompanyId()) this.selectedCompany = this.companiesStateService.getCompanies().find(item => item.id === this.companiesStateService.getSelectedCompanyId());

    }
    isCompanyState() {
        return this.state === 'company-dashboard'
            || this.state === 'company-tickets'
            || this.state === 'company-user'
            || this.state === 'company-devices'
            || this.state === 'company-network-scan'
            || this.state === 'company-password-manager'
            || this.state === 'company-products'
            || this.state === 'company-contracts'
            || this.state === 'company-documents';


    }
    public getPath() {
        if (this.state === 'company-dashboard') return 'Dashboard';
        if (this.state === 'company-tickets') return 'Tickets';
        if (this.state === 'company-user') return 'Users';
        if (this.state === 'company-devices') return 'Devices';
        if (this.state === 'company-network-scan') return 'Network Scan';
        if (this.state === 'company-password-manager') return 'Password Manager';
        if (this.state === 'company-products') return 'Products';
        if (this.state === 'company-contracts') return 'Service Agreements';
        if (this.state === 'company-documents') return 'Documents';
    }
    public back() {
        this.leftPanelStateService.goToState('new-companies');
    }

}
