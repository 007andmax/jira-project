import { Component, Input, OnInit } from '@angular/core';
import { FileManagerItemCategoryComponent } from 'src/app/components/file-manager/file-manager-item-category/file-manager-item-category.component';
import { NgClass, NgIf } from '@angular/common';
import { DblclickDirective } from '../../../../directives/dblclick/dblclick.directive';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-company-file-manager-item-category',
    templateUrl: './company-file-manager-item-category.component.html',
    styleUrls: ['./company-file-manager-item-category.component.scss'],
    standalone: true,
    imports: [NgbDropdownModule, DblclickDirective, NgClass, NgIf]
})
export class CompanyFileManagerItemCategoryComponent extends FileManagerItemCategoryComponent {
  @Input() companyId: string;
  navigateToCategory() {
    if (!this.item.allCompaniesRoot) {
      if (this.item.id) this.router.navigate(
        [`${this.companiesStateService.getCurrentCompany().techDomain}/company/`, this.companyId, `file-manager`, 'category', this.item.id]);
      if (!this.item.id && this.item.companyId) this.router.navigate(
        [`${this.companiesStateService.getCurrentCompany().techDomain}/file-manager/all-customer/`, this.item.companyId]);
    } else {
      this.router.navigate(
        [`${this.companiesStateService.getCurrentCompany().techDomain}/file-manager/all-customer`]);
    }
  }
}
