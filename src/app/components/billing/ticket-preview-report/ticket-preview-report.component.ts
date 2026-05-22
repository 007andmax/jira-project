import { ChangeDetectorRef, Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { TicketPreview } from './class/ticket-preview';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { REMOVE_UPDATE_TICKET_DETAIL, REMOVE_UPDATE_TICKET_DETAIL_PRODUCT, REMOVE_UPDATE_TICKET_DETAIL_SERVICE } from 'src/app/const/confirm';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { TicketStateService } from '../../tickets/tickets/ticket-edit-aside/services/ticket-state.service';
import { forkJoin, Subscription } from 'rxjs';
import { InventoryStateService } from 'src/app/states/inventory/inventory-state.service';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TicketPreviewServicesCompany } from './class/ticket-preview-services-company';
import { RecurringService } from 'src/app/services/recurring/recurring.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { TicketStatus } from '../../setting/ticket-settings-page/tickets-status/class/ticket-status';
import { StatusColor } from '../../tickets/class/status-color';
import { LeftPanelService } from 'src/app/services/left-panel/left-panel.service';
import { TicketPreviewReportProductItemComponent } from './ticket-preview-report-product-item/ticket-preview-report-product-item.component';
import { TicketPreviewReportFilter } from './class/ticket-preview-report-filter';
import { InventoryListService } from '../../inventory/services/inventory-list.service';
import { TicketPreviewReportStateService } from 'src/app/states/ticket-preview-report/ticket-preview-report-state.service';

@Component({
  selector: 'app-ticket-preview-report',
  templateUrl: './ticket-preview-report.component.html',
  styleUrls: ['./ticket-preview-report.component.scss'],
  providers: [InventoryListService]
})
export class TicketPreviewReportComponent implements OnInit, OnDestroy {
  @ViewChildren("productItem", { emitDistinctChangesOnly: false }) productItems: QueryList<TicketPreviewReportProductItemComponent>;
  filter: TicketPreviewReportFilter = new TicketPreviewReportFilter();
  showPreloader: boolean = true;
  list: Array<TicketPreview> = [];
  ticketsStatus: Array<TicketStatus> = [];
  listColors: Array<StatusColor> = [];
  servicesCompany: Array<TicketPreviewServicesCompany> = [];
  sub: Subscription = new Subscription();
  container = document.body.querySelector(".main-container");
  public infiniteScrollDisabled = true;
  showPendingPreloader: boolean = false;
  constructor(private peportsService: ReportsService,
    public confirmStateService: ConfirmStateService,
    private ticketsService: TicketsService,
    private ticketStateService: TicketStateService,
    public inventoryStateService: InventoryStateService,
    private recurringService: RecurringService,
    private companiesStateService: CompaniesStateService,
    public modalService: NgbModal,
    private ticketsStateService: TicketsStateService,
    private leftPanelService: LeftPanelService,
    private inventoryListService: InventoryListService,
    private ticketPreviewReportStateService: TicketPreviewReportStateService,
    public cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.inventoryStateService.getProducts();
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
    this.ticketsStatus = this.ticketsStateService.getTicketsStatus();
    if (this.ticketsStatus.length > 0) {
      this.filter.setTicketStatusIds([this.ticketsStatus.find(item => item.name == "PENDING_REVIEW")?.id]);
      this.getList();
    }
    let onGetTicketsStatus = this.ticketsStateService.onGetTicketsStatus.subscribe(data => {
      this.ticketsStatus = data;
      this.filter.setTicketStatusIds([this.ticketsStatus.find(item => item.name == "PENDING_REVIEW")?.id]);
      this.getList();
    })
    this.sub.add(onGetTicketsStatus);
    if (this.ticketsStateService.getListStatusColor().length === 0) {
      this.leftPanelService.getColors().subscribe((data: any) => {
        this.listColors = data.map(item => {
          return new StatusColor(item.borderColor, item.textColor);
        })
        this.ticketsStateService.onColorStatus(this.listColors);
      })
    } else {
      this.listColors = this.ticketsStateService.getListStatusColor();
    }
    let getOnInitColor = this.ticketsStateService.getOnInitColor().subscribe(data => {
      this.listColors = data;
    })
    this.sub.add(getOnInitColor);
  }
  onFilter(data) {
    this.filter = data;
    this.showPreloader = true;
    this.setDefaultScoll();
    this.onScroll();
  }
  public setDefaultScoll() {
    document.body.querySelector(".main-container").scrollTo(0, 0);
    this.filter.page = 0;
    this.inventoryListService.setBlockList(false);
    this.list = [];
    this.cd.detectChanges();
  }
  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.getList();
  }
  getList() {
    if (this.inventoryListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      this.cd.detectChanges();
      return;
    }
    if (this.filter.page > 0) this.showPendingPreloader = true;
    this.peportsService.getTicketPreivew(this.filter.getDataForRequest()).subscribe((res: any) => {
      this.list = [...this.list, ...res.map(item => new TicketPreview(item))];
      this.infiniteScrollDisabled = false;
      if (res.length < this.filter.size) this.inventoryListService.setBlockList(true);
      this.filter.page += 1;
      this.showPreloader = false;
      this.showPendingPreloader = false;
      this.cd.detectChanges();
      console.log("this.list", this.list);
    })
  }
  onChangedStatus(ticket, data) {
    let status = this.ticketsStateService.getTicketsStatus().find(item => item.name == data.type);
    console.log("status", status);
    console.log("this.filter.ticketStatusIds", this.filter.ticketStatusIds);
    if (!this.filter.ticketStatusIds.find(id => id == status?.id)) {
      let index = this.list.findIndex(item => item.id == ticket.id);
      if (index > -1) this.list.splice(index, 1);
    }
  }
  checkClose(ticket) {
    let completeServices = (ticket.services.find(item => !item.completed) ? false : true);
    let completeProducts = (ticket.products.find(item => !item.completed) ? false : true);
    return completeServices && completeProducts;
  }
  approveAndClose(ticket) {
    this.productItems.toArray().forEach(item => item.validate.isValidate(item.product.item));
    if (this.productItems.toArray().find(item => !item.validate.isValidate(item.product.item))) return;
    if (!this.checkClose(ticket)) {
      let services = ticket.services.filter(item => !item.completed);
      services.forEach(element => element.setCompleted(true));
      let products = ticket.products.filter(item => !item.completed);
      products.forEach(element => element.setCompleted(true));
      forkJoin(
        [...services.map(service => this.ticketsService.updateExpense(service.getDateForUpdate(service.ticketUpdateId))), ...products.map(product => this.ticketsService.updateExpense(product.getDateForUpdate(product.ticketUpdateId)))]
      )
        .subscribe(result => {
          this.close(ticket);
        });
    } else {
      this.close(ticket);
    }
    // this.update_closeBtn.setDisabled(true);
    ticket.isUpdateAndClose = true;

  }
  close(ticket) {
    this.ticketsService.updateTicket(this.getDataForClose(ticket), true).subscribe(data => {
      ticket.isUpdateAndClose = false;
      let index = this.list.findIndex(item => item.id == ticket.id);
      if (index > -1) this.list.splice(index, 1);
    }, err => {
      ticket.isUpdateAndClose = false;
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
  editTicket(id) {
    this.ticketStateService.setTicketRoutingId(id);
    const url = `/#/${this.companiesStateService.getCurrentCompany().techDomain}/ticket/${id}`;
    window.open(url, '_blank');
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
    this.ticketPreviewReportStateService.servicesCompany = [];
    this.sub.unsubscribe();
  }
}
