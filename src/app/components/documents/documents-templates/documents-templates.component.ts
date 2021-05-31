import { Component, OnInit, ViewChild } from '@angular/core';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { DocumentsStateService } from 'src/app/states/documents/documents-state.service';
import { Document } from '../class/document';
import { DocumentFilter } from '../class/document-filter';
import { DocumentTemplateFilter } from '../class/document-template-filter';
import { DocumentsTemplatesHeaderComponent } from './documents-templates-header/documents-templates-header.component';

@Component({
  selector: 'documents-templates',
  templateUrl: './documents-templates.component.html',
  styleUrls: ['./documents-templates.component.scss']
})
export class DocumentsTemplatesComponent implements OnInit {
  openCategories: boolean = false;
  showPreloader: boolean = true;
  tab = 'TEMPLATE_GALLERY';
  @ViewChild('header') header: DocumentsTemplatesHeaderComponent;
  list: Array<Document> = [];
  filter: DocumentTemplateFilter = new DocumentTemplateFilter();
  constructor(private documentsService: DocumentsService,
    private documentsStateService: DocumentsStateService) { }

  ngOnInit() {

    this.filter.setDocumentType("TEMPLATE");
    this.documentsStateService.filterTemplate.subscribe(data => {
      // this.showPreloader = true;
      this.filter.setFilters(data);

      this.getFilterList();

    })
    this.getListCategories();
    this.getFilterList();
  }
  showTemplate(item) {
    console.log("item", item);
    if (item) this.documentsStateService.onInitGetTemplate(item);
  }
  onSearch(data) {
    this.filter.setSearch(data);
    this.getFilterList();
  }
  getListCategories() {
    this.documentsService.getTemplateCategories((this.tab === 'TEMPLATE_GALLERY')).subscribe(data => {
      console.log("data", data);
      this.documentsStateService.setCategoriesTemplate(data);
    })
  }
  getFilterList() {
    this.showPreloader = true;
    this.list = [];
    console.log("this.filter", this.filter);
    this.filter.setIsDefaultTemplate((this.tab === 'TEMPLATE_GALLERY'));
    this.documentsService.filterDocuments(this.filter.getDataForFilter()).subscribe((data: any) => {

      data.map(item => this.list.push(new Document(item)));
      this.list.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ?
        1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0));
      this.showPreloader = false;
      console.log("this.list", this.list);
    })
  }
  onChangeTemplate(data) {
    this.tab = data;
    this.header.clearSearchWithoutChange();
    this.header.filter.categoryDp.clearWithOutChanges();
    this.header.filter.onChangeCounterFilter();
    this.filter.setSearch("");
    this.getListCategories();
    this.getFilterList();
  }
  toggleOpenCategories() {

    this.openCategories = !this.openCategories;
    console.log("toggleOpenCategories", this.openCategories)
  }
}
