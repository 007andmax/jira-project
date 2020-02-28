import { Component, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { GlNumber } from '../../class/gl-number';
import { CurrentUser } from 'src/ng2/class/current-user/current-user';
import { ActivatedRoute } from '@angular/router';
import { ReportsStateService } from 'src/ng2/app/states/reports/reports-state.service';
import { ReportsService } from 'src/ng2/app/services/reports/reports.service';
import { AppService } from 'src/ng2/app/states/app/app.service';
import { CompaniesService } from 'src/ng2/app/services/company/companies.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import * as $ from 'jquery';
import * as moment from "moment";

@Component({
  selector: 'app-gl-number',
  templateUrl: './gl-number.component.html',
  styleUrls: ['./gl-number.component.scss']
})
export class GlNumberComponent implements OnInit {
  
  glNumber: GlNumber = new GlNumber();
  loadingInProgress: boolean = false;
  selectedClient = null;
  techCompany = null;
  showHeaders = false;
  currentUser: CurrentUser;
  currentCompany: any = null;
  headers = [];
  list = [];
  constructor(private route: ActivatedRoute, private reportsStateService: ReportsStateService,
    private reportsService: ReportsService,
    public cd: ChangeDetectorRef,
    private elRef: ElementRef,
    private appService: AppService,
    private companiesService: CompaniesService,
    private companiesStateService: CompaniesStateService,
    private usersStateService: UsersStateService,
  ) { }
  ngOnInit() {
   
    this.reportsStateService.glNumber.subscribe((data: GlNumber) => {
      this.glNumber.setDataFromObject(JSON.parse(JSON.stringify(data.getDataObject())));
      console.log("this.glNumber", this.glNumber);
      console.log("this.glNumber.list", this.glNumber.list);
      this.headers = [];
      this.headers.push("GL Number");
      this.headers.push("Description");
      this.glNumber.getDate().forEach(item => {
        this.headers.push(item);
      })
      this.headers.push("Total");
      this.list = [];
      this.glNumber.list.forEach(item => {
        let list = [];
        list.push(item.glNumber);
        list.push(item.description);
        item.sum.forEach((sum) => {
          list.push(`$${sum}`);

        })
        list.push(`$${item.total}`);
        this.list.push(list);
      })
      this.cd.detectChanges();
    })

    this.techCompany = this.companiesStateService.getCurrentCompany();
    this.companiesService.getTechCompany().subscribe(data => {
      this.techCompany = data;
    })
    this.currentUser = this.usersStateService.getCurrentUser();
    this.currentCompany = this.companiesStateService.getCurrentCompany();
  
  }
 
  public getReport(data) {

  }
  public onRequest(data) {
    this.loadingInProgress = data;
    this.cd.detectChanges();
  }
  onSelectedClient(client) {
    this.selectedClient = client;
   
  }
  perseStartDate() {
    return moment(this.glNumber.startDate).format('DD MMM YYYY')
  }
  perseEndDate() {
    return moment(this.glNumber.endDate).format('DD MMM YYYY')
  }
 

}
