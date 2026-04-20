import { Component, OnInit } from '@angular/core';
import { FileManagerHeaderComponent } from 'src/app/components/file-manager/file-manager-header/file-manager-header.component';
import { FileManagerAddCategoryComponent } from '../../../file-manager/file-manager-add-category/file-manager-add-category.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { DropDownComponent } from '../../../shared/drop-down/drop-down.component';
import { NgIf, NgFor, NgClass } from '@angular/common';

@Component({
    selector: 'app-company-file-manager-header',
    templateUrl: './company-file-manager-header.component.html',
    styleUrls: ['./company-file-manager-header.component.scss'],
    standalone: true,
    imports: [NgIf, NgFor, NgClass, DropDownComponent, FormsModule, NgbDropdownModule, FileManagerAddCategoryComponent]
})
export class CompanyFileManagerHeaderComponent extends FileManagerHeaderComponent {

  goToCategory(item) {
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