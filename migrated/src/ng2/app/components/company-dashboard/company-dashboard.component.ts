import { NgModule } from '@angular/core';
import { Component, OnInit,ViewEncapsulation  } from '@angular/core';
import {NgbDropdownToggle} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'company-dashboard',
  templateUrl: './company-dashboard.component.html',
  styleUrls: ['./company-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})

@NgModule({
  imports: [NgbDropdownToggle]  
})
export class CompanyDashboardComponent implements OnInit {
  
 
  constructor() { }

  ngOnInit() {
  }

}
