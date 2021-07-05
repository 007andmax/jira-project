import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { Document } from '../../class/document';
import * as moment from "moment";
import { DocumentsAddInfoComponent } from '../../documents-add/documents-add-info/documents-add-info.component';
import { DocumentsLinkedComponent } from '../../documents-add/documents-add-info/documents-linked/documents-linked.component';
import { DocumentCompanyUser } from '../../documents-add/class/document-company-user';
import { CompanyTagsComponent } from 'src/app/components/companies/company-tags/company-tags.component';

@Component({
  selector: 'documents-edit-info',
  templateUrl: './documents-edit-info.component.html',
  styleUrls: ['./documents-edit-info.component.scss']
})
export class DocumentsEditInfoComponent extends DocumentsAddInfoComponent {

  @Input() documentEdit: Document;
  @Input() linked: DocumentsLinkedComponent;
  @ViewChild('categoriesDp') categoriesDp: DropDownComponent;
  @ViewChild('tagsDp') tagsDp: CompanyTagsComponent;
  sub: Subscription = new Subscription();

  ngOnInit() {

    this.categories = this.documentsStateService.getCategories();
    this.documentsStateService.onGetCategories.subscribe((data: any) => {
      this.categories = data;
    })
    if (this.documentEdit.clientType) this.requiredCompanyType = true;
    console.log("this.documentEdit", this.documentEdit);
    console.log("tagsDp", this.tagsDp);

  }
  onChangeTitle() {
    this.documentsService.checkTitle(this.documentEdit.title, this.documentEdit.id).subscribe(data => {
      this.documentValidate.setUniqueTittle(data);
      this.documentValidate.resetTitle();
    })
  }
  onChangeLinked(data: Array<DocumentCompanyUser>) {
    this.documentEdit.setLinked(data.filter(item => item.type === "USER").map(item => item.id),
      data.filter(item => item.type === "COMPANY").map(item => item.id));
  }
  onSelectCategory(data) {
    this.documentEdit.setCategoryId((data) ? data.id : null);
  }
  onSelectTags(data) {
    this.documentEdit.setTags(data);
  }
  onResetCompanyType() {
    this.companyTypeDp.clearWithOutChanges();
    this.documentEdit.setClientType(null);
  }
  onSelectCompanyType(data) {
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
