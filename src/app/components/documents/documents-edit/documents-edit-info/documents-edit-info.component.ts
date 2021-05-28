import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { Document } from '../../class/document';

import { DocumentsAddInfoComponent } from '../../documents-add/documents-add-info/documents-add-info.component';
import { DocumentsLinkedComponent } from '../../documents-add/documents-add-info/documents-linked/documents-linked.component';
import { DocumentsFilterTagsComponent } from '../../documents-header/documents-filter/documents-filter-tags/documents-filter-tags.component';

@Component({
  selector: 'documents-edit-info',
  templateUrl: './documents-edit-info.component.html',
  styleUrls: ['./documents-edit-info.component.scss']
})
export class DocumentsEditInfoComponent extends DocumentsAddInfoComponent {

  @Input() documentEdit: Document;
  @Input() linked: DocumentsLinkedComponent;
  @ViewChild('categoriesDp') categoriesDp: DropDownComponent;
  @ViewChild('tagsDp') tagsDp: DocumentsFilterTagsComponent;
  sub: Subscription = new Subscription();

  ngOnInit() {
    this.categories = this.documentsStateService.getCategories();
    this.documentsStateService.onGetCategories.subscribe((data: any) => {
      this.categories = data;
      //   this.categoriesDp.editItem = this.categories.find(item => item.id === this.documentEdit.categoryId);
      console.log("this.categories", this.categories);
    })
    if (this.documentEdit.clientType) this.requiredCompanyType = true;
    //  if (this.categories.length > 0) this.categoriesDp.editItem = this.categories.find(item => item.id === this.documentEdit.categoryId);

  }
  getSelectedClientType() {
    return this.companyTypes.find(item => item.type === this.documentEdit.clientType);
  }
  getSelectedCategory() {
    return this.categories.find(item => item.id === this.documentEdit.categoryId);
  }


}
