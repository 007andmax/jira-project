import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoryValidate } from 'src/app/components/inventory/class/inventory-validate';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { TicketProfileProduct } from 'src/app/components/tickets/tickets/class/ticket-profile-product';
import { TicketStateService } from 'src/app/components/tickets/tickets/ticket-edit-aside/services/ticket-state.service';
import { REMOVE_UPDATE_TICKET_DETAIL_PRODUCT } from 'src/app/const/confirm';
import { FORMAT_DATE_2 } from 'src/app/const/date-picker';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { QuoteStateService } from 'src/app/states/quote/quote-state.service';
import { TicketPreviewProduct } from '../class/ticket-preview-product';
import { TicketPreviewValidate } from '../class/ticket-preview-validate';

@Component({
  selector: 'app-ticket-preview-report-product-item',
  templateUrl: './ticket-preview-report-product-item.component.html',
  styleUrls: ['./ticket-preview-report-product-item.component.scss']
})
export class TicketPreviewReportProductItemComponent implements OnInit {
  formatDate: string = FORMAT_DATE_2;
  @Input() product: TicketPreviewProduct;
  markup: number;
  validate: TicketPreviewValidate = new TicketPreviewValidate();
  constructor(
    public confirmStateService: ConfirmStateService,
    public modalService: NgbModal,
    public ticketStateService: TicketStateService,
    private quoteStateService: QuoteStateService,
    private permissionsService: PermissionsService,
    public ticketsService: TicketsService,
    private companiesStateService: CompaniesStateService) { }
  ngOnInit(): void {
    this.markup = this.getMarkups();
  }
  onChangeStartDate(data) {
    this.product.setDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
    this.updateProduct();
  }
  public selectProduct(item) {
    if (item) {
      this.product.setData(item, 0);
    }
    this.product.valdiateSaleCost = true;
    this.updateProduct();
  }
  onChangeDiscountAmount(event) {
    this.product.discountAmount = event;

  }

  onChangeCost(val) {
    let value = Number(val);
    this.product.item.cost = value;
    this.product.item.cost_str = value.toFixed(2);
    this.markup = this.getMarkups();

  }
  onChangeSale(val) {
    let value = Number(val);
    this.product.item.sale = value;
    this.product.item.sale_str = value.toFixed(2);
    this.markup = this.getMarkups();

  }
  changeMarkup(val) {
    let value = Number(val);
    this.product.item.sale = Number(this.quoteStateService.roundToTwo((value * this.product.item.cost / 100 + this.product.item.cost)));
    this.product.item.sale_str = this.product.item.sale.toFixed(2);
    this.markup = value;

  }
  public getMarkups() {
    if (this.product.item.sale > 0 && this.product.item.cost > 0) return Number(this.quoteStateService.roundToTwo((this.product.item.sale - this.product.item.cost) / this.product.item.cost * 100));
    return 0;
  }
  setComplete() {
    this.product.setCompleted(!this.product.completed);
    if (this.validate.isValidate(this.product.item)) this.updateProduct();
  }
  updateProduct() {
    if (this.validate.isValidate(this.product.item)) this.ticketsService.updateExpense(this.product.getDateForUpdate(this.product.ticketUpdateId)).subscribe(data => {
    })
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  removeProduct() {
    //  this.ticketStateService.setUpdateForRemove(this.update);
    this.ticketStateService.setProductForRemove(this.product);
    this.confirmStateService.setConfirmAction(REMOVE_UPDATE_TICKET_DETAIL_PRODUCT);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = `Delete Ticket`;
    modalRef.componentInstance.message = `Are you sure you want to remove the item?`;

  }
}
