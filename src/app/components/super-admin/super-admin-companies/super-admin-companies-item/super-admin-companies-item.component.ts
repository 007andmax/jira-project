import { Component, Input, OnInit } from '@angular/core';
import { SuperAdminCompany } from '../class/super-admin-company';
import * as moment from "moment";

@Component({
    selector: 'super-admin-companies-item',
    templateUrl: './super-admin-companies-item.component.html',
    styleUrls: ['./super-admin-companies-item.component.scss'],
    standalone: true
})
export class SuperAdminCompaniesItemComponent implements OnInit {
  @Input() company: SuperAdminCompany;
  constructor() { }

  ngOnInit() {
  }
  getCreateAt() {
    return moment(new Date(this.company.createdAt)).format('DD/MM/YYYY');
  }
  public trackById(index, item) {
    return item.id;
  }
}
