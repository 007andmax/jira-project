
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SupportPageCategory } from '../../super-admin/left-panel-super-admin-categories/class/support-page-category';
import { SupportPageCategoriesStateService } from '../../super-admin/state/support-page-categories/support-page-categories-state.service';
import { SuperAdminPublicDetailComponent } from '../super-admin-public-detail/super-admin-public-detail.component';

@Component({
  standalone: true,
  imports: [SuperAdminPublicDetailComponent, CommonModule],
  selector: 'super-admin-public-category',
  templateUrl: './super-admin-public-category.component.html',
  styleUrls: ['./super-admin-public-category.component.scss'],

})
export class SuperAdminPublicCategoryComponent implements OnInit, OnDestroy {
  _id: string = '';
  isFirstOpen: boolean = true;
  selectedCategory: SupportPageCategory;
  sub: Subscription = new Subscription();
  constructor(public activateRoute: ActivatedRoute,
    private supportPageCategoriesStateService: SupportPageCategoriesStateService,) { }

  ngOnInit() {
    this._id = this.activateRoute.snapshot.params['id'];
    let subscription = this.activateRoute.params.subscribe(params => {
      this._id = params['id'];
      if (this._id) this.getCategories(this.supportPageCategoriesStateService.getCategories());
    });
    this.sub.add(subscription);
    if (this._id) this.getCategories(this.supportPageCategoriesStateService.getCategories());
    let onGetCategories = this.supportPageCategoriesStateService.onGetCategories.subscribe((data) => {
      if (this.isFirstOpen) this.getCategories(data);
    });
    this.sub.add(onGetCategories);
  }
  getCategories(data) {
    if (data.length > 0) this.isFirstOpen = false;
    data.forEach(category => {
      if (this._id && this._id == category.id) this.selectedCategory = category;
      category.subcategories.forEach(subcategory => {
        if (this._id && this._id == subcategory.id) this.selectedCategory = subcategory;
        subcategory.subcategories.forEach(subsubcategory => {
          if (this._id && this._id == subsubcategory.id) this.selectedCategory = subsubcategory;
          subsubcategory.subcategories.forEach(subsubsubcategory => {
            if (this._id && this._id == subsubsubcategory.id) this.selectedCategory = subsubsubcategory;
          })
        })
      })
    });
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
