import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Document } from '../class/document';
import { DocumentsAddComponent } from '../documents-add/documents-add.component';

@Component({
  selector: 'documents-edit',
  templateUrl: './documents-edit.component.html',
  styleUrls: ['./documents-edit.component.scss']
})
export class DocumentsEditComponent extends DocumentsAddComponent {
  showPreloader: boolean = true;
  content: string;
  @Input() documentEdit: Document;
  attachments = [];
  sub: Subscription = new Subscription();
  ngOnInit() {
    let id = this.activateRoute.snapshot.params['id'];
    let subscription = this.activateRoute.params.subscribe(params => {
      this.showPreloader = true;
      id = params['id'];
      this.getDocument(id);
    });
    this.sub.add(subscription);
    let queryParams = this.activateRoute.queryParams.subscribe(
      (queryParam: any) => {
        if (queryParam['companyId']) this.companyId = queryParam['companyId'];
        this.cd.detectChanges();
      }
    );
    this.sub.add(queryParams);
    this.leftPanelStateService.changeStateWithoutNavigate('new-edit-documents');
  }
  onChangeContent(data) {
    this.documentEdit.setNewContent(data);
  }
  onChangeAttachments(data) {
    this.attachments = data;
  }
  getDocument(id) {
    this.documentsService.getDocument(id).subscribe((data: any) => {
      this.documentEdit = new Document(data, false);
      this.content = JSON.parse(JSON.stringify(data.content));
      this.showPreloader = false;

    })
  }
}
