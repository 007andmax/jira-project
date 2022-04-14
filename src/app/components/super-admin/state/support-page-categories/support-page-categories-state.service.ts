import { EventEmitter, Injectable } from '@angular/core';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { SupportPageCategory } from '../../left-panel-super-admin-categories/class/support-page-category';
import { SupportPageCategoriesService } from '../../services/support-page-categories/support-page-categories.service';
import { SupportPageInfoTag } from '../../support-page/support-page-info/support-page-info-tags/class/support-page-info-tag';
import { SupportPageCategoriesRealTimeService } from './support-page-categories-real-time.service';

@Injectable({
  providedIn: 'root',
})
export class SupportPageCategoriesStateService {
  mode: string = 'EDIT';
  isShowHelpCenter: boolean = true;
  categories: Array<SupportPageCategory> = [];
  categoryForRemove: SupportPageCategory = null;
  tagForRemove: SupportPageInfoTag = null;
  onPreviewContent: EventEmitter<any> = new EventEmitter();
  onShowHelpCenter: EventEmitter<any> = new EventEmitter();
  onGetCategories: EventEmitter<any> = new EventEmitter();
  onToggleShowHelpCenter: EventEmitter<any> = new EventEmitter();
  constructor(private supportPageCategoriesService: SupportPageCategoriesService,
    private usersStateService: UsersStateService,
    private supportPageCategoriesRealTimeService: SupportPageCategoriesRealTimeService,) { }

  public onInit() {
    this.supportPageCategoriesService.getCategories(this.usersStateService.getCurrentUser().role).subscribe((data: any) => {
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
            add = true;
          }
          if (data.action === "EDIT_SUPPORT_CATEGORY" && category.id === data.data.id) category.onUpdate(data.data);
          if (data.action === "DELETE_SUPPORT_CATEGORY") {
            let findIndex = category.subcategories.findIndex(item => item.id === data.data);
            if (findIndex > -1) category.subcategories.splice(findIndex, 1);
          }
          category.subcategories.forEach(subcategory => {
            if (data.action === "CREATE_SUPPORT_CATEGORY" && subcategory.id === data.data.parentSupportCategoryId && !add) {
              subcategory.subcategories.push(new SupportPageCategory(data.data));
              add = true;
            }
            if (data.action === "EDIT_SUPPORT_CATEGORY" && subcategory.id === data.data.id) subcategory.onUpdate(data.data);
            if (data.action === "DELETE_SUPPORT_CATEGORY") {
              let findIndex = subcategory.subcategories.findIndex(item => item.id === data.data);
              if (findIndex > -1) subcategory.subcategories.splice(findIndex, 1);
            }
            subcategory.subcategories.forEach(subsubcategory => {
              if (data.action === "CREATE_SUPPORT_CATEGORY" && subsubcategory.id === data.data.parentSupportCategoryId && !add) {
                subsubcategory.subcategories.push(new SupportPageCategory(data.data));
                add = true;
              }
              if (data.action === "EDIT_SUPPORT_CATEGORY" && subsubcategory.id === data.data.id) subsubcategory.onUpdate(data.data);
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
      this.onGetCategories.emit(this.categories)
    });
  }
  public setMode(data) {
    this.mode = data;
  }
  public getMode() {
    return this.mode;
  }
  public getShowHelpCenter() {
    return this.isShowHelpCenter;
  }
  public toggleShowHelpCenter(data) {
    this.isShowHelpCenter = data;
    this.onToggleShowHelpCenter.emit(data);
  }
  public showPreview(data) {
    this.onPreviewContent.emit(data);
  }
  public showHelpCenter() {
    this.onShowHelpCenter.emit(null);
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
  public getCategoryForRemove() {
    return this.categoryForRemove;
  }
}
