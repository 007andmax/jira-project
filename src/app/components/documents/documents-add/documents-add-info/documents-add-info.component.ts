import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
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
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { DatePickerComponent } from 'src/app/components/shared/date-picker/date-picker.component';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';

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
  requiredCompanyType: boolean;
  @Output() onChangeRequiredCompanyType = new EventEmitter<any>();
  @Input() documentAdd: DocumentAdd = new DocumentAdd();
  @Input() documentValidate: DocumentValidate = new DocumentValidate();
  @ViewChild('companyTypeDp') companyTypeDp: DropDownComponent;
  @ViewChild('reviewDp') reviewDp: DatePickerComponent;
  @Output() onToggleAside = new EventEmitter<any>();
  constructor(public documentsStateService: DocumentsStateService,
    public leftPanelStateService: LeftPanelStateService,
    public documentsService: DocumentsService,
    public cd: ChangeDetectorRef,
    private permissionsService: PermissionsService,
    public activateRoute: ActivatedRoute,) {
  }

  ngOnInit() {
    if (this.documentAdd.clientType) this.requiredCompanyType = true;
    this.categories = this.documentsStateService.getCategories();
    this.documentsStateService.onGetCategories.subscribe((data: any) => {
      this.categories = data;
      console.log("this.categories", this.categories);
    })
    this.documentAdd.setReviewDate(moment(new Date()).format('YYYY/MM/DD'));

  }
  onChangeTitle() {
    this.documentsService.checkTitle(this.documentAdd.title).subscribe(data => {
      console.log("data", data);
      this.documentValidate.setTitle(data)
    })
    // 
  }
  public goToDocumentsList() {
    this.leftPanelStateService.goToState('new-documents');
  }
  onResetCompanyType() {
    this.companyTypeDp.clearWithOutChanges();
    this.documentAdd.setClientType(null);
    console.log("requiredCompanyType", this.requiredCompanyType);
    this.onChangeRequiredCompanyType.emit(this.requiredCompanyType);
    this.cd.detectChanges();
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
  getSelectedClientType() {
    return this.companyTypes.find(item => item.type === this.documentAdd.clientType);
  }
  getSelectedCategory() {
    return this.categories.find(item => item.id === this.documentAdd.categoryId);
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  onSelectCategory(data) {

    this.documentAdd.setCategoryId((data) ? data.id : null);
  }
}
