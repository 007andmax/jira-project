import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { News } from '../super-admin-knowledge-base-table/class/news';

@Component({
  selector: 'app-super-admin-knowledge-base-news-list',
  templateUrl: './super-admin-knowledge-base-news-list.component.html',
  styleUrls: ['./super-admin-knowledge-base-news-list.component.scss']
})
export class SuperAdminKnowledgeBaseNewsListComponent implements OnInit {
  @Input() list: Array<News> = [];
  constructor() { }

  ngOnInit() {
  }
  public trackById(index, item) {
    return item.id;
  }
}
