import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Company } from 'src/app/interfaces/company/company';
import { LeftPanelService } from 'src/app/services/left-panel/left-panel.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';

@Component({
    selector: 'breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
    styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {
    selectedCompany: Company;
    state: string = '';
    sub: Subscription = new Subscription();
    constructor(private companiesStateService: CompaniesStateService,
        public cd: ChangeDetectorRef,
        public leftPanelService: LeftPanelService,
        private leftPanelStateService: LeftPanelStateService) { }


    ngOnInit() {
        this.state = this.leftPanelStateService.activePage;
        console.log("this.state", this.state);
        let onChangeState = this.leftPanelStateService.onChangeState.subscribe(data => {
            this.state = data;
            if (!this.cd['destroyed']) {
                this.cd.detectChanges();
            }
        })
        this.sub.add(onChangeState);
        let onChangeStateWithoutNavigate = this.leftPanelStateService.onChangeStateWithoutNavigate.subscribe(data => {
            this.state = data;
            if (!this.cd['destroyed']) {
                this.cd.detectChanges();
            }
        })
        this.sub.add(onChangeStateWithoutNavigate);
    }
    ngDoCheck() {
        if (this.companiesStateService.getCompanyRoutingId()) this.selectedCompany = this.companiesStateService.getCompanies().find(item => item.id === this.companiesStateService.getCompanyRoutingId());
    }
    isCompanyState() {
        return this.state === 'company-dashboard'
            || this.state === 'company-tickets'
            || this.state === 'company-user'
            || this.state === 'company-devices'
            || this.state === 'company-network-scan-beta'
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
        if (this.state === 'company-network-scan-beta') return 'Network scan beta';
        if (this.state === 'company-network-scan') return 'Network Scan';
        if (this.state === 'company-password-manager') return 'Password Manager';
        if (this.state === 'company-products') return 'Products';
        if (this.state === 'company-contracts') return 'Service Agreements';
        if (this.state === 'company-documents') return 'Documents';
    }
    public back() {
        this.leftPanelStateService.goToState('new-companies');
    }
    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }
}
