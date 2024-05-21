import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { News } from '../super-admin-knowledge-base-table/class/news';
import * as moment from "moment";
import { KnowledgeBaseStateService } from '../../state/knowledge-base/knowledge-base-state.service';

@Component({
  selector: 'app-super-admin-knowledge-base-news',
  templateUrl: './super-admin-knowledge-base-news.component.html',
  styleUrls: ['./super-admin-knowledge-base-news.component.scss']
})
export class SuperAdminKnowledgeBaseNewsComponent implements OnInit {
  @Input() news: News;
  @Input() display: string = 'SUPER_ADMIN';
  constructor(private elRef: ElementRef,
    private knowledgeBaseStateService: KnowledgeBaseStateService,
  ) { }

  ngOnInit() {
    this.elRef.nativeElement.querySelector(".news-description").insertAdjacentHTML('afterbegin', this.news.content);
    $('.news-description').on('click', function (e) {
      e.preventDefault();
      console.log("e", e.target.tagName);
    });
  }
  editNews() {
    document.body.querySelector(".aside-filters").scrollTo(0, 0);
    this.knowledgeBaseStateService.editNews(this.news);
  }
  public getDate(date) {
    return moment(new Date(date)).format('DD MMM YYYY');
  }
}
