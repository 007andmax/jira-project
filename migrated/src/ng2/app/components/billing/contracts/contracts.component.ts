import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ContractsStateService } from 'src/ng2/app/states/contracts/contracts-state.service';
import { ServiceAgreement } from './class/service-agreement';
import { Subscription } from 'rxjs';
import { LeftPanelStateService } from 'src/ng2/app/states/left-panel/left-panel-state.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';

@Component({
  selector: 'contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss'],
})
export class ContractsComponent implements OnInit, OnDestroy {
  showCreate = false;
  showPreview = false;
  showEdit = false;
  serviceAgreement: ServiceAgreement;
  showNotificationReview: boolean = false;
  sub: Subscription = new Subscription();
  constructor(public contractsStateService: ContractsStateService,
    public leftPanelStateService: LeftPanelStateService,
    public companiesStateService: CompaniesStateService,
    public cd: ChangeDetectorRef
  ) { }


  ngOnInit() {
    this.leftPanelStateService.setBillingPage('new-contracts');
    let getOnShowNotificationReview = this.contractsStateService.getOnShowNotificationReview().subscribe(data => {
      this.showNotificationReview = true;
    })
    this.sub.add(getOnShowNotificationReview);
    let getOnToggleCreate = this.contractsStateService.getOnToggleCreate().subscribe(data => {
      this.showCreate = data;
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    })
    this.sub.add(getOnToggleCreate);
    let getOnPreview = this.contractsStateService.getOnPreview().subscribe(data => {
      this.serviceAgreement = data;
      this.showPreview = true;
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    })
    this.sub.add(getOnPreview);
    let getOnTogglePreview = this.contractsStateService.getOnTogglePreview().subscribe(data => {

      this.showPreview = false;
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    })
    this.sub.add(getOnTogglePreview);
    let getOnEdit = this.contractsStateService.getOnEdit().subscribe(data => {
      this.serviceAgreement = data;
      this.showEdit = true;
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    })
    this.sub.add(getOnEdit);
    let getOnToggleEdit = this.contractsStateService.getOnToggleEdit().subscribe(data => {

      this.showEdit = data;
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    })
    this.sub.add(getOnToggleEdit);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
