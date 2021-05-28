import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CategoryDocument } from 'src/app/components/left-panel/left-panel-documents/class/category-document';
import { DocumentsStateService } from 'src/app/states/documents/documents-state.service';
import { DocumentTemplateFilter } from '../../../class/document-template-filter';

@Component({
  selector: 'documents-templates-filter',
  templateUrl: './documents-templates-filter.component.html',
  styleUrls: ['./documents-templates-filter.component.scss']
})
export class DocumentsTemplatesFilterComponent implements OnInit {
  categories: Array<any> = [];
  reducerItem: Function = (item) => `${item.name} (${item.count})`;
  documentTemplateFilter: DocumentTemplateFilter = new DocumentTemplateFilter();
  @Output() changeCountFilter = new EventEmitter<any>();
  constructor(public documentsStateService: DocumentsStateService,
  ) { }

  ngOnInit() {
    this.documentsStateService.onGetCategoriesTemplate.subscribe(data => {
      this.categories = data;
      console.log("this.categories", this.categories);
    })

  }
  public onSelectCompany(data) {
    this.documentTemplateFilter.setCategoryId((data) ? data.id : null);
    this.documentsStateService.onInitFilterTemplate(this.documentTemplateFilter);
    this.onChangeCounterFilter();
  }
  public onChangeCounterFilter() {
    let count = 0;
    if (this.documentTemplateFilter.categoryId) count++;

    this.changeCountFilter.emit(count);
  }



}
