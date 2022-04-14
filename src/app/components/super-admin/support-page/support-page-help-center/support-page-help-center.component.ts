import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { SupportPageCategory } from '../../left-panel-super-admin-categories/class/support-page-category';
import { SupportPageCategoriesStateService } from '../../state/support-page-categories/support-page-categories-state.service';

@Component({
  selector: 'support-page-help-center',
  templateUrl: './support-page-help-center.component.html',
  styleUrls: ['./support-page-help-center.component.scss']
})
export class SupportPageHelpCenterComponent implements OnInit {
  @Input() categories: Array<SupportPageCategory> = [];

  constructor(public activateRoute: ActivatedRoute,
    public companiesStateService: CompaniesStateService,
    private supportPageCategoriesStateService: SupportPageCategoriesStateService,
    private router: Router,) { }

  ngOnInit() {

  }
  public showPreview(data) {
    if (data.document) {
      this.supportPageCategoriesStateService.setMode("PREVIEW");
      this.router.navigate([`${this.companiesStateService.getCurrentCompany().name.replaceAll(' ', '')}/support-page`, data.id]);

    }
  }
  public trackById(index, item) {
    return item.id;
  }
}
