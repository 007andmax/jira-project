import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CompaniesService } from 'src/app/services/company/companies.service';
import * as moment from "moment";
import { Subscription } from 'rxjs';
import { InvoicesAsidePreviewComponent } from '../../billing/invoices/invoices-aside-preview/invoices-aside-preview.component';
import { ContractsStateService } from 'src/app/states/contracts/contracts-state.service';
import { ContractsService } from 'src/app/services/contracts/contracts.service';
import { ServiceAgreement } from '../../billing/contracts/class/service-agreement';
import { CompanyContractType } from '../../companies/class/company-contract-type';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-company-dash-contract',
  templateUrl: './company-dash-contract.component.html',
  styleUrls: ['./company-dash-contract.component.scss']
})
export class CompanyDashContractComponent implements OnInit {

  _id: string = '';
  statisticsCount: number = 0;
  sub: Subscription = new Subscription();
  contractsList = [];
  statistics = [];
  @ViewChild('previewInvoiceAside') previewInvoiceAside: InvoicesAsidePreviewComponent;
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
    private contractsService: ContractsService) { }

  public ngOnInit() {
    this._id = this.activateRoute.snapshot.params['id'];
    let subscription = this.activateRoute.params.subscribe(params => {

      this._id = params['id'];
      console.log("id", this._id);
      this.getContractsList();
    });
    this.sub.add(subscription);
    // this._id = /[^/]*$/.exec(window.location.href)[0];

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



}
