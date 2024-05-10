import { Component, Input, OnInit } from '@angular/core';
import { News } from '../class/news';
import * as moment from "moment";

@Component({
  selector: 'app-super-admin-knowledge-base-table-item',
  templateUrl: './super-admin-knowledge-base-table-item.component.html',
  styleUrls: ['./super-admin-knowledge-base-table-item.component.scss']
})
export class SuperAdminKnowledgeBaseTableItemComponent implements OnInit {
  @Input() news: News;

  constructor() { }

  ngOnInit() {
  }
  public getDate(date) {
    return moment(new Date(date)).format('MMM DD, YYYY');
  }
  select() {

  }

}
