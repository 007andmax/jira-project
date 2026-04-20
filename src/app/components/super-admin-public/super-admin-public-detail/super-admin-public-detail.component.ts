import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { environment } from 'src/environments/environment';
import { SupportPageCategory } from '../../super-admin/left-panel-super-admin-categories/class/support-page-category';
import { SupportPageCategoriesService } from '../../super-admin/services/support-page-categories/support-page-categories.service';
import { SupportPageCategoriesStateService } from '../../super-admin/state/support-page-categories/support-page-categories-state.service';
import { SupportPageCategoryContent } from '../../super-admin/support-page/class/support-page-category-content';

@Component({
    selector: 'super-admin-public-detail',
    templateUrl: './super-admin-public-detail.component.html',
    styleUrls: ['./super-admin-public-detail.component.scss'],
    standalone: true
})
export class SuperAdminPublicDetailComponent implements OnInit, OnDestroy {
  _id: string = '';
  isFirstOpen: boolean = true;
  categories: Array<SupportPageCategory> = [];
  @Input() selectedCategory: SupportPageCategory;
  supportPageCategoryContent: SupportPageCategoryContent = new SupportPageCategoryContent();
  sub: Subscription = new Subscription();
  constructor(private supportPageCategoriesStateService: SupportPageCategoriesStateService,
    private supportPageCategoriesService: SupportPageCategoriesService,
    private elRef: ElementRef,
    public activateRoute: ActivatedRoute,
    public companiesStateService: CompaniesStateService,
    private router: Router,
    public cd: ChangeDetectorRef) { }

  ngOnInit() {
    this._id = this.activateRoute.snapshot.params['id'];
    let subscription = this.activateRoute.params.subscribe(params => {
      this._id = params['id'];
      if (this._id) this.getCategories(this.supportPageCategoriesStateService.getCategories());
    });
    this.sub.add(subscription);
    if (this._id && this.isFirstOpen) this.getCategories(this.supportPageCategoriesStateService.getCategories());
    let onGetCategories = this.supportPageCategoriesStateService.onGetCategories.subscribe((data) => {
      if (this.isFirstOpen) this.getCategories(data);
      this.cd.detectChanges();
    });
    this.sub.add(onGetCategories);
  }
  getCategories(data) {
    if (data.length > 0) this.isFirstOpen = false;
    this.categories = data;
    this.categories.forEach(category => {
      if (this._id && this._id == category.id) {
        this.selectedCategory = category;
        category.toggleSubCategory = true;
        this.initPreviewMode();
        this.supportPageCategoriesStateService.toggleShowHelpCenter(false);
      }
      category.subcategories.forEach(subcategory => {
        if (this._id && this._id == subcategory.id) {
          this.selectedCategory = subcategory;
          category.toggleSubCategory = true;
          subcategory.toggleSubCategory = true;
          this.initPreviewMode();
          this.supportPageCategoriesStateService.toggleShowHelpCenter(false);
        }
        subcategory.subcategories.forEach(subsubcategory => {
          if (this._id && this._id == subsubcategory.id) {
            this.selectedCategory = subsubcategory;
            category.toggleSubCategory = true;
            subcategory.toggleSubCategory = true;
            subsubcategory.toggleSubCategory = true;
            this.initPreviewMode();
            this.supportPageCategoriesStateService.toggleShowHelpCenter(false);
          }
          subsubcategory.subcategories.forEach(subsubsubcategory => {
            if (this._id && this._id == subsubsubcategory.id) {
              this.selectedCategory = subsubsubcategory;
              category.toggleSubCategory = true;
              subcategory.toggleSubCategory = true;
              subsubcategory.toggleSubCategory = true;
              subsubsubcategory.toggleSubCategory = true;
              this.initPreviewMode();
              this.supportPageCategoriesStateService.toggleShowHelpCenter(false);
            }
          })
        })
      })
    });
  }
  selectCategory(data) {
    if (data.document) {
      this.selectedCategory = data;
      this.router.navigate([`${this.companiesStateService.getCurrentCompany().techDomain}/help-center`, data.id]);
    }
  }
  gotoHelpCenter() {
    this.router.navigate([`${this.companiesStateService.getCurrentCompany().techDomain}/help-center`]);
  }
  public initPreviewMode() {
    this.supportPageCategoriesStateService.showPreview(this.selectedCategory);
    this.supportPageCategoriesService.getContentCategory(this.selectedCategory.id).subscribe((content: any) => {
      this.supportPageCategoryContent.setEditMode(true);
      this.supportPageCategoryContent.setContent(content);
      this.supportPageCategoryContent.setIdTags(content.tags.map(item => item.id));
      this.supportPageCategoriesStateService.toggleShowHelpCenter(false);
      this.supportPageCategoryContent.setTags(content.tags);
      this.elRef.nativeElement.querySelector(".topic-detail-page__body-content #content").innerHTML = "";
      this.elRef.nativeElement.querySelector(".topic-detail-page__body-content #content").insertAdjacentHTML('afterbegin', this.supportPageCategoryContent.parseContent(`${environment.apiUrl}/#/${this.companiesStateService.getCurrentCompany().techDomain}/help-center`));
      document.body.querySelector(".main-container").scrollTo(0, 0);
    })
  }
  showPreview(data) {
    if (data.document) {
      this.selectedCategory = data;
      this.router.navigate([`${this.companiesStateService.getCurrentCompany().techDomain}/help-center`, data.id]);
    }
  }
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
