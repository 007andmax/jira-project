import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Validate } from '../class/validate';
import { GlNumber } from '../class/gl-number';
import { ReportsService } from 'src/ng2/app/services/reports/reports.service';
import { GlNumberItem } from '../class/gl-number-item';
import { ReportsStateService } from 'src/ng2/app/states/reports/reports-state.service';

@Component({
  selector: 'app-report-menu',
  templateUrl: './report-menu.component.html',
  styleUrls: ['./report-menu.component.scss']
})
export class ReportMenuComponent implements OnInit {
  validate:Validate = new Validate();
  selectedClient = null;
  className = '';
  glNumber:GlNumber = new GlNumber();
  loadingInProgress:boolean = true;
  @Output() getReport = new EventEmitter<any>();
  constructor(private reportsService:ReportsService,private reportsStateService:ReportsStateService) { }

  ngOnInit() {
    this.glNumber.setStartDate('2019/10/01');
    this.glNumber.setEndDate('2020/02/29');
    this.glNumber.setMonthlyDetailed(true);
   
  }
  public selectClient(selectClient) {
    this.validate.resetCompany();
    if (selectClient === 'null') {

    //  this.recurringState.getCreateTicket().setCompany(null);

      this.selectedClient = null;
    //  this.recurringState.setClient(selectClient);

    } else {
     // this.recurringState.getCreateTicket().setCompany(selectClient.item.id);
      this.selectedClient = selectClient.item;
      this.glNumber.setClientCompanyId(selectClient.item.id);
    //  this.recurringState.setClient(selectClient);
    //  this.onCheckListServices();
    //  this.getCompanyDevices();

    }
    
   
  //  this.services = [new ForCreateService()];
   // this.cd.detectChanges();

  }
  getReportByGlNumber() {
      this.reportsService.getReportByGlNumber(this.glNumber.getForRequest()).subscribe(data => {
        console.log("data",data);
this.getReport.emit(data);
       
this.loadingInProgress = false;
      })
  }
  public trackByIndex(index, item) {
    return index;
  }
}
