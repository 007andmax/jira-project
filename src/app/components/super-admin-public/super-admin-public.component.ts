import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { SupportPageCategory } from '../super-admin/left-panel-super-admin-categories/class/support-page-category';
import { SupportPageCategoriesStateService } from '../super-admin/state/support-page-categories/support-page-categories-state.service';
import { SuperAdminPublicDetailComponent } from './super-admin-public-detail/super-admin-public-detail.component';

@Component({
  selector: 'super-admin-public',
  templateUrl: './super-admin-public.component.html',
  styleUrls: ['./super-admin-public.component.scss']
})
export class SuperAdminPublicComponent implements OnInit {
  categories: Array<SupportPageCategory> = [];
  isShowHelpCenter: boolean = true;
  selectedCategory: SupportPageCategory;
  constructor(private supportPageCategoriesStateService: SupportPageCategoriesStateService,
    public companiesStateService: CompaniesStateService,
    private router: Router,
    public cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.supportPageCategoriesStateService.onGetCategories.subscribe(data => {
      this.categories = data;
      this.cd.detectChanges();
    })
  }
  selectCategory(data) {
    console.log("data", data);
    if (data.document) {
      this.selectedCategory = data;
      this.goToCategory(data.id);
    }
    this.isShowHelpCenter = false;
    this.supportPageCategoriesStateService.showPreview(this.selectedCategory);

  }
  public goToCategory(id) {
    // this.supportPageCategoriesStateService.setMode("PREVIEW");
    this.router.navigate([`${this.companiesStateService.getCurrentCompany().name.replaceAll(' ', '')}/help-center`, id]);
  }
  public trackById(index, item) {
    return item.id;
  }
}
