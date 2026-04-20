import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InvoiceTicketsService } from '../../../../services/accounting/accounting-settings.service';
import { UsersService } from 'src/app/services/users/users.service';
import { ToastrService } from 'ngx-toastr';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CompanySetting } from 'src/app/components/companies/class/company-setting';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { Subscription } from 'rxjs';
import { DropDownComponent as DropDownComponent_1 } from '../../../shared/drop-down/drop-down.component';
import { MatErrorComponent } from '../../../shared/mat-error/mat-error.component';
import { NgClass, NgIf } from '@angular/common';
import { Onlynumber } from '../../../../helpers/Onlynumber';

@Component({
    selector: 'app-ticket-settings',
    templateUrl: './ticket-settings.component.html',
    styleUrls: ['./ticket-settings.component.scss'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, Onlynumber, NgClass, NgIf, MatErrorComponent, DropDownComponent_1]
})
export class TicketSettingsComponent implements OnInit, OnDestroy {
  intervals = [new CompanySetting('1 minute', 'ONE_MINUTE'),
  new CompanySetting('5 minutes', 'FIVE_MINUTES'),
  new CompanySetting('10 minutes', 'TEN_MINUTES'),
  new CompanySetting('15 minutes', 'FIFTEEN_MINUTES')];
  timepickerTypes = [new CompanySetting('Start-End time picker', 'TIME_PICKER'),
  new CompanySetting('Duration picker', 'DURATION_PICKER')];
  sorting = [new CompanySetting('Sort by creation date - Newest at the top', 'CREATED_DATE_DESC'),
  new CompanySetting('Sort by creation date - Oldest at the top', 'CREATED_DATE_ASC'),
  new CompanySetting('Sort by last update date - Newest at the top', 'LAST_UPDATED_DATE_DESC'),
  new CompanySetting('Sort by last update date - Oldest at the top', 'LAST_UPDATED_DATE_ASC')];
  @ViewChild('intervalsDp', { static: false }) intervalsDp: DropDownComponent;
  loading = true;
  submitted = false;
  used = false;
  ticketForm: UntypedFormGroup;
  nextValid: '';
  public currentUser: any;
  currentCompany: any;
  sub: Subscription = new Subscription();
  constructor(
    private formBuilder: UntypedFormBuilder,
    private invoiceTicketsService: InvoiceTicketsService,
    private toastr: ToastrService,
    private companiesStateService: CompaniesStateService,
    private usersStateService: UsersStateService,
  ) { }

  /**
   * init
   */
  ngOnInit() {
    // get current user
    if (this.usersStateService.getCurrentUser()) {
      this.currentUser = this.usersStateService.getCurrentUser();
    }
    let getOnGetCurrentuser = this.usersStateService.getOnGetCurrentuser().subscribe(data => {
      this.currentUser = data;
    })
    this.sub.add(getOnGetCurrentuser);
    this.ticketForm = this.formBuilder.group({
      ticketCount: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^-?([0-9]\d*)?$/),
          Validators.maxLength(7)
        ])
      ],
      outliersTime: ['', Validators.compose([Validators.required, Validators.min(1)])],
      timepickerType: ['DURATION_PICKER'],
      interval: ['FIVE_MINUTES'],
      defaultTicketSortOrder: ['']
    });
    if (this.companiesStateService.getCurrentCompany()) this.getCurrentCompany(this.companiesStateService.getCurrentCompany());
    let onCurrentCompany = this.companiesStateService.onCurrentCompany.subscribe(res => {
      this.getCurrentCompany(res);
    })
    this.sub.add(onCurrentCompany);
    this.getActualNumber();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.ticketForm.controls;
  }
  changeOutliersTime(data) {
    this.ticketForm.patchValue({ outliersTime: data });
  }

  /**
   * current comapny
   */
  getCurrentCompany(res) {
    let timepickerType = res.serviceExpenseDurationPresentation
      ? res.serviceExpenseDurationPresentation
      : 'DURATION_PICKER';
    let serviceExpenseDurationPickerInterval = res.serviceExpenseDurationPickerInterval
      ? res.serviceExpenseDurationPickerInterval
      : 'FIVE_MINUTES';
    this.ticketForm.patchValue({
      outliersTime: res.outliersSeconds
        ? res.outliersSeconds / 3600
        : null,
      timepickerType: timepickerType,
      interval: serviceExpenseDurationPickerInterval,
      defaultTicketSortOrder: res.defaulTticketSortOrder
    });
    this.resetListIntervals(timepickerType);
  }

  resetListIntervals(timepickerType) {
    if (timepickerType == "DURATION_PICKER") {
      this.intervals = [
        new CompanySetting('5 minutes', 'FIVE_MINUTES'),
        new CompanySetting('10 minutes', 'TEN_MINUTES'),
        new CompanySetting('15 minutes', 'FIFTEEN_MINUTES')];
    } else {
      this.intervals = [
        new CompanySetting('1 minute', 'ONE_MINUTE'),
        new CompanySetting('5 minutes', 'FIVE_MINUTES'),
        new CompanySetting('10 minutes', 'TEN_MINUTES'),
        new CompanySetting('15 minutes', 'FIFTEEN_MINUTES')];
    }
    if (this.intervalsDp) this.intervalsDp.reset(this.intervals);
  }

  /**
   * get actual number
   */
  getActualNumber() {
    this.invoiceTicketsService.actualNumber('TICKET').subscribe(
      (res: any) => {
        this.loading = false;
        if (res) {
          this.ticketForm.patchValue({
            ticketCount: res.number
          });
        }
      },
      error => { }
    );
  }

  onChangeType(data) {
    this.ticketForm.patchValue({
      timepickerType: data.value,
      interval: data.value === 'DURATION_PICKER' ? 'FIVE_MINUTES' : 'ONE_MINUTE'
    });
    this.resetListIntervals(data.value);
  }
  onChangeInterval(data) {
    this.ticketForm.patchValue({
      interval: data.value
    });
  }
  onChangeTicketSortOrder(data) {
    this.ticketForm.patchValue({
      defaultTicketSortOrder: data.value
    });
  }
  getSelectedInterval() {
    return this.intervals.find(item => item.value === this.ticketForm.value.interval);
  }
  getSelectedTicketSorting() {
    return this.sorting.find(item => item.value === this.ticketForm.value.defaultTicketSortOrder);
  }
  getSelectedTimepickerType() {
    return this.timepickerTypes.find(item => item.value === this.ticketForm.value.timepickerType);
  }

  /**
   * saved
   */
  public onSubmit() {
    this.submitted = true;
    if (this.ticketForm.invalid) {
      return;
    }
    const objTicket = {
      emailSettingPageNumberFormDto: {
        count: this.ticketForm.value.ticketCount,
        prefix: '',
        type: 'TICKET',
      },
      serviceExpenseDurationDto: {
        presentation: this.ticketForm.value.timepickerType,
        interval: this.ticketForm.value.interval
      },
      companyWorkingTimeDto: {
        workingDays: null,
        outliersSeconds: this.ticketForm.value.outliersTime
          ? this.ticketForm.value.outliersTime * 3600
          : null
      },
      "defaultTicketSortOrder": this.ticketForm.value.defaultTicketSortOrder
    };
    this.invoiceTicketsService.updateTicketsetting(objTicket).subscribe(
      (res: any) => {
        if (res && res.code === 409) {
          this.nextValid = res.message;
          this.ticketForm.patchValue({
            count: this.ticketForm.value.ticketCount
          });
        }
      },
      error => {
        this.toastr.error('Bad Request');
      }
    );
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
