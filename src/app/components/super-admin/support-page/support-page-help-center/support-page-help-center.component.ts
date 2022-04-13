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
  _id: string = '';
  @Input() categories: Array<SupportPageCategory> = [];
  sub: Subscription = new Subscription();

  constructor(public activateRoute: ActivatedRoute,
    public companiesStateService: CompaniesStateService,
    private supportPageCategoriesStateService: SupportPageCategoriesStateService,
    private router: Router,) { }

  ngOnInit() {
    this._id = this.activateRoute.snapshot.params['id'];
    let subscription = this.activateRoute.params.subscribe(params => {
      this._id = params['id'];
    });
    this.sub.add(subscription);
  }
  public showPreview(data) {
    if (data.document) {
      /* this.selectedCategory = data;
       this.supportPageCategoriesStateService.showPreview(this.selectedCategory);
       this.supportPageCategoriesService.getContentCategory(this.selectedCategory.id).subscribe((content: any) => {
         this.supportPageCategoryContent.setEditMode(true);
         this.supportPageCategoryContent.setContent(content);
         this.supportPageCategoryContent.setIdTags(content.tags.map(item => item.id));
         this.content = JSON.parse(JSON.stringify(this.supportPageCategoryContent.document.content));
         this.header.setPreview(true);
         this.isShowHelpCenter = false;
       })*/
      this.goToCategory(data.id);
    }
  }
  public trackById(index, item) {
    return item.id;
  }
  public goToCategory(id) {
    this.supportPageCategoriesStateService.setMode("PREVIEW");
    this.router.navigate([`${this.companiesStateService.getCurrentCompany().name.replaceAll(' ', '')}/support-page`, id]);
  }
}
