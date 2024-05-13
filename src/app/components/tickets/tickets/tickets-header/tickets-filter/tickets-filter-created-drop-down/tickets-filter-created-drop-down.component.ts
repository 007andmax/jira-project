import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { TitleListType } from '../../class/title-list-type';
import { NgbDate, NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { DateService } from 'src/app/services/date/date.service';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { DeviceTagsService } from 'src/app/services/device-tags/device-tags.service';
import { DevicesService } from 'src/app/services/devices/devices.service';

@Component({
  selector: 'tickets-filter-created-drop-down',
  templateUrl: './tickets-filter-created-drop-down.component.html',
  styleUrls: ['./tickets-filter-created-drop-down.component.scss']
})
export class TicketsFilterCreatedDropDownComponent extends DropDownComponent {
  @ViewChild('dp') dp: NgbDropdown;
  @Input() placement: string;
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
    private dateService: DateService,
    public companiesService: CompaniesService,
    public devicesService: DevicesService,
    public ref: ChangeDetectorRef) {
    super(elRef, companiesStateService, usersStateService, customerPortalStateService, companiesService, devicesService, ref);
  }

  /**
* @description Set selected element and check it's 'CUSTOM' oprion or not
* @param {Object} data - selected element
*/
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
* @description Set selected dates from datepicker
* @param {NgbDate} date - Object datepicker
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

  /**
* @description Changed selected date from datepicker
* @param {NgbDate} start - Object start from datepicker
* @param {NgbDate} end - Object end from datepicker
*/
  public setSelectedDateModel(start, end) {
    if (start && end) {
      const startDate = new Date(this.dateService.getDateFromBootstrap(start));
      const endDate = new Date(this.dateService.getDateFromBootstrap(end));
      this.changeSelectedDateModel(startDate, endDate);
    } else {
      this.selectedDateModel = '';
    }
  }

  /**
* @description Set new value selectedDateModel
* @param {Date} start - Object of Date
* @param {Date} end - Object of Date
*/
  public changeSelectedDateModel(start, end) {
    this.selectedDateModel = `${this.dateService.getInvoiceDate(start)} - ${this.dateService.getInvoiceDate(end)}`;
  }

  /**
* @description Check date is range
* @param {NgbDate} date - Object of NgbDate
*/
  public isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }
  /**
 * @description Check date is inside
 * @param {NgbDate} date - Object of NgbDate
 */
  public isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  /**
 * @description Check date is hover
 * @param {NgbDate} date - Object of NgbDate
 */
  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  /**
 * @description Return selected element from dropdown or datepicker
 * @param {NgbDate} date - Object of NgbDate
 * @returns  {String} This is the result
 */
  getSelectedItemText() {
    if (this.selectedDateModel != '') return this.selectedDateModel;
    return (this.selectedItem) ? this.selectedItem[this.field] : "";
  }

  /**
 * @description Clear selectedItem and selectedDateModel without Output event
 */
  public clearWithOutChanges() {
    this.isAdd = false;
    this.selectedItem = null;
    this.selectedDateModel = '';
  }

  /**
* @description Clear selectedItem and selectedDateModel and input
*/
  clearClient() {
    this.isAdd = false;
    this.selectedItem = null;
    this.selectedDateModel = '';
    this.elRef.nativeElement.querySelector("#dropdown1").value = "";
    this.list = JSON.parse(JSON.stringify(this.reqList));
    this.onSelectedItem.emit(null);
  }
}
