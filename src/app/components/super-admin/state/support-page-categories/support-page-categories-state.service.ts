import { EventEmitter, Injectable } from '@angular/core';
import { SupportPageCategory } from '../../left-panel-super-admin-categories/class/support-page-category';
import { SupportPageCategoriesService } from '../../services/support-page-categories/support-page-categories.service';
import { SupportPageCategoriesRealTimeService } from './support-page-categories-real-time.service';

@Injectable({
  providedIn: 'root',
})
export class SupportPageCategoriesStateService {
  categories: Array<SupportPageCategory> = [];
  categoryForRemove: SupportPageCategory = null;
  onAddArticle: EventEmitter<any> = new EventEmitter();
  onGetCategories: EventEmitter<any> = new EventEmitter();
  constructor(private supportPageCategoriesService: SupportPageCategoriesService,
    private supportPageCategoriesRealTimeService: SupportPageCategoriesRealTimeService,) { }

  public onInit() {
    this.supportPageCategoriesService.getCategories().subscribe((data: any) => {
      this.categories = data.map(item => new SupportPageCategory(item));
      this.onGetCategories.emit(this.categories)
    })
    this.supportPageCategoriesRealTimeService.changeCategoryArray.subscribe(data => {
      if (data.action === "CREATE_SUPPORT_CATEGORY" && !data.data.parentSupportCategoryId) this.categories.push(new SupportPageCategory(data.data));
      if (data.action === "CREATE_SUPPORT_CATEGORY" && data.data.parentSupportCategoryId) {
        let add = false;
        this.categories.forEach(category => {
          if (category.id === data.data.parentSupportCategoryId && !add) {
            category.subcategories.push(new SupportPageCategory(data.data));
            console.log("category.subcategories", category.subcategories);
            add = true;
          }
          category.subcategories.forEach(subcategory => {
            if (subcategory.id === data.data.parentSupportCategoryId && !add) {
              subcategory.subcategories.push(new SupportPageCategory(data.data));
              console.log("subcategory.subcategories", subcategory.subcategories);
              add = true;
            }
            subcategory.subcategories.forEach(subsubcategory => {
              if (subsubcategory.id === data.data.parentSupportCategoryId && !add) {
                subsubcategory.subcategories.push(new SupportPageCategory(data.data));
                console.log("subsubcategory.subcategories", subsubcategory.subcategories);
                add = true;
              }

            })
          })
        })

      }

      if (data.action === "EDIT_SUPPORT_CATEGORY") {
        let findIndex = this.categories.findIndex(item => item.id === data.data.id);
        if (findIndex > -1) this.categories[findIndex].onUpdate(data.data);
      }
      if (data.action === "DELETE_SUPPORT_CATEGORY") {
        let findIndex = this.categories.findIndex(item => item.id === data.data);
        if (findIndex > -1) this.categories.splice(findIndex, 1);
      }

      this.onGetCategories.emit(this.categories)
    });
  }
  public getCategories() {
    return this.categories;
  }
  public setCategoryForRemove(data) {
    this.categoryForRemove = data;
  }
  public addArticle(data) {
    this.onAddArticle.emit(data);
  }
  public getCategoryForRemove() {
    return this.categoryForRemove;
  }
}
