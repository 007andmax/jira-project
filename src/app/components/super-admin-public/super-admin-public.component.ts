import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SupportPageCategory } from '../super-admin/left-panel-super-admin-categories/class/support-page-category';
import { SupportPageCategoriesStateService } from '../super-admin/state/support-page-categories/support-page-categories-state.service';

@Component({
  selector: 'super-admin-public',
  templateUrl: './super-admin-public.component.html',
  styleUrls: ['./super-admin-public.component.scss']
})
export class SuperAdminPublicComponent implements OnInit {
  categories: Array<SupportPageCategory> = [];
  constructor(private supportPageCategoriesStateService: SupportPageCategoriesStateService,
    public cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.supportPageCategoriesStateService.onGetCategories.subscribe(data => {
      this.categories = data;
      this.cd.detectChanges();
    })
  }
  public trackById(index, item) {
    return item.id;
  }
}
