import { Component, OnInit } from '@angular/core';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { TicketPreview } from './class/ticket-preview';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { REMOVE_UPDATE_TICKET_DETAIL_PRODUCT, REMOVE_UPDATE_TICKET_DETAIL_SERVICE } from 'src/app/const/confirm';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { TicketStateService } from '../../tickets/tickets/ticket-edit-aside/services/ticket-state.service';
import { Subscription } from 'rxjs';
import { InventoryStateService } from 'src/app/states/inventory/inventory-state.service';

@Component({
  selector: 'app-ticket-preview-report',
  templateUrl: './ticket-preview-report.component.html',
  styleUrls: ['./ticket-preview-report.component.scss']
})
export class TicketPreviewReportComponent implements OnInit {

  list: Array<TicketPreview> = [];
  sub: Subscription = new Subscription();
  constructor(private peportsService: ReportsService,
    public confirmStateService: ConfirmStateService,
    private ticketsService: TicketsService,
    private ticketStateService: TicketStateService,
    public inventoryStateService: InventoryStateService
  ) { }
  ngOnInit(): void {
    this.inventoryStateService.getProducts();
    this.peportsService.getTicketPreivew().subscribe((res: any) => {
      this.list = res.map(item => new TicketPreview(item));
      console.log("this.list", this.list);
    })
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        /*   if (this.confirmStateService.getConfirmAction() === REMOVE_UPDATE_TICKET_DETAIL) {
             this.removeUpdate();
           }*/
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
}
