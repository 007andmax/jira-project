import { Component, OnInit } from '@angular/core';
import { SuperAdminKnowledgeBaseAddComponent } from '../super-admin-knowledge-base-add/super-admin-knowledge-base-add.component';
import { News } from '../super-admin-knowledge-base-table/class/news';

@Component({
  selector: 'app-super-admin-knowledge-base-edit',
  templateUrl: './super-admin-knowledge-base-edit.component.html',
  styleUrls: ['./super-admin-knowledge-base-edit.component.scss']
})
export class SuperAdminKnowledgeBaseEditComponent extends SuperAdminKnowledgeBaseAddComponent {
  open: boolean = false;
  ngOnInit() {
    this.knowledgeBaseStateService.onEditNews.subscribe(data => {
      this.news = new News(JSON.parse(JSON.stringify(data)));
      this.open = true;
    })
    this.currentUser = this.usersStateService.getCurrentUser();
    this.onInitFloara();
  }
  edit() {
    if (!this.validate.isValidate(this.news)) return;
    this.superAdminKnowledgeBaseService.editNews(this.news.id, this.news.getDataForCreate()).subscribe(data => {
      this.knowledgeBaseStateService.changeNews(this.news);
    })
  }
  close() {
    this.open = false;
  }
}
