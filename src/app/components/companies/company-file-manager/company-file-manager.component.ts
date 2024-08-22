import { Component, OnInit } from '@angular/core';
import { fadeInAnimation } from 'src/app/animations/fade-in.animation';
import { FileManagerComponent } from '../../file-manager/file-manager.component';
import { FileManagerCategory } from '../../file-manager/class/file-manager-category';
import { FileManagerFile } from '../../file-manager/class/file-manager-file';
import * as moment from "moment";
import { BreadcrumbsItem } from '../../file-manager/class/breadcrumbs-item';

@Component({
  selector: 'app-company-file-manager',
  templateUrl: './company-file-manager.component.html',
  styleUrls: ['./company-file-manager.component.scss'],
  animations: [fadeInAnimation],
  // attach the fade in animation to the host (root) element of this component
  host: { '[@fadeInAnimation]': '' },
})
export class CompanyFileManagerComponent extends FileManagerComponent {
  companyId: string;
  breadcrumbs: Array<BreadcrumbsItem> = [];
  ngOnInit() {
    document.body.querySelector(".main-container").scrollTo(0, 0);
    this.companyId = this.activateRoute.snapshot.params['id'];
    if (this.companyId) this.companiesStateService.setCompanyRoutingId(this.companyId);
    let subscription = this.activateRoute.params.subscribe(params => {
      this.showPreloader = true;
      this.companyId = params['id'];
      this.getFileManagement();
    });
    this.sub.add(subscription);
  }
  getFileManagement() {
    this.fileManagementService.getFileManagement(null, null, null, this.companyId).subscribe((data: any) => {
      this.breadcrumbs = data.breadcrumbs.map(item => new BreadcrumbsItem(item));
      this.categories = data.categories.map(item => new FileManagerCategory(item)).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
        1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
      this.files = data.files.map(item => new FileManagerFile(item)).sort((a, b) => (a.createdAt > b.createdAt) ?
        1 : ((b.createdAt > a.createdAt) ? -1 : 0));
      this.files.forEach(person => {
        let date = moment(new Date(person.createdAt)).format('DD MMM YYYY');
        if (!this.groupedByCreateAt[date]) this.groupedByCreateAt[date] = [];
        this.groupedByCreateAt[date].push(person);
      });
      this.groupedByCreateAt = Object.keys(this.groupedByCreateAt).sort((a, b) => (new Date(a) > new Date(b)) ?
        1 : ((new Date(b) > new Date(a)) ? -1 : 0)).reverse().reduce(
          (obj, key) => {
            obj[key] = this.groupedByCreateAt[key];
            return obj;
          },
          {}
        );
      this.showPreloader = false;
    })
  }
}
