import { EventEmitter, Injectable } from '@angular/core';
import { Document } from 'src/app/components/documents/class/document';
import { CategoryDocument } from 'src/app/components/left-panel/left-panel-documents/class/category-document';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { DocumentsRealTimeService } from './documents-real-time.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentsStateService {
  filter: EventEmitter<any> = new EventEmitter();
  filterTemplate: EventEmitter<any> = new EventEmitter();
  onGetCategoriesTemplate: EventEmitter<any> = new EventEmitter();
  categoryForRemove: Document;
  documentForRemove: Document;
  categoriesForRemove: Array<CategoryDocument>;
  onGetTemplate: EventEmitter<any> = new EventEmitter();
  onGetCategories: EventEmitter<any> = new EventEmitter();
  categories: Array<CategoryDocument> = [];
  onChangeDocument: EventEmitter<any> = new EventEmitter();
  constructor(private documentsService: DocumentsService,
    private documentsRealTimeService: DocumentsRealTimeService) { }

  public onInit() {
    this.documentsService.getCategories().subscribe((data: any) => {
      this.categories = data.map(item => new CategoryDocument(item));
      this.categories.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
        1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
      this.onGetCategories.emit(this.categories);
    })
    this.documentsRealTimeService.changeCategoriesArray.subscribe(data => {
      if (data.action === "DOCUMENT_CATEGORY_SAVED") this.categories.push(new CategoryDocument(data.data));
      if (data.action === "DOCUMENT_CATEGORY_EDITED") {
        let findIndex = this.categories.findIndex(item => item.id === data.data.id);
        if (findIndex > -1) this.categories[findIndex] = new CategoryDocument(data.data);
      }
      if (data.action === "DOCUMENT_CATEGORY_REMOVED") {
        let findIndex = this.categories.findIndex(item => item.id === data.data);
        if (findIndex > -1) this.categories.splice(findIndex, 1);
      }
      this.onGetCategories.emit(this.categories);
    })
    this.documentsRealTimeService.changeDocumentsArray.subscribe(data => {
      this.onChangeDocument.emit(data);
    })
  }
  public getCategoriesForRemove() {
    return this.categoriesForRemove;
  }
  public setCategoriesForRemove(data) {
    this.categoriesForRemove = data;
  }
  public onInitGetTemplate(data) {
    this.onGetTemplate.emit(data);
  }
  public getCategories() {
    return this.categories;
  }
  public setCategoriesTemplate(data) {
    this.onGetCategoriesTemplate.emit(data);
  }
  public onInitFilter(data) {
    this.filter.emit(data);
  }
  public onInitFilterTemplate(data) {
    this.filterTemplate.emit(data);
  }
  public setCategoryForRemove(data) {
    this.categoryForRemove = data;
  }
  public setDocumentForRemove(data) {
    this.documentForRemove = data;
  }

  public getCategoryForRemove() {
    return this.categoryForRemove;
  }
  public getDocumentForRemove() {
    return this.documentForRemove;
  }
}
