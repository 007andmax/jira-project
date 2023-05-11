import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { SupportPageCategory } from '../super-admin/left-panel-super-admin-categories/class/support-page-category';
import { SupportPageCategoriesStateService } from '../super-admin/state/support-page-categories/support-page-categories-state.service';

@Component({
  selector: 'super-admin-public',
  templateUrl: './super-admin-public.component.html',
  styleUrls: ['./super-admin-public.component.scss']
})
export class SuperAdminPublicComponent implements OnInit {
  categories: Array<SupportPageCategory> = [];
  selectedCategory: SupportPageCategory;
  constructor(private supportPageCategoriesStateService: SupportPageCategoriesStateService,
    public companiesStateService: CompaniesStateService,
    private router: Router,
    public cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.categories = this.supportPageCategoriesStateService.getCategories();
    this.cd.detectChanges();
    this.supportPageCategoriesStateService.onGetCategories.subscribe(data => {
      this.categories = data;
      this.cd.detectChanges();
    })
  }
  selectCategory(data) {
    if (data.document) {
      this.selectedCategory = data;
      this.goToCategory(data.id);
    }
  }
  public goToCategory(id) {
    this.router.navigate([`${this.companiesStateService.getCurrentCompany().domain}/help-center`, id]);
  }
  public trackById(index, item) {
    return item.id;
  }
}
