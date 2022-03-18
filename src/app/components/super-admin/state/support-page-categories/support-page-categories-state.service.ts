import { Injectable } from '@angular/core';
import { SupportPageCategory } from '../../left-panel-super-admin-categories/class/support-page-category';

@Injectable({
  providedIn: 'root',
})
export class SupportPageCategoriesStateService {
  categoryForRemove: SupportPageCategory = null;
  constructor() { }

  public setCategoryForRemove(data) {
    this.categoryForRemove = data;
  }
  public getCategoryForRemove() {
    return this.categoryForRemove;
  }
}
