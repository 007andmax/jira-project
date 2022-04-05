import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SupportPageCategory } from '../../super-admin/left-panel-super-admin-categories/class/support-page-category';
import { SupportPageCategoriesStateService } from '../../super-admin/state/support-page-categories/support-page-categories-state.service';

@Component({
  selector: 'super-admin-public-detail',
  templateUrl: './super-admin-public-detail.component.html',
  styleUrls: ['./super-admin-public-detail.component.scss']
})
export class SuperAdminPublicDetailComponent implements OnInit {
  categories: Array<SupportPageCategory> = [];
  selectedCategory: SupportPageCategory;
  constructor(private supportPageCategoriesStateService: SupportPageCategoriesStateService,
    public cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.supportPageCategoriesStateService.onPreviewContent.subscribe(data => {
      this.selectedCategory = data;

      this.categories.forEach(category => {
        if (category.id === this.selectedCategory.id) {
          category.toggleSubCategory = true;
        }
        category.subcategories.forEach(subcategory => {
          if (subcategory.id === this.selectedCategory.id) {
            category.toggleSubCategory = true;
            subcategory.toggleSubCategory = true;
          }
          subcategory.subcategories.forEach(subsubcategory => {
            if (subsubcategory.id === this.selectedCategory.id) {
              category.toggleSubCategory = true;
              subcategory.toggleSubCategory = true;
              subsubcategory.toggleSubCategory = true;
            }
            subsubcategory.subcategories.forEach(subsubsubcategory => {
              if (subsubsubcategory.id === this.selectedCategory.id) {
                category.toggleSubCategory = true;
                subcategory.toggleSubCategory = true;
                subsubcategory.toggleSubCategory = true;
                subsubsubcategory.toggleSubCategory = true;
              }

            })
          })
        })
      })
    })
    this.supportPageCategoriesStateService.onGetCategories.subscribe(data => {
      this.categories = data;
      this.cd.detectChanges();
    })
  }

}
