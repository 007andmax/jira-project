import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CompanySetting } from 'src/app/components/companies/class/company-setting';
import { CategoryDocument } from 'src/app/components/left-panel/left-panel-documents/class/category-document';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { TitleListType } from 'src/app/components/tickets/tickets/tickets-header/class/title-list-type';
import { DocumentsStateService } from 'src/app/states/documents/documents-state.service';
import { DocumentAdd } from '../class/document-add';
import * as moment from "moment";
import { DocumentCompanyUser } from '../class/document-company-user';
import { DocumentValidate } from '../class/document-validate';
import { ActivatedRoute } from '@angular/router';
import { DocumentsService } from 'src/app/services/documents/documents.service';

@Component({
  selector: 'app-documents-add-info',
  templateUrl: './documents-add-info.component.html',
  styleUrls: ['./documents-add-info.component.scss']
})
export class DocumentsAddInfoComponent implements OnInit {
  openAside: boolean = true;
  toggleEditCategories: boolean = false;
  tab: string = 'DOCUMENT_INFO';
  categories: Array<CategoryDocument> = [];
  companyTypes = [new TitleListType('All companies', 'ALL'), new TitleListType('Client', 'CLIENT'), new TitleListType('Lead', 'LEAD'), new TitleListType('Vendor', 'VENDOR')];
  requiredCompanyType: boolean = false;
  @Input() documentAdd: DocumentAdd = new DocumentAdd();
  @Input() documentValidate: DocumentValidate = new DocumentValidate();
  @ViewChild('companyTypeDp') companyTypeDp: DropDownComponent;
  @Output() onToggleAside = new EventEmitter<any>();
  constructor(public documentsStateService: DocumentsStateService,
    public documentsService: DocumentsService,
    public activateRoute: ActivatedRoute,) { }

  ngOnInit() {
    this.categories = this.documentsStateService.getCategories();
    this.documentsStateService.onGetCategories.subscribe((data: any) => {
      this.categories = data;
      console.log("this.categories", this.categories);
    })
    this.documentAdd.setReviewDate(moment(new Date()).format('YYYY/MM/DD'));

  }
  onResetCompanyType() {
    this.companyTypeDp.clearWithOutChanges();
  }
  public toggleAside() {
    this.openAside = !this.openAside;
    this.onToggleAside.emit(this.openAside);
  }

  onChangeLinked(data: Array<DocumentCompanyUser>) {
    console.log("data", data);
    this.documentAdd.setLinked(data.filter(item => item.type === "USER").map(item => item.id),
      data.filter(item => item.type === "COMPANY").map(item => item.id));
  }
  onSelectCompanyType(data) {
    console.log('data', data);
    this.documentAdd.setClientType((data) ? data.type : null);
  }
  onChangeReviewDate(date) {
    this.documentAdd.setReviewDate(moment(new Date(date.year, date.month - 1, date.day)).format('YYYY/MM/DD'));
  }
  onSelectTags(data) {
    console.log("data", data);
    this.documentAdd.setTags(data);
  }
  onSelectCategory(data) {
    this.documentAdd.setCategoryId((data) ? data.id : null);
  }
}
