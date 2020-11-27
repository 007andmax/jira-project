import { NgModule, ChangeDetectorRef } from '@angular/core';
import { Component, OnInit,ViewEncapsulation  } from '@angular/core';
import {NgbDropdownToggle,NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Company } from '../../interfaces/company/company';
import { ContractsStateService } from '../../states/contracts/contracts-state.service';

@Component({
  selector: 'company-dashboard',
  templateUrl: './company-dashboard.component.html',
  styleUrls: ['./company-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})

@NgModule({
  imports: [NgbDropdownToggle,NgbModal]  
})
export class CompanyDashboardComponent implements OnInit {
  
  company: Company;
  totalTickets:number = 0;
  averageResponseTime:string = '';
  sub: Subscription = new Subscription();
  
  constructor(
    public cd: ChangeDetectorRef,
    public contractsStateService: ContractsStateService) {}
  
  ngOnInit() {} 

  totalTicketsChangedHandler(data: number) {
    this.totalTickets = data;
  }

  averageResponseTimeChangedHandler(data: string) {
    this.averageResponseTime = data;
  }

}
