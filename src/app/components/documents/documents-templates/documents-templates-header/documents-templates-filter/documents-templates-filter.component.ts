import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { DocumentsStateService } from 'src/app/states/documents/documents-state.service';
import { DocumentTemplateFilter } from '../../../class/document-template-filter';
import { Subscription } from 'rxjs';

@Component({
  selector: 'documents-templates-filter',
  templateUrl: './documents-templates-filter.component.html',
  styleUrls: ['./documents-templates-filter.component.scss']
})
export class DocumentsTemplatesFilterComponent implements OnInit, OnDestroy {
  categories: Array<any> = [];
  reducerItem: Function = (item) => `${item.name} (${item.count})`;
  documentTemplateFilter: DocumentTemplateFilter = new DocumentTemplateFilter();
  @ViewChild('categoryDp', { static: true }) categoryDp: DropDownComponent;
  @Output() changeCountFilter = new EventEmitter<any>();
  sub: Subscription = new Subscription();
  constructor(public documentsStateService: DocumentsStateService,
  ) { }

  ngOnInit() {
    let onGetCategoriesTemplate = this.documentsStateService.onGetCategoriesTemplate.subscribe(data => {
      this.categories = data;
      if (this.categoryDp) this.categoryDp.reset(this.categories);
    })
    this.sub.add(onGetCategoriesTemplate);
  }
  public onSelectCategory(data) {
    this.documentTemplateFilter.setCategoryId((data) ? data.id : null);
    this.documentsStateService.onInitFilterTemplate(this.documentTemplateFilter);
    this.onChangeCounterFilter();
  }
  public onSetSearch(data) {
    this.documentTemplateFilter.setSearch(data);
    this.documentsStateService.onInitFilterTemplate(this.documentTemplateFilter);
    this.onChangeCounterFilter();
  }
  public onChangeCounterFilter() {
    let count = 0;
    if (this.documentTemplateFilter.categoryId) count++;
    this.changeCountFilter.emit(count);
  }

  public onClearAll() {
    this.categoryDp.clearWithOutChanges();
    this.documentTemplateFilter.setCategoryId(null);
    this.documentsStateService.onInitFilterTemplate(this.documentTemplateFilter);
    this.onChangeCounterFilter();
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
