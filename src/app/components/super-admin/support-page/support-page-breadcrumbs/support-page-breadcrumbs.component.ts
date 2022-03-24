import { Component, OnInit } from '@angular/core';
import { SupportPageCategoriesStateService } from '../../state/support-page-categories/support-page-categories-state.service';

@Component({
  selector: 'support-page-breadcrumbs',
  templateUrl: './support-page-breadcrumbs.component.html',
  styleUrls: ['./support-page-breadcrumbs.component.scss']
})
export class SupportPageBreadcrumbsComponent implements OnInit {
  category: string;
  subCategory: string;
  subsubCategory: string;
  subsubSubCategory: string;
  constructor(private supportPageCategoriesStateService: SupportPageCategoriesStateService,) { }

  ngOnInit() {
    this.supportPageCategoriesStateService.onAddArticle.subscribe(data => {
      this.supportPageCategoriesStateService.getCategories().forEach(category => {
        if (category.id === data.id) {
          this.category = category.name;
          this.subCategory = null;
          this.subsubCategory = null;
          this.subsubSubCategory = null;
        }
        category.subcategories.forEach(subcategory => {
          if (subcategory.id === data.id) {
            this.category = category.name;
            this.subCategory = subcategory.name;
            this.subsubCategory = null;
            this.subsubSubCategory = null;

          }
          subcategory.subcategories.forEach(subsubcategory => {
            if (subsubcategory.id === data.id) {
              this.category = category.name;
              this.subCategory = subcategory.name;
              this.subsubCategory = subsubcategory.name;
              this.subsubSubCategory = null;
            }
            subsubcategory.subcategories.forEach(subsubsubcategory => {
              if (subsubsubcategory.id === data.id) {
                this.category = category.name;
                this.subCategory = subcategory.name;
                this.subsubCategory = subsubcategory.name;
                this.subsubSubCategory = subsubsubcategory.name;
              }

            })
          })
        })
      })
    })
  }

}
