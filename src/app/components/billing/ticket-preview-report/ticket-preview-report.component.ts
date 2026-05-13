import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { TicketPreview } from './class/ticket-preview';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { REMOVE_UPDATE_TICKET_DETAIL, REMOVE_UPDATE_TICKET_DETAIL_PRODUCT, REMOVE_UPDATE_TICKET_DETAIL_SERVICE } from 'src/app/const/confirm';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { TicketStateService } from '../../tickets/tickets/ticket-edit-aside/services/ticket-state.service';
import { Subscription } from 'rxjs';
import { InventoryStateService } from 'src/app/states/inventory/inventory-state.service';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ticket-preview-report',
  templateUrl: './ticket-preview-report.component.html',
  styleUrls: ['./ticket-preview-report.component.scss']
})
export class TicketPreviewReportComponent implements OnInit, OnDestroy {
  showPreloader: boolean = true;
  isUpdateAndClose: boolean = false;
  list: Array<TicketPreview> = [];
  sub: Subscription = new Subscription();
  constructor(private peportsService: ReportsService,
    public confirmStateService: ConfirmStateService,
    private ticketsService: TicketsService,
    private ticketStateService: TicketStateService,
    public inventoryStateService: InventoryStateService,
    public modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.inventoryStateService.getProducts();
    this.peportsService.getTicketPreivew().subscribe((res: any) => {
      this.list = res.map(item => new TicketPreview(item));
      this.showPreloader = false;
      console.log("this.list", this.list);
    })
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {

        if (this.confirmStateService.getConfirmAction() === REMOVE_UPDATE_TICKET_DETAIL_SERVICE) {
          this.removeService();
        }
        if (this.confirmStateService.getConfirmAction() === REMOVE_UPDATE_TICKET_DETAIL_PRODUCT) {
          this.removeProduct();
        }

      }
    })
    this.sub.add(getConfirm);
  }
  checkClose(ticket) {
    let completeServices = (ticket.services.find(item => !item.completed) ? false : true);
    let completeProducts = (ticket.products.find(item => !item.completed) ? false : true);
    return completeServices && completeProducts;
  }
  close(ticket) {
    if (!this.checkClose(ticket)) return;
    // this.update_closeBtn.setDisabled(true);
    this.isUpdateAndClose = true;
    this.ticketsService.updateTicket(this.getDataForClose(ticket), true).subscribe(data => {
      this.isUpdateAndClose = false;
      let index = this.list.findIndex(item => item.id == ticket.id);
      if (index > -1) this.list.splice(index, 1);
    }, err => {
      this.isUpdateAndClose = false;
      //   this.update_closeBtn.setDisabled(false);
    })
  }
  public getDataForClose(ticket) {
    return {
      note: "Ticket has been closed",
      type: "NOTE",
      noteType: "PUBLIC",
      shares: [],
      ticket: { id: ticket.id },
      attachments: []
    }
  }
  remove(ticket) {
    this.ticketStateService.setUpdateForRemove(ticket);
    this.confirmStateService.setConfirmAction(REMOVE_UPDATE_TICKET_DETAIL);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = `Delete Ticket`;
    modalRef.componentInstance.message = `The ticket update containing a service will become inaccessible. Continue with permanent deletion?`;
  }
  removeService() {
    this.ticketsService.removeService(this.ticketStateService.ticketPreviewForRemove.id, this.ticketStateService.serviceTicketPreviewForRemove.ticketUpdateId, this.ticketStateService.serviceTicketPreviewForRemove.id).subscribe(data => {
      this.confirmStateService.initRequest(false);
      this.list.forEach(item => {
        let index = item.services.findIndex(service => service.id == this.ticketStateService.serviceTicketPreviewForRemove.id);
        if (index > -1) item.services.splice(index, 1);
      })
    }, err => {
      this.confirmStateService.initRequest(false);
    })
  }
  removeProduct() {
    this.ticketsService.removeProduct(this.ticketStateService.ticketPreviewForRemove.id, this.ticketStateService.productTicketPreviewForRemove.ticketUpdateId, this.ticketStateService.productTicketPreviewForRemove.id).subscribe(data => {
      this.confirmStateService.initRequest(false);
      this.list.forEach(item => {
        let index = item.products.findIndex(product => product.id == this.ticketStateService.productTicketPreviewForRemove.id);
        if (index > -1) item.products.splice(index, 1);
      })
    }, err => {
      this.confirmStateService.initRequest(false);
    })
  }
  getDuration(input) {
    let timeInMinutes = input * 60,
      hours = Math.floor(timeInMinutes / 60),
      minutes = Math.round(timeInMinutes - (hours * 60));
    return (hours >= 10 ? hours : '0' + hours) + ':' + (minutes >= 10 ? minutes : '0' + minutes) + ' hr(s)';

  }
  public trackById(index, item) {
    return item.id;
  }
  public trackByIndex(index, item) {
    return index;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
