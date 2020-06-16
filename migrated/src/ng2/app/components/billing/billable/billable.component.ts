import { Component, OnInit } from '@angular/core';
import { BillableService } from 'src/ng2/app/services/billable/billable.service';

@Component({
  selector: 'billable',
  templateUrl: './billable.component.html',
  styleUrls: ['./billable.component.scss']
})
export class BillableComponent implements OnInit {

  constructor(private billableService:BillableService) { }

  ngOnInit() {
    this.billableService.getBillable().subscribe(data => {
      console.log("data",data);
    })
  }

}
