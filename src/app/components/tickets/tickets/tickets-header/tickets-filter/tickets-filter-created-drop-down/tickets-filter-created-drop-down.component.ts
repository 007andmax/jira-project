import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { TitleListType } from '../../class/title-list-type';
import { NgbDate, NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { DateService } from 'src/app/services/date/date.service';

@Component({
  selector: 'tickets-filter-created-drop-down',
  templateUrl: './tickets-filter-created-drop-down.component.html',
  styleUrls: ['./tickets-filter-created-drop-down.component.scss']
})
export class TicketsFilterCreatedDropDownComponent extends DropDownComponent {
  @ViewChild('dp') dp: NgbDropdown;
  @Input() list = [new TitleListType('Custom Date range', 'CUSTOM'),
  new TitleListType('Today', 'TODAY'),
  new TitleListType('Yesterday', 'YESTERDAY'),
  new TitleListType('This Week', 'THIS_WEEK'),
  new TitleListType('This Month', 'THIS_MONTH')];
  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;
  @Output() selectedDate = new EventEmitter<any>();
  public selectedDateModel = '';
  public outsideDays = 'hidden';
  constructor(public elRef: ElementRef,
    public companiesStateService: CompaniesStateService,
    public usersStateService: UsersStateService,
    public customerPortalStateService: CustomerPortalStateService,
    private dateService: DateService) {
    super(elRef, companiesStateService, usersStateService, customerPortalStateService);
  }

  onSelect(data) {
    this.isAdd = false;
    this.selectedItem = data;
    if (data.type == "CUSTOM") {
      this.dp.open();
    } else {
      this.dp.close();
      this.onSelectedItem.emit(data.type);
      this.selectedDateModel = '';
    }
  }
  /**
   * check type for hover
   * @param date - date for select
   */
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    if (this.fromDate && this.toDate) {
      this.selectedDate.next({
        start: this.dateService.getDateFromBootstrap(this.fromDate),
        end: this.dateService.getDateFromBootstrap(this.toDate),
      });

      this.setSelectedDateModel(this.fromDate, this.toDate);
      this.dp.close();
    }
  }
  public setSelectedDateModel(start, end) {
    if (start && end) {

      const startDate = new Date(this.dateService.getDateFromBootstrap(start));
      const endDate = new Date(this.dateService.getDateFromBootstrap(end));

      this.selectedDateModel = `${this.dateService.getInvoiceDate(startDate)} - ${this.dateService.getInvoiceDate(endDate)}`;
    } else {
      this.selectedDateModel = '';
    }
  }
  /**
  * check type for range
  * @param date - date range for check
  */
  public isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }
  /**
  * check is inside
  * @param date - date range for check
  */
  public isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  /**
  * check type for hover
  * @param date - date range for check
  */
  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  getSelectedItemText() {
    if (this.selectedDateModel != '') return this.selectedDateModel;
    return (this.selectedItem) ? this.selectedItem[this.field] : "";
  }

  public clearWithOutChanges() {
    this.isAdd = false;
    this.selectedItem = null;
    this.selectedDateModel = '';
  }
  clearClient() {
    this.isAdd = false;
    this.selectedItem = null;
    this.selectedDateModel = '';
    this.elRef.nativeElement.querySelector("#dropdown1").value = "";
    this.list = JSON.parse(JSON.stringify(this.reqList));
    this.onSelectedItem.emit(null);
  }
}
