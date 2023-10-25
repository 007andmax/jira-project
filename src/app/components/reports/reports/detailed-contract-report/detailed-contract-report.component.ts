import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DetailContractreport } from '../../class/detail-contract-report';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';

@Component({
  selector: 'detailed-contract-report',
  templateUrl: './detailed-contract-report.component.html',
  styleUrls: ['./detailed-contract-report.component.scss']
})
export class DetailedContractReportComponent implements OnInit {
  loadingInProgress: boolean = false;
  onInit: boolean = false;
  selectedClient = null;
  detailContractReport: DetailContractreport = new DetailContractreport();
  constructor(public cd: ChangeDetectorRef,
    private companiesStateService: CompaniesStateService) { }

  ngOnInit() {
  }
  /**
   * @description Set new value "loadingInProgress" when progress request to get report
   * @param {Boolean} data - new value 
  */
  public onRequest(data) {
    this.loadingInProgress = data;
    this.cd.detectChanges();
  }
  /**
   * @description Set response from request to get report
   * @param {DetailContractreport} data - Object of DetailContractreport
  */
  public getReport(data) {
    this.detailContractReport = new DetailContractreport(JSON.parse(JSON.stringify(data)));
    this.selectedClient = this.companiesStateService.getCompanies().find(item => item.id === this.detailContractReport.companyId);
    this.onInit = true;
  }

  public trackByIndex(index, item) {
    return index;
  }
  public trackById(index, item) {
    return item.id;
  }
}
