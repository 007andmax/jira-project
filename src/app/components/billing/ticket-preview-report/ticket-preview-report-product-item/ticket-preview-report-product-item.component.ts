import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
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
import { TicketPreview } from '../class/ticket-preview';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ticket-preview-report-product-item',
  templateUrl: './ticket-preview-report-product-item.component.html',
  styleUrls: ['./ticket-preview-report-product-item.component.scss']
})
export class TicketPreviewReportProductItemComponent implements OnInit {

  formatDate: string = FORMAT_DATE_2;
  @Input() ticket: TicketPreview;
  @Input() product: TicketPreviewProduct;
  markup: number;
  validate: TicketPreviewValidate = new TicketPreviewValidate();
  sub: Subscription = new Subscription();
  constructor(
    public confirmStateService: ConfirmStateService,
    public modalService: NgbModal,
    public ticketStateService: TicketStateService,
    private quoteStateService: QuoteStateService,
    private permissionsService: PermissionsService,
    public ticketsService: TicketsService,
    public cd: ChangeDetectorRef,
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
  onChangeDiscountAmount(val) {
    console.log("onChangeDiscountAmount", val);
    let value = val;
    if (this.product.discountAmount != value) {
      this.product.discountAmount = value;
      this.product.setIsEdit(true);
      this.cd.markForCheck();
    }
  }
  onEnterDiscountAmount(event) {
    if (event.keyCode === 13 && this.product.isEdit) {
      event.target.blur();
      this.cd.markForCheck();
    }
  }
  onBlurDiscountAmount() {
    if (this.product.isEdit) {
      this.updateProduct();
    }
    this.cd.markForCheck();
  }
  onBlurQuantity() {
    if (this.product.isEdit) {
      this.updateProduct();
    }
    this.cd.markForCheck();
  }
  onBlurCost() {
    if (this.product.isEdit) {
      this.validate.checkPriceCost(this.product.item.sale, this.product.item.cost);
      this.updateProduct();
    }
    this.cd.markForCheck();
  }
  onChangeQuantity(event) {
    console.log("val", event.target.value);
    let value = Number(event.target.value);
    console.log("value", value);
    if (this.product.quantity !== value) {
      this.product.quantity = value;
      this.product.setIsEdit(true);
    }
    this.cd.markForCheck();
  }
  onChangeCost(val) {
    let value = Number(val);

    if (this.product.item.cost !== value) {
      this.product.item.cost = value;
      this.markup = this.getMarkups();
      this.validate.checkPriceCost(this.product.item.sale, this.product.item.cost);
      this.product.setIsEdit(true);
    }
    this.cd.markForCheck();
  }
  onEnterQuantity(event) {
    if (event.keyCode === 13 && this.product.isEdit) {
      this.onChangeQuantity(event);
      this.updateProduct();
      this.cd.markForCheck();
    }
  }
  onEnterCost(event) {
    if (event.keyCode === 13 && this.product.isEdit) {
      this.onChangeCost(event.target.value);
      this.updateProduct();
      this.cd.markForCheck();
    }
  }
  onBlurSale() {
    if (this.product.isEdit) {
      this.validate.checkPriceCost(this.product.item.sale, this.product.item.cost);
      this.updateProduct();
    }
    this.cd.markForCheck();
  }
  changeSales(val) {
    let value = Number(val);
    if (this.product.item.sale != value) {
      this.product.item.sale = value;
      this.markup = this.getMarkups();
      this.product.setIsEdit(true);
    }
    this.cd.markForCheck();
  }
  onBlurMarkup() {
    if (this.product.isEdit) {
      this.validate.checkPriceCost(this.product.item.sale, this.product.item.cost);
      this.updateProduct();
    }
    this.cd.markForCheck();
  }
  onEnterSale(event) {
    if (event.keyCode === 13 && this.product.isEdit) {
      this.changeSales(event.target.value);
      this.updateProduct();
      this.cd.markForCheck();
    }
  }
  onChangeMarkup(val) {
    let value = Number(val);
    if (this.markup != value) {
      this.product.item.sale = Number(this.quoteStateService.roundToTwo((value * this.product.item.cost / 100 + this.product.item.cost)));
      this.markup = value;
      this.product.setIsEdit(true);
      this.cd.markForCheck();
    }
  }
  onEnterMarkup(event) {
    if (event.keyCode === 13 && this.product.isEdit) {
      this.onChangeMarkup(event.target.value);
      this.updateProduct();
      this.cd.markForCheck();
    }
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
    this.product.setIsEdit(false);
    if (this.validate.isValidate(this.product.item)) this.ticketsService.updateExpense(this.product.getDateForUpdate(this.product.ticketUpdateId)).subscribe(data => {
    })
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  removeProduct() {
    this.ticketStateService.setTicketPreviewForRemove(this.ticket);
    this.ticketStateService.setProductTicketPreviewForRemove(this.product);
    this.confirmStateService.setConfirmAction(REMOVE_UPDATE_TICKET_DETAIL_PRODUCT);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = `Delete Ticket`;
    modalRef.componentInstance.message = `Are you sure you want to remove the item?`;

  }
}
