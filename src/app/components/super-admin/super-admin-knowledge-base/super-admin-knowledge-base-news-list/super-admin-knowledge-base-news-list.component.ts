import { SuperAdminKnowledgeBaseNewsComponent } from './';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { News } from '../super-admin-knowledge-base-table/class/news';

@Component({
  standalone: true,
  imports: [SuperAdminKnowledgeBaseNewsComponent, CommonModule],
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
