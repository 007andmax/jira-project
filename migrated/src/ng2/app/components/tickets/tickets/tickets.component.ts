import { Component, OnInit, OnDestroy } from '@angular/core';
import { TicketsStateService } from 'src/ng2/app/states/tickets/tickets-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit,OnDestroy {
listType:string = "USERS";
sub:Subscription = new Subscription();
  constructor(private ticketsStateService:TicketsStateService) { }
 

  ngOnInit() {
   let getOnInitFilter =  this.ticketsStateService.getOnInitFilter().subscribe(data => {
   this.listType = data.listType;
    })
    this.sub.add(getOnInitFilter);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
