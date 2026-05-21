import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
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
import { TicketPreviewServicesCompany } from '../class/ticket-preview-services-company';
import { ServicesListComponent } from 'src/app/components/shared/services-list/services-list.component';

@Component({
  selector: 'app-ticket-preview-report-service-item',
  templateUrl: './ticket-preview-report-service-item.component.html',
  styleUrls: ['./ticket-preview-report-service-item.component.scss']
})
export class TicketPreviewReportServiceItemComponent {
  @ViewChild('serviceDP', { static: true }) serviceDP: ServicesListComponent;
  @Input() ticket: TicketPreview;
  @Input() service: TicketPreviewService;
  @Input() servicesCompany: Array<TicketPreviewServicesCompany> = [];
  currentCompany: any;
  @Input() servicesList = [];
  formatDate: string = FORMAT_DATE_2;
  sub: Subscription = new Subscription();
  rowTextArea: number = 0;
  shortVersion: boolean = true;
  constructor(
    public confirmStateService: ConfirmStateService,
    public modalService: NgbModal,
    public ticketStateService: TicketStateService,
    private quoteStateService: QuoteStateService,
    private permissionsService: PermissionsService,
    public ticketsService: TicketsService,
    private recurringService: RecurringService,
    private elRef: ElementRef,
    public cd: ChangeDetectorRef,
    private companiesStateService: CompaniesStateService) { }


  ngOnInit() {
    this.currentCompany = this.companiesStateService.getCurrentCompany();
    //this.servicesList = this.servicesCompany.find(item => item.companyId == this.ticket.companyId)?.services;
  }
  ngDoCheck() {
    const textarea = this.elRef.nativeElement.querySelector('#service-description');
    const styles = window.getComputedStyle(textarea);
    const lineHeight = parseFloat(styles.lineHeight);
    this.rowTextArea = Math.round(textarea.scrollHeight / lineHeight);
  }
  onChangeDescription(event) {
    let value = event.target.value;
    if (this.service.description != value) {
      this.service.description = value;
      this.service.setIsEdit(true);
      this.cd.markForCheck();
    }
  }
  onBlurDescription(event) {
    if (this.service.isEdit) {
      this.onChangeDescription(event);
      this.updateService();
      this.cd.markForCheck();
    }
  }
  onOpenServiceDropDown(data) {
    if (data && this.servicesList.length == 0) {
      this.serviceDP.preloader = true;
      this.recurringService.getServiceList(this.ticket.companyId).subscribe((res: any) => {
        let servicesList = res.filter(item => item.canUseInTicket);
        servicesList.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
          1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
        this.servicesList = servicesList;
        this.serviceDP.preloader = false;
      })
    }
  }
  onEnterDescription(event) {
    if (!event.shiftKey && event.keyCode === 13 && this.service.isEdit) {
      event.preventDefault();
      this.onChangeDescription(event);
      this.updateService();
      event.target.blur();
      this.cd.markForCheck();
    }
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
    this.service.setIsEdit(false);
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
