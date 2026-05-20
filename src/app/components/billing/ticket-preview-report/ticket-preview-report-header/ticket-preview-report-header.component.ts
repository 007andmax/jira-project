import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { TicketStatus } from 'src/app/components/setting/ticket-settings-page/tickets-status/class/ticket-status';
import { TitleListType } from 'src/app/components/tickets/tickets/tickets-header/class/title-list-type';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { TicketPreviewReportFilterValidate } from '../class/ticket-preview-report-filter-validate';
import { TicketPreviewReportFilter } from '../class/ticket-preview-report-filter';
import * as moment from "moment";
import { TicketPreviewReportStatus } from '../class/ticket-preview-report-status';

@Component({
  selector: 'app-ticket-preview-report-header',
  templateUrl: './ticket-preview-report-header.component.html',
  styleUrls: ['./ticket-preview-report-header.component.scss'],

})
export class TicketPreviewReportHeaderComponent {

  selectedTicketStatus: Array<TicketPreviewReportStatus> = [];
  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  filter: TicketPreviewReportFilter = new TicketPreviewReportFilter();
  validate: TicketPreviewReportFilterValidate = new TicketPreviewReportFilterValidate();
  sub: Subscription = new Subscription();
  constructor(public ticketsStateService: TicketsStateService,
    public cd: ChangeDetectorRef,) { }
  ngOnInit() {


  }

  onSelectStatus(items) {
    this.selectedTicketStatus = items;
    this.filter.setTicketStatusIds(items.map(item => item.id));
  }

  applyFilter() {
    if (this.validate.isValidate(this.selectedTicketStatus, this.filter)) this.onFilter.emit(this.filter);
  }
  parseStatus(name) {
    if (name === "IN_PROGRESS") return "In progress";
    if (name === "ON_HOLD") return "On hold";
    if (name === "COMPLETED") return "Completed";
    if (name === "UNASSIGNED") return "Unassigned";
    if (name === "PENDING_REVIEW") return "Pending Review";
    return name;
  }
  public filterByDate(value) {
    if (value.start !== '' && value.end !== '') {
      this.filter.setDateFrom(moment(value.start).format('YYYY-MM-DD'));
      this.filter.setDateTo(moment(value.end).format('YYYY-MM-DD'));
      this.validate.setDate(true);
    } else {
      this.filter.setDateFrom(null);
      this.filter.setDateTo(null);
    }
  }

}
