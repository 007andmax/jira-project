import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ContractsStateService } from 'src/app/states/contracts/contracts-state.service';
import { ServiceAgreement } from './class/service-agreement';
import { Subscription } from 'rxjs';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { ActivatedRoute } from '@angular/router';
import { fadeInAnimation } from 'src/app/animations';
import { ContractsEditComponent } from './contracts-edit/contracts-edit.component';
import { ContractsAsideComponent } from './contracts-aside/contracts-aside.component';
import { ContractsPreviewComponent } from './contracts-preview/contracts-preview.component';
import { NgIf } from '@angular/common';
import { ContractsTableComponent } from './contracts-table/contracts-table.component';
import { ContractsHeaderComponent } from './contracts-header/contracts-header.component';
import { ContractsReviewComponent } from './contracts-review/contracts-review.component';

@Component({
    selector: 'contracts',
    templateUrl: './contracts.component.html',
    animations: [fadeInAnimation],
    // attach the fade in animation to the host (root) element of this component
    host: { '[@fadeInAnimation]': '' },
    styleUrls: ['./contracts.component.scss'],
    standalone: true,
    imports: [
        ContractsReviewComponent,
        ContractsHeaderComponent,
        ContractsTableComponent,
        NgIf,
        ContractsPreviewComponent,
        ContractsAsideComponent,
        ContractsEditComponent,
    ],
})
export class ContractsComponent implements OnInit, OnDestroy {
  showCreate = false;
  showPreview = false;
  showEdit = false;
  serviceAgreement: ServiceAgreement;
  sub: Subscription = new Subscription();
  constructor(public contractsStateService: ContractsStateService,
    public leftPanelStateService: LeftPanelStateService,
    public companiesStateService: CompaniesStateService,
    public activateRoute: ActivatedRoute,
    public cd: ChangeDetectorRef
  ) { }


  ngOnInit() {
    this.leftPanelStateService.setBillingPage('new-contracts');

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
