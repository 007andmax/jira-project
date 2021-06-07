import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { Document } from '../../class/document';
import * as moment from "moment";
import { DocumentsAddInfoComponent } from '../../documents-add/documents-add-info/documents-add-info.component';
import { DocumentsLinkedComponent } from '../../documents-add/documents-add-info/documents-linked/documents-linked.component';
import { DocumentsFilterTagsComponent } from '../../documents-header/documents-filter/documents-filter-tags/documents-filter-tags.component';
import { DocumentCompanyUser } from '../../documents-add/class/document-company-user';

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
  onChangeTitle() {
    this.documentsService.checkTitle(this.documentEdit.title, this.documentEdit.id).subscribe(data => {
      console.log("data", data);
      this.documentValidate.setTitle(data)
    })
    // 
  }
  onChangeLinked(data: Array<DocumentCompanyUser>) {
    console.log("data", data);
    this.documentEdit.setLinked(data.filter(item => item.type === "USER").map(item => item.id),
      data.filter(item => item.type === "COMPANY").map(item => item.id));
  }
  onSelectTags(data) {
    console.log("data", data);
    this.documentEdit.setTags(data);
  }
  onSelectCompanyType(data) {
    console.log('data', data);
    this.documentEdit.setClientType((data) ? data.type : null);
  }
  onChangeReviewDate(date) {
    this.documentEdit.setReviewDate(moment(new Date(date.year, date.month - 1, date.day)).format('YYYY/MM/DD'));
  }
  getSelectedClientType() {

    return this.companyTypes.find(item => item.type === this.documentEdit.clientType);
  }
  getSelectedCategory() {
    return this.categories.find(item => item.id === this.documentEdit.categoryId);
  }


}
