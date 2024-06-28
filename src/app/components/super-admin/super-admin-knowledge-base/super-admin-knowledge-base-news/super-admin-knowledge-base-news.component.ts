import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { News } from '../super-admin-knowledge-base-table/class/news';
import * as moment from "moment";
import { KnowledgeBaseStateService } from '../../state/knowledge-base/knowledge-base-state.service';
import { PreviewAttachmentStateService } from 'src/app/components/tickets/tickets/ticket-edit-aside/preview-attachment/services/preview-attachment-state.service';

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
    private previewAttachmentStateService: PreviewAttachmentStateService,
  ) { }

  ngOnInit() {
    this.elRef.nativeElement.querySelector(".news-description").insertAdjacentHTML('afterbegin', this.news.content);
    $('.news-description').on('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.target.tagName == "IMG") this.previewAttachmentStateService.onInitPreview(e.target.getAttribute("src"));
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
