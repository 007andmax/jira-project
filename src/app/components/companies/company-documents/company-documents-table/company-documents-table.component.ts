import { Component, OnInit } from '@angular/core';
import { DocumentsTableComponent } from 'src/app/components/documents/documents-table/documents-table.component';

@Component({
  selector: 'company-documents-table',
  templateUrl: './company-documents-table.component.html',
  styleUrls: ['./company-documents-table.component.scss']
})
export class CompanyDocumentsTableComponent extends DocumentsTableComponent {


  showTemplate() {
    console.log("item", this.item);
    if (this.getPermissions('VIEW_DOCUMENT')) {
      if (this.item.documentType === "DOCUMENT") this.documentsStateService.onInitGetTemplate(this.item);
      if (this.item.documentType === "TEMPLATE") {
        this.router.navigate(
          ['/ng2/documents/add/'], {
          queryParams: {
            template: this.item.id,
            clone_document: this.item.id,
            companyId: this.companyId
          }
        });
      }
    }
  }
}
