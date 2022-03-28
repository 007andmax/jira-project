import { EventEmitter, Injectable } from '@angular/core';
import { SupportPageCategory } from '../../left-panel-super-admin-categories/class/support-page-category';
import { SupportPageCategoriesService } from '../../services/support-page-categories/support-page-categories.service';
import { SupportPageInfoTag } from '../../support-page/support-page-info/support-page-info-tags/class/support-page-info-tag';
import { SupportPageCategoriesRealTimeService } from './support-page-categories-real-time.service';

@Injectable({
  providedIn: 'root',
})
export class SupportPageCategoriesStateService {
  categories: Array<SupportPageCategory> = [];
  categoryForRemove: SupportPageCategory = null;
  tagForRemove: SupportPageInfoTag = null;
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
      if (data.action === "EDIT_SUPPORT_CATEGORY" || data.action === "CREATE_SUPPORT_CATEGORY" && data.data.parentSupportCategoryId || data.action === "DELETE_SUPPORT_CATEGORY") {
        let add = false;
        if (data.action === "DELETE_SUPPORT_CATEGORY") {
          let findIndex = this.categories.findIndex(item => item.id === data.data);
          if (findIndex > -1) this.categories.splice(findIndex, 1);
        }
        this.categories.forEach(category => {
          if (data.action === "CREATE_SUPPORT_CATEGORY" && category.id === data.data.parentSupportCategoryId && !add) {
            category.subcategories.push(new SupportPageCategory(data.data));
            console.log("category.subcategories", category.subcategories);
            add = true;
          }
          if (data.action === "EDIT_SUPPORT_CATEGORY" && category.id === data.data.id) {
            category.onUpdate(data.data);
          }
          if (data.action === "DELETE_SUPPORT_CATEGORY") {
            let findIndex = category.subcategories.findIndex(item => item.id === data.data);
            if (findIndex > -1) category.subcategories.splice(findIndex, 1);
          }
          category.subcategories.forEach(subcategory => {
            if (data.action === "CREATE_SUPPORT_CATEGORY" && subcategory.id === data.data.parentSupportCategoryId && !add) {
              subcategory.subcategories.push(new SupportPageCategory(data.data));
              console.log("subcategory.subcategories", subcategory.subcategories);
              add = true;
            }
            if (data.action === "EDIT_SUPPORT_CATEGORY" && subcategory.id === data.data.id) {
              subcategory.onUpdate(data.data);
            }
            if (data.action === "DELETE_SUPPORT_CATEGORY") {
              let findIndex = subcategory.subcategories.findIndex(item => item.id === data.data);
              if (findIndex > -1) subcategory.subcategories.splice(findIndex, 1);
            }
            subcategory.subcategories.forEach(subsubcategory => {
              if (data.action === "CREATE_SUPPORT_CATEGORY" && subsubcategory.id === data.data.parentSupportCategoryId && !add) {
                subsubcategory.subcategories.push(new SupportPageCategory(data.data));
                console.log("subsubcategory.subcategories", subsubcategory.subcategories);
                add = true;
              }
              if (data.action === "EDIT_SUPPORT_CATEGORY" && subsubcategory.id === data.data.id) {
                subsubcategory.onUpdate(data.data);
              }
              if (data.action === "DELETE_SUPPORT_CATEGORY") {
                let findIndex = subsubcategory.subcategories.findIndex(item => item.id === data.data);
                if (findIndex > -1) subsubcategory.subcategories.splice(findIndex, 1);
              }
              subsubcategory.subcategories.forEach(subsubsubcategory => {
                if (data.action === "EDIT_SUPPORT_CATEGORY" && subsubsubcategory.id === data.data.id) {
                  subsubsubcategory.onUpdate(data.data);
                }
              })
            })
          })
        })
      }
      console.log("this.categories", this.categories);
      this.onGetCategories.emit(this.categories)
    });
  }
  public setTagForRemove(data) {
    this.tagForRemove = data;
  }
  public getTagForRemove() {
    return this.tagForRemove;
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
