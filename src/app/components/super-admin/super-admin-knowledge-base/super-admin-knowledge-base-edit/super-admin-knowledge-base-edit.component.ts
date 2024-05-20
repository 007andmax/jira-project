import { Component, OnInit } from '@angular/core';
import { SuperAdminKnowledgeBaseAddComponent } from '../super-admin-knowledge-base-add/super-admin-knowledge-base-add.component';
import { News } from '../super-admin-knowledge-base-table/class/news';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-super-admin-knowledge-base-edit',
  templateUrl: './super-admin-knowledge-base-edit.component.html',
  styleUrls: ['./super-admin-knowledge-base-edit.component.scss']
})
export class SuperAdminKnowledgeBaseEditComponent extends SuperAdminKnowledgeBaseAddComponent {
  open: boolean = false;
  content: string = "";
  ngOnInit() {
    this.knowledgeBaseStateService.onEditNews.subscribe(data => {
      this.news = new News(JSON.parse(JSON.stringify(data)));
      this.content = JSON.parse(JSON.stringify(data.content));
      this.open = true;
    })
    this.currentUser = this.usersStateService.getCurrentUser();
    this.onInitFloara();
  }
  ngDoCheck() {

    if (this.content.length > 0) this.validate.resetContent();
    this.news.setNewContent(this.content);
  }
  edit() {
    if (!this.validate.isValidate(this.news)) return;
    this.superAdminKnowledgeBaseService.editNews(this.news.id, this.news.getDataForEdit()).subscribe(data => {
      this.checkAttachments(this.news.content, this.news.newContent);
      this.news.update(data);
      this.knowledgeBaseStateService.changeNews(this.news);
      this.close();
    })
  }
  checkAttachments(content, newContent) {
    let oldAttachments = this.attachments;
    let newAttachments = [];
    let removedAttachments = [];
    var urlRegex = /(((https?:\/\/)|(http?:\/\/)|(www\.))[^\s]+)/g;
    if (content) content.replace(urlRegex, function (url) {
      oldAttachments.push(url.replace('\"', '').replace('/attachment', ''));
      return url;
    });
    if (newContent) newContent.replace(urlRegex, function (url) {
      newAttachments.push(url.replace('\"', '').replace('/attachment', ''));
      return url;
    });
    oldAttachments.forEach(item => {
      if (!newAttachments.find(newItem => newItem === item)) removedAttachments.push(item);
    })
    let removedAttachmentsIds = removedAttachments.map(item => item.substring(item.indexOf("file/") + 5, item.length));
    forkJoin(
      [...removedAttachmentsIds.map(item => this.documentsService.removeDocumentAttachment(item))]
    )
      .subscribe(res => {
      });
  }
  close() {
    this.open = false;
    this.news = new News();
    this.attachments = [];
  }
}
