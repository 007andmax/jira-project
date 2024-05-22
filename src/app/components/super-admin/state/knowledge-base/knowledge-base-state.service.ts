import { EventEmitter, Injectable } from '@angular/core';
import { News } from '../../super-admin-knowledge-base/super-admin-knowledge-base-table/class/news';
import { CompanySetting } from 'src/app/components/companies/class/company-setting';

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
  statusList = [new CompanySetting('Published', 'PUBLISHED'), new CompanySetting('Draft', 'DRAFT'), new CompanySetting('Archived', 'ARCHIVED')];

  constructor() { }
  public getStatusList() {
    return this.statusList;
  }
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
