import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Document } from '../class/document';
import { DocumentAdd } from '../documents-add/class/document-add';
import { DocumentsAddComponent } from '../documents-add/documents-add.component';

@Component({
  selector: 'documents-edit',
  templateUrl: './documents-edit.component.html',
  styleUrls: ['./documents-edit.component.scss']
})
export class DocumentsEditComponent extends DocumentsAddComponent {
  showPreloader: boolean = true;
  @Input() documentEdit: Document;
  sub: Subscription = new Subscription();
  ngOnInit() {
    let id = this.activateRoute.snapshot.params['id'];
    let subscription = this.activateRoute.params.subscribe(params => {
      this.showPreloader = true;
      id = params['id'];
      console.log("id", id);
      this.getDocument(id);
    });
    this.sub.add(subscription);
    let queryParams = this.activateRoute.queryParams.subscribe(
      (queryParam: any) => {
        if (queryParam['companyId']) this.companyId = queryParam['companyId'];
        console.log("this.companyId", this.companyId);
      }
    );
    this.sub.add(queryParams);
    this.leftPanelStateService.changeStateWithoutNavigate('new-edit-documents');
  }

  getDocument(id) {
    this.documentsService.getDocument(id).subscribe(data => {
      console.log('data', data);
      this.documentEdit = new Document(data, false);
      this.showPreloader = false;
    })
  }
}
