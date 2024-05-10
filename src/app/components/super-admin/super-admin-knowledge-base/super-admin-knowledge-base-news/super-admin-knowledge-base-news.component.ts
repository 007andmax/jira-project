import { Component, Input, OnInit } from '@angular/core';
import { News } from '../super-admin-knowledge-base-table/class/news';
import * as moment from "moment";

@Component({
  selector: 'app-super-admin-knowledge-base-news',
  templateUrl: './super-admin-knowledge-base-news.component.html',
  styleUrls: ['./super-admin-knowledge-base-news.component.scss']
})
export class SuperAdminKnowledgeBaseNewsComponent implements OnInit {
  @Input() news: News;

  constructor() { }

  ngOnInit() {
  }
  public getDate(date) {
    return moment(new Date(date)).format('DD MMM YYYY');
  }
}
