import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { SupportPageCategory } from '../../left-panel-super-admin-categories/class/support-page-category';
import { SupportPageCategoriesStateService } from '../../state/support-page-categories/support-page-categories-state.service';

@Component({
  selector: 'support-page-breadcrumbs',
  templateUrl: './support-page-breadcrumbs.component.html',
  styleUrls: ['./support-page-breadcrumbs.component.scss']
})
export class SupportPageBreadcrumbsComponent implements OnInit {
  @Input() selectedCategory: SupportPageCategory;
  category: string;
  subCategory: string;
  subsubCategory: string;
  subsubSubCategory: string;
  constructor(private supportPageCategoriesStateService: SupportPageCategoriesStateService,
    public cd: ChangeDetectorRef) { }

  ngOnInit() {

  }
  ngDoCheck() {
    if (!this.selectedCategory) return;
    this.supportPageCategoriesStateService.getCategories().forEach(category => {
      if (category.id === this.selectedCategory.id) {
        this.category = category.name;
        this.subCategory = null;
        this.subsubCategory = null;
        this.subsubSubCategory = null;
      }
      category.subcategories.forEach(subcategory => {
        if (subcategory.id === this.selectedCategory.id) {
          this.category = category.name;
          this.subCategory = subcategory.name;
          this.subsubCategory = null;
          this.subsubSubCategory = null;

        }
        subcategory.subcategories.forEach(subsubcategory => {
          if (subsubcategory.id === this.selectedCategory.id) {
            this.category = category.name;
            this.subCategory = subcategory.name;
            this.subsubCategory = subsubcategory.name;
            this.subsubSubCategory = null;
          }
          subsubcategory.subcategories.forEach(subsubsubcategory => {
            if (subsubsubcategory.id === this.selectedCategory.id) {
              this.category = category.name;
              this.subCategory = subcategory.name;
              this.subsubCategory = subsubcategory.name;
              this.subsubSubCategory = subsubsubcategory.name;
            }

          })
        })
      })
      this.cd.markForCheck();
    })
  }
}
