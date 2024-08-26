import { Component, OnInit } from '@angular/core';
import { FileManagerHeaderComponent } from 'src/app/components/file-manager/file-manager-header/file-manager-header.component';

@Component({
  selector: 'app-company-file-manager-header',
  templateUrl: './company-file-manager-header.component.html',
  styleUrls: ['./company-file-manager-header.component.scss']
})
export class CompanyFileManagerHeaderComponent extends FileManagerHeaderComponent {

  goToCategory(item) {
    console.log("companyId", this.companyId)
    if (item.id) {
      this.router.navigate(
        [`${this.companiesStateService.getCurrentCompany().techDomain}/company/`, this.companyId, `file-manager`, 'category', item.id]);
    }
    if (!item.id && item.allCompaniesRoot) this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().techDomain}/file-manager/all-customer`]);
    if (!item.id && item.companyId) this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().techDomain}/company/`, item.companyId, 'file-manager']);
  }
}