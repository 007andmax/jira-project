import { EventEmitter, Injectable } from '@angular/core';
import { Document } from 'src/app/components/documents/class/document';

@Injectable({
  providedIn: 'root',
})
export class DocumentsStateService {
  filter: EventEmitter<any> = new EventEmitter();
  categoryForRemove: Document;
  documentForRemove: Document;

  constructor() { }

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
