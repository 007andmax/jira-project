import { EventEmitter, Injectable } from '@angular/core';
import { Document } from 'src/app/components/documents/class/document';
import { CategoryDocument } from 'src/app/components/left-panel/left-panel-documents/class/category-document';
import { DocumentsService } from 'src/app/services/documents/documents.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentsStateService {
  filter: EventEmitter<any> = new EventEmitter();
  categoryForRemove: Document;
  documentForRemove: Document;
  onGetCategories: EventEmitter<any> = new EventEmitter();
  categories: Array<CategoryDocument> = [];
  constructor(private documentsService: DocumentsService,) { }

  public onInit() {
    this.documentsService.getCategories().subscribe((data: any) => {
      this.categories = data.map(item => new CategoryDocument(item));
      this.categories.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
        1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
      this.onGetCategories.emit(this.categories);
    })
  }
  public getCategories() {
    return this.categories;
  }

  public onInitFilter(data) {
    this.filter.emit(data);
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
