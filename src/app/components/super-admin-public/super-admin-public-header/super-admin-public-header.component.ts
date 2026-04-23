
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { SuperAdminPublicSearchComponent } from '../super-admin-public-search/super-admin-public-search.component';

@Component({
  standalone: true,
  imports: [SuperAdminPublicSearchComponent, CommonModule],
  selector: 'super-admin-public-header',
  templateUrl: './super-admin-public-header.component.html',
  styleUrls: ['./super-admin-public-header.component.scss'],

})
export class SuperAdminPublicHeaderComponent implements OnInit {
  @Input() isShowHelpCenter: boolean;
  @Input() mainClass: string;
  @Output() onSelectCategory = new EventEmitter();
  constructor(public companiesStateService: CompaniesStateService,
    private router: Router,) { }

  ngOnInit() {
  }
  selectCategory(data) {
    this.onSelectCategory.emit(data);
  }
  gotoHelpCenter() {
    this.router.navigate([`${this.companiesStateService.getCurrentCompany().techDomain}/help-center`]);
  }
}
