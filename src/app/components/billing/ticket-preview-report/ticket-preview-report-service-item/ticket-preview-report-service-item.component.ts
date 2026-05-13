import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { TicketProfileService } from 'src/app/components/tickets/tickets/class/ticket-profile-service';
import { TicketStateService } from 'src/app/components/tickets/tickets/ticket-edit-aside/services/ticket-state.service';
import { FORMAT_DATE_2 } from 'src/app/const/date-picker';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { QuoteStateService } from 'src/app/states/quote/quote-state.service';
import { TicketPreviewService } from '../class/ticket-preview-service';
import { TicketPreview } from '../class/ticket-preview';
import { RecurringService } from 'src/app/services/recurring/recurring.service';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { REMOVE_UPDATE_TICKET_DETAIL_SERVICE } from 'src/app/const/confirm';

@Component({
  selector: 'app-ticket-preview-report-service-item',
  templateUrl: './ticket-preview-report-service-item.component.html',
  styleUrls: ['./ticket-preview-report-service-item.component.scss']
})
export class TicketPreviewReportServiceItemComponent {
  @Input() ticket: TicketPreview;
  @Input() service: TicketPreviewService;
  currentCompany: any;
  servicesList = [];
  formatDate: string = FORMAT_DATE_2;
  sub: Subscription = new Subscription();
  constructor(
    public confirmStateService: ConfirmStateService,
    public modalService: NgbModal,
    public ticketStateService: TicketStateService,
    private quoteStateService: QuoteStateService,
    private permissionsService: PermissionsService,
    public ticketsService: TicketsService,
    private recurringService: RecurringService,
    private companiesStateService: CompaniesStateService) { }


  ngOnInit() {
    this.currentCompany = this.companiesStateService.getCurrentCompany();
    this.recurringService.getServiceList(this.ticket.companyId).subscribe((res: any) => {
      this.servicesList = res.filter(item => item.canUseInTicket);
      this.servicesList.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
        1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
    })
  }
  onChangeStartDate(data) {
    this.service.setDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
    this.updateService();
  }
  public selectService(item) {
    this.service.setItem(item);
    this.updateService();
  }
  public onChangeStartTimePicker(data) {
    this.service.setDurationStart(data);
    this.service.calculateQuantity();
  }
  public onChangeEndTimePicker(data) {
    this.service.setDurationEnd(data);
    this.service.calculateQuantity();
  }
  public onChangeDuration(data) {
    this.service.setQuantity(data);
    let durationEnd = (3600000 * data) + this.service.durationStart;
    this.service.setDurationEnd(durationEnd);
    this.updateService();
  }
  public getHours(service) {
    let timeInMinutes = service.quantity * 60;
    return Math.floor(timeInMinutes / 60);
  }
  public getMinutes(service) {
    let timeInMinutes = service.quantity * 60;
    let hours = Math.floor(timeInMinutes / 60);
    return Math.round(timeInMinutes - (hours * 60));
  }
  setComplete() {
    this.service.setCompleted(!this.service.completed);
    this.updateService();
  }
  updateService() {
    this.ticketsService.updateExpense(this.service.getDateForUpdate(this.service.ticketUpdateId)).subscribe(data => {

    })
  }
  removeService() {
    this.ticketStateService.setTicketPreviewForRemove(this.ticket);
    this.ticketStateService.setServiceTicketPreviewForRemove(this.service);
    this.confirmStateService.setConfirmAction(REMOVE_UPDATE_TICKET_DETAIL_SERVICE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = `Delete Ticket`;
    modalRef.componentInstance.message = `Are you sure you want to remove the item?`;
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
}
