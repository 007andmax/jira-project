import { Component, OnInit } from '@angular/core';
import { CompaniesStateService } from '../services/companies-state.service';

@Component({
  selector: 'app-companies-header',
  templateUrl: './companies-header.component.html',
  styleUrls: ['./companies-header.component.scss']
})
export class CompaniesHeaderComponent implements OnInit {

  constructor(   private companiesStateService: CompaniesStateService) { }

  ngOnInit() {
  }

  public showAsideForAdd() {
    this.companiesStateService.toggleAsideForAdd();
  }
}
