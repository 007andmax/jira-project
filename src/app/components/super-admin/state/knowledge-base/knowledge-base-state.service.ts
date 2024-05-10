import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KnowledgeBaseStateService {
  onSelectNews: EventEmitter<any> = new EventEmitter();
  onGetNews: EventEmitter<any> = new EventEmitter();
  constructor() { }
  public setNews(data) {
    this.onGetNews.emit(data);
  }
}
