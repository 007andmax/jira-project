import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbDateStruct, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CompanyProfileService } from 'src/app/services/setting/company-profile.service';
import * as moment from "moment";

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule, NgbModule],
  selector: 'accounting-year',
  templateUrl: './accounting-year.component.html',
  styleUrls: ['./accounting-year.component.scss']
})
export class AccountingYearComponent implements OnInit {
  accountingStartDate: NgbDateStruct = {
    "day": 0,
    "month": 0,
    "year": 0,
  };
  accountingEndDate: NgbDateStruct = {
    "day": new Date().getDate(),
    "month": new Date().getMonth() + 1,
    "year": new Date().getFullYear(),
  };
  constructor(private companyProfileService: CompanyProfileService,
    private toaster: ToastrService,) { }

  ngOnInit() {
    $('body').addClass('page-settings');
    $('body').removeClass('backMenu');
    this.getAccountingStartDate();
  }
  public saveAccountingDate() {
    let data = new Date(this.accountingStartDate.month + '/' + this.accountingStartDate.day + '/' + this.accountingStartDate.year);
    this.companyProfileService.setAccountingStartDate(JSON.stringify(moment(data).format('YYYY-MM-DD'))).subscribe(
      (res: any) => {
        this.toaster.success('Accounting date updated successfully', null, {
          timeOut: 3000
        });
      },
      error => { }
    );
  }
  getAccountingStartDate() {
    this.companyProfileService.getAccountingStartDate().subscribe(
      (res: any) => {
        if (res.accountingStartDate !== null) {
          this.accountingStartDate = {
            "day": new Date(res.accountingStartDate).getDate(),
            "month": new Date(res.accountingStartDate).getMonth() + 1,
            "year": new Date(res.accountingStartDate).getFullYear(),
          };
        }
      },
      error => { }
    );
  }
  resetAccountingDate() {
    this.companyProfileService.resetAccountingStartDate().subscribe(
      (res: any) => {
        this.toaster.success('Accounting date reset successfully', null, {
          timeOut: 3000
        });
      },
      error => { }
    );
  }
}
