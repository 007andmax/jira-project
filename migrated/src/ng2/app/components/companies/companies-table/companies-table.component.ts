import { Component, OnInit, Input } from '@angular/core';
import { Company } from 'src/ng2/app/interfaces/company/company';

@Component({
  selector: 'app-companies-table',
  templateUrl: './companies-table.component.html',
  styleUrls: ['./companies-table.component.scss']
})
export class CompaniesTableComponent implements OnInit {
  @Input() company: Company;
  constructor() { }

  ngOnInit() {
  }

}
