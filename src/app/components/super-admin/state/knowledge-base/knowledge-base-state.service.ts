import { EventEmitter, Injectable } from '@angular/core';
import { News } from '../../super-admin-knowledge-base/super-admin-knowledge-base-table/class/news';

@Injectable({
  providedIn: 'root'
})
export class KnowledgeBaseStateService {
  onSelectNews: EventEmitter<any> = new EventEmitter();
  onGetNews: EventEmitter<any> = new EventEmitter();
  newsForDelete: News;
  constructor() { }
  public setNews(data) {
    this.onGetNews.emit(data);
  }
  public setNewsForDelete(data) {
    this.newsForDelete = data;
  }
  public getNewsForDelete() {
    return this.newsForDelete;
  }
}
