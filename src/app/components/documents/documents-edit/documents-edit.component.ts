
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Document } from '../class/document';
import { DocumentsAddComponent } from '../documents-add/documents-add.component';
import { fadeInAnimation } from 'src/app/animations';
import { DocumentsAddBodyComponent } from '../documents-add/documents-add-body/documents-add-body.component';
import { DocumentsAddFooterComponent } from '../documents-add/documents-add-footer/documents-add-footer.component';
import { DocumentsAddHeaderComponent } from '../documents-add/documents-add-header/documents-add-header.component';
import { DocumentsEditInfoComponent } from './documents-edit-info/documents-edit-info.component';

@Component({
  standalone: true,
  imports: [DocumentsAddBodyComponent, DocumentsAddFooterComponent, DocumentsAddHeaderComponent, DocumentsEditInfoComponent, CommonModule],
  selector: 'documents-edit',
  templateUrl: './documents-edit.component.html',
  animations: [fadeInAnimation],
  // attach the fade in animation to the host (root) element of this component
  host: { '[@fadeInAnimation]': '' },
  styleUrls: ['./documents-edit.component.scss'],
  standalone: true
})
export class DocumentsEditComponent extends DocumentsAddComponent {
  showPreloader: boolean = true;
  content: string;
  categoryId: string;
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
        if (queryParam['companyId']) {
          this.companyId = queryParam['companyId'];
          this.companiesStateService.setCompanyRoutingId(this.companyId);
          this.leftPanelStateService.changeStateWithoutNavigate('new-edit-documents-company');
        }
        this.cd.detectChanges();
      }
    );
    this.sub.add(queryParams);
    if (!this.companiesStateService.getCompanyRoutingId()) this.leftPanelStateService.changeStateWithoutNavigate('new-edit-documents');
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
      this.categoryId = JSON.parse(JSON.stringify(data.categoryId));

    })
  }
}
