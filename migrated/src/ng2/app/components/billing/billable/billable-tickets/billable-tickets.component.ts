import { Component, OnInit } from '@angular/core';
import { BillableStateService } from 'src/ng2/app/states/billable/billable-state.service';
import { BillableProfile } from '../class/billable-profile';

@Component({
  selector: 'billable-tickets',
  templateUrl: './billable-tickets.component.html',
  styleUrls: ['./billable-tickets.component.scss']
})
export class BillableTicketsComponent implements OnInit {
  billableProfile:BillableProfile;
  constructor(  private billableStateService:BillableStateService,) { }

  ngOnInit() {
    this.billableProfile = this.billableStateService.getBillableProfile();
    console.log("this.billableProfile",this.billableProfile);
  }
  onToggleTicket(ticket) {
    ticket.selected = !ticket.selected;
    console.log("ticket.selected",ticket.selected);
  }
  onToggleAll(event) {
    this.billableProfile.tickets.forEach(item => {
      item.selected = event.target.checked;
    })
  }
  back() {
     
    let body = document.querySelector('.left-panel__category-wrap');
    var link = document.createElement('a');
    body.appendChild(link);
    link.href = `#/ng2/billable`;
    var e = document.createEvent('MouseEvents');
    e.initEvent('click', true, true);
    link.dispatchEvent(e);
  }
}
