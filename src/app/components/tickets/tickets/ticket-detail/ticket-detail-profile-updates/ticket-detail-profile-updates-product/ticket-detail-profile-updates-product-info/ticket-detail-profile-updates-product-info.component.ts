import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { REMOVE_UPDATE_TICKET_DETAIL_PRODUCT } from 'src/app/const/confirm';
import { TicketProfileProduct } from '../../../../class/ticket-profile-product';
import { TicketProfileUpdate } from '../../../../class/ticket-profile-update';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { AppService } from 'src/app/states/app/app.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TicketsListService } from '../../../../services/tickets-list.service';
import { TicketStateService } from '../../../../ticket-edit-aside/services/ticket-state.service';
import { DatePickerComponent } from 'src/app/components/shared/date-picker/date-picker.component';

@Component({
  selector: 'ticket-detail-profile-updates-product-info',
  templateUrl: './ticket-detail-profile-updates-product-info.component.html',
  styleUrls: ['./ticket-detail-profile-updates-product-info.component.scss']
})
export class TicketDetailProfileUpdatesProductInfoComponent implements OnInit, OnDestroy {
  @Input() index: number;
  @Input() showCompleteLabel: boolean = false;
  @Input() product: TicketProfileProduct;
  @Input() update: TicketProfileUpdate;
  @Output() onEdit = new EventEmitter();
  @Input() isBlockChange: boolean;
  @ViewChild('dpDate', { static: true }) dpDate: DatePickerComponent;
  changeDate: boolean = false;
  userService = [];
  listTechUsers = [];
  sub: Subscription = new Subscription();
  constructor(public ticketsListService: TicketsListService,
    public confirmStateService: ConfirmStateService,
    public ticketStateService: TicketStateService,
    private ticketsService: TicketsService,
    private usersStateService: UsersStateService,
    public companiesStateService: CompaniesStateService,
    public modalService: NgbModal) { }

  ngOnInit() {
    if (this.product.date) {
      this.dpDate.editDate = this.product.date;
      this.dpDate.setEditDate(this.product.date);
    }
    if (this.product.user) this.userService = [this.product.user];
    if (this.usersStateService.getAllUsers().length > 0) this.listTechUsers = this.getUsersForAssign();
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.listTechUsers = this.getUsersForAssign();
    })
    this.sub.add(getOnUsers);
    let onChangeUsers = this.usersStateService.onChangeUsers.subscribe((data) => {
      this.listTechUsers = this.getUsersForAssign();
    })
    this.sub.add(onChangeUsers);
    if (this.product.date) this.setDateWithTimeOffset();
  }
  public getTotal(price, quantity) {
    return (price * quantity).toFixed(2);
  }
  public getPrice() {
    return this.product.price.toFixed(2);
  }
  public setDateWithTimeOffset() {
    this.product.date = this.product.date + this.getTimeOffSet();
  }
  public getDate(date) {
    if (this.changeDate) return moment((date) ? new Date(date + this.getTimeOffSet()) : new Date()).format('DD MMM YYYY');
    return moment((date) ? new Date(date) : new Date()).format('DD MMM YYYY');
  }
  private getTimeOffSet() {
    // getting milliseconds of a date, after calculating timeOffSet of the tech user and timeOffset of the technical company
    let currentTimeOffset = new Date().getTimezoneOffset() * 60000;
    currentTimeOffset = (currentTimeOffset < 0) ? -currentTimeOffset : currentTimeOffset;
    let companyTimeOffset = this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset;
    companyTimeOffset = (companyTimeOffset < 0) ? -companyTimeOffset : companyTimeOffset;
    return (currentTimeOffset > companyTimeOffset) ? currentTimeOffset - companyTimeOffset : companyTimeOffset - currentTimeOffset;

  }

  setComplete() {
    if (this.isBlockChange) return;
    this.product.setCompleted(!this.product.completed);
    this.updateProduct();
  }
  private updateProduct() {
    this.ticketsService.updateExpense(this.product.getDateForUpdate(this.update.id)).subscribe(data => {
    })
  }
  public isIOSDevice() {
    return !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
  }
  public onChangeUser(data) {
    if (data.length === 0) this.product.setUser({ id: "" });
    if (data.length === 1) this.product.setUser(data[0]);
    this.updateProduct();
  }
  public onChangeDatePicker(data) {
    this.product.setDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
    this.updateProduct();
    this.changeDate = true;
  }
  getUsersForAssign() {
    let userList = this.usersStateService.getAllUsers().sort((a, b) => (`${a.firstName} ${a.lastName}`.toLowerCase() > `${b.firstName} ${b.lastName}`.toLowerCase()) ?
      1 : ((`${b.firstName} ${b.lastName}`.toLowerCase() > `${a.firstName} ${a.lastName}`.toLowerCase()) ? -1 : 0));
    return userList.filter((item) => item.accountType === "TECH" && !item.deletedAt);

  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  edit() {
    let update = new TicketProfileUpdate(JSON.parse(JSON.stringify(this.update)));
    update.products = [new TicketProfileProduct(JSON.parse(JSON.stringify(this.product)))];
    update.setUserUpdate(this.product.user);
    this.ticketStateService.editUpdateByFrom(update);
  }
  removeProduct() {
    this.ticketStateService.setUpdateForRemove(this.update);
    this.ticketStateService.setProductForRemove(this.product);
    this.confirmStateService.setConfirmAction(REMOVE_UPDATE_TICKET_DETAIL_PRODUCT);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Do you want to remove the item?`;

  }
}
