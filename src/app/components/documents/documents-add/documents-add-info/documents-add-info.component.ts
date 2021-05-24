import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CompanySetting } from 'src/app/components/companies/class/company-setting';
import { CategoryDocument } from 'src/app/components/left-panel/left-panel-documents/class/category-document';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { TitleListType } from 'src/app/components/tickets/tickets/tickets-header/class/title-list-type';
import { DocumentsStateService } from 'src/app/states/documents/documents-state.service';

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
  @ViewChild('companyTypeDp') companyTypeDp: DropDownComponent;
  @Output() onToggleAside = new EventEmitter<any>();
  constructor(private documentsStateService: DocumentsStateService,) { }

  ngOnInit() {
    this.categories = this.documentsStateService.getCategories();
    this.documentsStateService.onGetCategories.subscribe((data: any) => {
      this.categories = data;
      console.log("this.categories", this.categories);
    })
  }
  onResetCompanyType() {
    this.companyTypeDp.clearWithOutChanges();
  }
  public toggleAside() {
    this.openAside = !this.openAside;
    this.onToggleAside.emit(this.openAside);
  }
  onChangeLinked(data) {

  }
}
