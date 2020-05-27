import { Component, OnInit, Input, ChangeDetectorRef, ElementRef } from '@angular/core';
import { TicketsFilter } from '../../class/tickets-filter';
import { CurrentUser } from 'src/ng2/class/current-user/current-user';
import { Company } from 'src/ng2/app/interfaces/company/company';
import { Ticket } from '../../../class/ticket';
import { TicketsListService } from '../../services/tickets-list.service';
import { TicketsService } from 'src/ng2/app/services/tickets/tickets.service';
import * as moment from "moment";
import { TicketsStateService } from 'src/ng2/app/states/tickets/tickets-state.service';

@Component({
  selector: 'app-company-info-history',
  templateUrl: './company-info-history.component.html',
  styleUrls: ['./company-info-history.component.scss'],
  providers: [TicketsListService]
})
export class CompanyInfoHistoryComponent implements OnInit {
  ticketsFilter: TicketsFilter = new TicketsFilter();

  @Input() user: CurrentUser;
  @Input() company: Company;
  showPreloader: boolean = true;
 
  public infiniteScrollDisabled = true;
  public page_number: number = 0;
  tickets: Array<Ticket> = [];
  offset: number = 15;
  showPendingPreloader: boolean = false;
  constructor(private ticketsListService: TicketsListService,
    private ticketsService: TicketsService,
    private elRef: ElementRef,
    private ticketsStateService:TicketsStateService,
    public cd: ChangeDetectorRef, ) { }

  ngOnInit() {
    console.log("CompanyInfoHistoryComponent");
    this.ticketsFilter.setListType("ALL");


  }
  public onInitGetTickets() {
    
  
    console.log("onInitGetTickets");
    this.ticketsFilter.setCompany(this.company);
    this.ticketsFilter.setUser(this.user);
    this.showPreloader = true;
    this.elRef.nativeElement.querySelector('.company-info-aside__history').scrollTo(0, 0);
    this.setDefaultScoll();
    this.onScroll();
  }
  public setDefaultScoll() {
    this.page_number = 0;
    this.ticketsListService.setBlockList(false);
    this.tickets = [];
  }
  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.getTickets();

  }
  editTicket(id) {
    this.ticketsStateService.onOpenTicket();
    this.ticketsService.getTicket(id).subscribe(data => {
      this.ticketsStateService.onEditTicket(data);
    })
  }
  getCreateAt(createdAt) {
    let date = new Date(createdAt);

    return moment(date).format('DD MMM YYYY')
  }
  public getTickets() {
 
    if (this.ticketsListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.ticketsFilter.setOffset(this.page_number * this.offset);
    if (this.page_number > 0) this.showPendingPreloader = true;
    console.log("this.showPendingPreloader", this.showPendingPreloader);
    console.log("this.page_number", this.page_number);
    this.ticketsService.getTickets(this.ticketsFilter.getListTupe(), this.ticketsFilter.getDataForRequest()).subscribe((data: Array<Ticket>) => {
      this.tickets = [...this.tickets, ...data];
      this.infiniteScrollDisabled = false;
      if (data.length < this.offset) this.ticketsListService.setBlockList(true);
      this.page_number += 1;
      this.showPreloader = false;
      this.showPendingPreloader = false;
      this.cd.detectChanges();
    })
  }

}
