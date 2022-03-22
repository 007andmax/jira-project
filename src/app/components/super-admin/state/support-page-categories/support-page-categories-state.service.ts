import { EventEmitter, Injectable } from '@angular/core';
import { SupportPageCategory } from '../../left-panel-super-admin-categories/class/support-page-category';
import { SupportPageCategoriesRealTimeService } from './support-page-categories-real-time.service';

@Injectable({
  providedIn: 'root',
})
export class SupportPageCategoriesStateService {
  categoryForRemove: SupportPageCategory = null;
  constructor(private supportPageCategoriesRealTimeService: SupportPageCategoriesRealTimeService) { }

  public setCategoryForRemove(data) {
    this.categoryForRemove = data;
  }
  public getCategoryForRemove() {
    return this.categoryForRemove;
  }
}
