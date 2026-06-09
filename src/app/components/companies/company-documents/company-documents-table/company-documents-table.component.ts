import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { DocumentsTableComponent } from 'src/app/components/documents/documents-table/documents-table.component';

@Component({
  standalone: true,
  imports: [CommonModule, NgbDropdownModule],
  selector: 'company-documents-table',
  templateUrl: './company-documents-table.component.html',
  styleUrls: ['./company-documents-table.component.scss'],

})
export class CompanyDocumentsTableComponent extends DocumentsTableComponent {

  showTemplate() {
    if (this.getPermissions('VIEW_DOCUMENT')) {
      if (this.item.documentType === "DOCUMENT") this.documentsStateService.onInitGetTemplate(this.item);
      if (this.item.documentType === "TEMPLATE") {
        this.router.navigate(
          [`${this.companiesStateService.getCurrentCompany().techDomain}/documents/add/`], {
          queryParams: {
            template: this.item.id,
            clone_document: this.item.id,
            companyId: this.companyId
          }
        });
      }
    }
  }
  goToAddDocumentInCategory() {
    this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().techDomain}/documents/add`],
      {
        queryParams: {
          'id_category': this.item.categoryId
        }
      });
  }
  goToCloneDoucment() {
    this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().techDomain}/documents/add`],
      {
        queryParams: {
          'clone_document': this.item.id,
          'companyId': this.companyId
        }
      });
  }

}
