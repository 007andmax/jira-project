import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SupportPageCategory } from '../../super-admin/left-panel-super-admin-categories/class/support-page-category';
import { SupportPageCategoriesService } from '../../super-admin/services/support-page-categories/support-page-categories.service';
import { SupportPageCategoriesStateService } from '../../super-admin/state/support-page-categories/support-page-categories-state.service';
import { SupportPageCategoryContent } from '../../super-admin/support-page/class/support-page-category-content';

@Component({
  selector: 'super-admin-public-detail',
  templateUrl: './super-admin-public-detail.component.html',
  styleUrls: ['./super-admin-public-detail.component.scss']
})
export class SuperAdminPublicDetailComponent implements OnInit {
  categories: Array<SupportPageCategory> = [];
  @Input() selectedCategory: SupportPageCategory;
  supportPageCategoryContent: SupportPageCategoryContent = new SupportPageCategoryContent();
  @Output() onGoHelpCenter = new EventEmitter();
  constructor(private supportPageCategoriesStateService: SupportPageCategoriesStateService,
    private supportPageCategoriesService: SupportPageCategoriesService,
    private elRef: ElementRef,
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
      this.showPreview(this.selectedCategory);
      window.scrollTo(0, 0);
    })
    this.supportPageCategoriesStateService.onGetCategories.subscribe(data => {
      this.categories = data;
      this.cd.detectChanges();
    })
  }
  gotoHelpCenter() {
    this.onGoHelpCenter.emit(null);
  }
  showPreview(data) {
    if (data.document) {
      this.selectedCategory = data;
      if (this.selectedCategory.document) {
        this.supportPageCategoriesService.getContentCategory(this.selectedCategory.id).subscribe((content: any) => {
          this.supportPageCategoryContent.setEditMode(true);
          this.supportPageCategoryContent.setContent(content);
          this.supportPageCategoryContent.setTags(content.tags.map(item => item.id));
          this.elRef.nativeElement.querySelector(".topic-detail-page__body-content").insertAdjacentHTML('afterbegin', this.supportPageCategoryContent.newContent);
        })
      }
    }
  }
}
