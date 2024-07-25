import { Component, Input, OnInit } from '@angular/core';
import { FileManagementCategory } from '../class/file-management-category';
import { Router } from '@angular/router';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';

@Component({
  selector: 'app-file-management-item-category',
  templateUrl: './file-management-item-category.component.html',
  styleUrls: ['./file-management-item-category.component.scss']
})
export class FileManagementItemCategoryComponent implements OnInit {
  @Input() item: FileManagementCategory;
  constructor(public router: Router,
    public companiesStateService: CompaniesStateService
  ) { }

  ngOnInit() {
  }
  navigateToCategory() {
    this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().techDomain}/file-management/category/`, this.item.id]);
  }
}
