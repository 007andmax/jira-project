
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CompaniesService } from 'src/app/services/company/companies.service';
import * as moment from "moment";
import { Subscription } from 'rxjs';
import { InvoicesAsidePreviewComponent } from '../../billing/invoices/invoices-aside-preview/invoices-aside-preview.component';
import { ContractsStateService } from 'src/app/states/contracts/contracts-state.service';
import { ContractsService } from 'src/app/services/contracts/contracts.service';
import { ServiceAgreement } from '../../billing/contracts/class/service-agreement';
import { CompanyContractType } from '../../companies/class/company-contract-type';
import { ActivatedRoute } from '@angular/router';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { ContractsEditComponent } from '../../billing/contracts/contracts-edit/contracts-edit.component';
import { ContractsPreviewComponent } from '../../billing/contracts/contracts-preview/contracts-preview.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: true,
  imports: [ContractsEditComponent, NgbTooltipModule, ContractsPreviewComponent, CommonModule],
  selector: 'app-company-dash-contract',
  templateUrl: './company-dash-contract.component.html',
  styleUrls: ['./company-dash-contract.component.scss']
})
export class CompanyDashContractComponent implements OnInit, OnDestroy {

  _id: string = '';
  statisticsCount: number = 0;
  sub: Subscription = new Subscription();
  contractsList = [];
  statistics = [];
  statisticsColor = ['0747a6', '00ccff', '052e6b', 'cdecff', '16A4FA', '7C77CB', '2BC7C6'];
  showContractPreview: boolean = false;
  showContractEdit: boolean = false;
  serviceAgreement: ServiceAgreement;
  contractType: CompanyContractType = {
    HOURLY: 'Custom Hourly',
    BLOCK_TIME: 'Block Time',
    SERVICE_CONTRACT: 'Service Contract',
  };

  public constructor(private companiesService: CompaniesService,
    public cd: ChangeDetectorRef,
    public activateRoute: ActivatedRoute,
    public contractsStateService: ContractsStateService,
    private companiesStateService: CompaniesStateService,
    private contractsService: ContractsService) { }


  public ngOnInit() {
    this._id = this.activateRoute.snapshot.params['id'];
    let subscription = this.activateRoute.params.subscribe(params => {
      this._id = params['id'];
      this.statisticsCount = 0;
      this.contractsList = [];
      this.statistics = [];
      this.companiesStateService.setCompanyRoutingId(this._id);
      this.getContractsList();
    });
    this.sub.add(subscription);
    let getOnTogglePreview = this.contractsStateService.getOnTogglePreview().subscribe(data => {
      this.showContractPreview = false;
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    })
    this.sub.add(getOnTogglePreview);
    let getOnEdit = this.contractsStateService.getOnEdit().subscribe(data => {
      this.serviceAgreement = data;
      this.showContractEdit = true;
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    })
    this.sub.add(getOnEdit);
    let getOnToggleEdit = this.contractsStateService.getOnToggleEdit().subscribe(data => {
      this.showContractEdit = data;
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    })
    this.sub.add(getOnToggleEdit);

  }

  getContractsList() {
    let getInvoice = this.companiesService.getContractsList(this._id).subscribe((data: any) => {
      let statistics = [];
      data.forEach(element => {
        let obj = element;
        obj.serviceAgreement.startDateName = moment(new Date(obj.serviceAgreement.startDate)).format('DD MMM YYYY');
        obj.serviceAgreement.endDateName = moment(new Date(obj.serviceAgreement.endDate)).format('DD MMM YYYY');
        this.contractsList.push(obj);
        if (element.statistics !== null)
          statistics = statistics.concat(element.statistics);
      });
      statistics.forEach(element => {
        this.statisticsCount += Math.round(element.quantity);
      });
      statistics.forEach((element, index) => {
        this.statistics.push({
          itemId: element.itemId,
          itemName: element.itemName,
          quantity: Math.round(element.quantity),
          width: ((Math.round(element.quantity) / this.statisticsCount) * 100) + '%',
          color: '#' + this.statisticsColor[index],
          code: this.statisticsColor[index]
        })
      });
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    });
    this.sub.add(getInvoice);
  }

  openContractPreview(data) {
    this.contractsService.getServiceAgreement(data.serviceAgreement.id).subscribe(data => {
      this.serviceAgreement = data;
      this.showContractPreview = true;
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    })
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
