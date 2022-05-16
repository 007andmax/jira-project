import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { User } from 'src/app/components/users/class/user';
import { Company } from 'src/app/interfaces/company/company';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { PaymentsReport } from './class/payments-report';

@Component({
  selector: 'payments-report',
  templateUrl: './payments-report.component.html',
  styleUrls: ['./payments-report.component.scss']
})
export class PaymentsReportComponent implements OnInit {

  paymentsReport: PaymentsReport = new PaymentsReport();
  loadingInProgress: boolean = false;
  onInit = false;
  currentCompany: Company;
  techUser: User;
  constructor(public cd: ChangeDetectorRef,
    private companiesStateService: CompaniesStateService,
    private usersStateService: UsersStateService,) { }

  ngOnInit() {
    this.currentCompany = this.companiesStateService.getCurrentCompany();
  }
  public onRequest(data) {
    this.loadingInProgress = data;
    this.cd.detectChanges();
  }
  public getReport(data) {
  /*  this.ticketsReport.setData(data);
    this.ticketsReport.startDate = moment(new Date(this.ticketsReport.startDate)).format('ll');
    this.ticketsReport.endDate = moment(new Date(this.ticketsReport.endDate)).format('ll');
    this.techUser = this.usersStateService.getAllUsers().find(item => item.id === this.ticketsReport.userId);
  */  this.onInit = true;
  }

  public trackByIndex(index, item) {
    return index;
  }
  ngOnDestroy(): void {

  }

}
