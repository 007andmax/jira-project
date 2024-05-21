import { EventEmitter, Injectable } from '@angular/core';
import { News } from '../../super-admin-knowledge-base/super-admin-knowledge-base-table/class/news';

@Injectable({
  providedIn: 'root'
})
export class KnowledgeBaseStateService {
  onAddNews: EventEmitter<any> = new EventEmitter();
  onSelectNews: EventEmitter<any> = new EventEmitter();
  onGetNews: EventEmitter<any> = new EventEmitter();
  onEditNews: EventEmitter<any> = new EventEmitter();
  onChangeNews: EventEmitter<any> = new EventEmitter();
  newsForDelete: News;
  constructor() { }
  public addNews(data) {
    this.onAddNews.emit(data);
  }
  public changeNews(data) {
    this.onChangeNews.emit(data);
  }
  public setNews(data) {
    this.onGetNews.emit(data);
  }
  public editNews(data) {
    this.onEditNews.emit(data);
  }
  public setNewsForDelete(data) {
    this.newsForDelete = data;
  }
  public getNewsForDelete() {
    return this.newsForDelete;
  }
}
