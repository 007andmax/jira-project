import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-company-dash-ticket',
  templateUrl: './company-dash-ticket.component.html',
  styleUrls: ['./company-dash-ticket.component.scss']
})
export class CompanyDashTicketComponent implements OnInit, OnDestroy {

  _id: string = '';
  ticketFrequency: string = 'Monthly';
  lineData: any;
  sub: Subscription = new Subscription();
  chartColors = { domain: ["#0747a6", "#00ccff", '#2bc7c6', '#7C77CB'] };
  showPreloader: boolean = true;
  public constructor(private companiesService: CompaniesService,
    public activateRoute: ActivatedRoute,
    public cd: ChangeDetectorRef
  ) { }


  public ngOnInit() {
    this._id = this.activateRoute.snapshot.params['id'];
    let subscription = this.activateRoute.params.subscribe(params => {
      this._id = params['id'];
      this.getTicketGraph(this.ticketFrequency);
    });
    this.sub.add(subscription);
    this.lineData = [];
  }
  xAxisTickFormatting = (d) => {
    console.log("d", d);
    return moment(d).format('DD MMM');
  }

  getTicketGraph(frequency: string) {
    this.showPreloader = true;
    let getTicket = this.companiesService.getTicketGraph(this._id, frequency.toUpperCase()).subscribe((data: any) => {
      this.ticketFrequency = frequency;
      let countOfCompletedTickets = [];
      let countOfNewTickets = [];
      let filter_list = (data.length > 30) ? data.splice(data.length - 30, data.length) : data;
      filter_list.forEach(element => {
        countOfCompletedTickets.push({ name: element.date, value: element.countOfCompletedTickets === undefined ? 0 : element.countOfCompletedTickets });
        countOfNewTickets.push({ name: element.date, value: element.countOfNewTickets === undefined ? 0 : element.countOfNewTickets });
      });
      this.lineData = [
        {
          name: "Completed",
          series: countOfCompletedTickets
        },
        {
          name: "Created Tickets",
          series: countOfNewTickets
        }
      ];
      console.log("lineData", this.lineData);
      this.showPreloader = false;
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    });
    this.sub.add(getTicket);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
