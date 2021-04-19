import { Component, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { GlNumber } from '../../class/gl-number';
import { CurrentUser } from 'src/class/current-user/current-user';
import { ActivatedRoute } from '@angular/router';
import { ReportsStateService } from 'src/app/states/reports/reports-state.service';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { AppService } from 'src/app/states/app/app.service';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import * as $ from 'jquery';
import * as moment from "moment";
import { GlNumberItem } from '../../class/gl-number-item';

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

    this.reportsStateService.glNumber.subscribe((res: GlNumber) => {
      this.glNumber.setDataFromObject(JSON.parse(JSON.stringify(res.getDataObject())));

      let data = this.glNumber.response;
      this.glNumber.clearDates();
      this.glNumber.clearList();
      if (this.glNumber.getMonthlyDetailed()) {
        let keys = Object.keys(data);
        keys = keys.sort();
        keys.forEach((key, indexKey) => {
          const element = data[key];
          this.glNumber.addDate(key);
          element.forEach((item, indexItem) => {
            let index = this.glNumber.getList().findIndex(itemList => itemList.glNumber === item.glNumber);
            if (index > -1) {
              this.glNumber.getList()[index].setSum(indexKey, item.sum);
              this.glNumber.getList()[index].updateTotal(item.sum);
            } else {
              this.glNumber.addItem(new GlNumberItem(item.glNumber, item.description, keys.length));
              let indexLast = this.glNumber.getList().length - 1;
              this.glNumber.getList()[indexLast].setSum(indexKey, item.sum);
              this.glNumber.getList()[indexLast].updateTotal(item.sum);
            }
          });

        });
      } else {
        data.forEach((item, index) => {
          this.glNumber.addItem(new GlNumberItem(item.glNumber, item.description, null));
          let indexLast = this.glNumber.getList().length - 1;
          this.glNumber.getList()[indexLast].updateTotal(item.sum);
        });
      }
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
