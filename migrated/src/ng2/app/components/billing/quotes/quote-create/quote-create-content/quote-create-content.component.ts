import { Component, OnInit } from '@angular/core';
import { CompaniesService } from "../../../../../services/company/companies.service";

@Component({
  selector: 'app-quote-create-content',
  templateUrl: './quote-create-content.component.html',
  styleUrls: ['./quote-create-content.component.scss']
})
export class QuoteCreateContentComponent implements OnInit {

  constructor(
    private companiesService: CompaniesService
  ) { }

  ngOnInit() {
    this.companiesService.getCompaniesList();
  }

}
