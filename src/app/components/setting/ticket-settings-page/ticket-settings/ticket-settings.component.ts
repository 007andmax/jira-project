import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InvoiceTicketsService } from '../../accounting/accounting-settings.service';
import { UsersService } from 'src/app/services/users/users.service';
import { ToastrService } from 'ngx-toastr';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CompanySetting } from 'src/app/components/companies/class/company-setting';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { TitleListType } from 'src/app/components/tickets/tickets/tickets-header/class/title-list-type';

@Component({
  selector: 'app-ticket-settings',
  templateUrl: './ticket-settings.component.html',
  styleUrls: ['./ticket-settings.component.scss']
})
export class TicketSettingsComponent implements OnInit {
  intervals = [new CompanySetting('1 minute', 'ONE_MINUTE'),
  new CompanySetting('5 minutes', 'FIVE_MINUTES'),
  new CompanySetting('10 minutes', 'TEN_MINUTES'),
  new CompanySetting('15 minutes', 'FIFTEEN_MINUTES')];
  timepickerTypes = [new CompanySetting('Start-End time picker', 'TIME_PICKER'),
  new CompanySetting('Duration picker', 'DURATION_PICKER')];
  @ViewChild('intervalsDp') intervalsDp: DropDownComponent;
  loading = true;
  submitted = false;
  used = false;
  ticketForm: FormGroup;
  nextValid: '';
  public currentUser: any;
  currentCompany: any;
  hasChange: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private invoiceTicketsService: InvoiceTicketsService,
    private toastr: ToastrService,
    private companiesStateService: CompaniesStateService,
    private usersStateService: UsersStateService,
    private usersService: UsersService
  ) { }

  /**
   * init
   */
  ngOnInit() {
    // get current user
    if (this.usersStateService.getCurrentUser()) {
      this.currentUser = this.usersStateService.getCurrentUser();
    }
    this.usersStateService.getOnGetCurrentuser().subscribe(data => {
      this.currentUser = data;
    })
    this.ticketForm = this.formBuilder.group({
      ticketCount: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^-?([0-9]\d*)?$/),
          Validators.maxLength(7)
        ])
      ],
      outliersTime: ['', Validators.compose([Validators.required])],
      timepickerType: ['DURATION_PICKER'],
      interval: ['FIVE_MINUTES'],
    });
    if (this.companiesStateService.getCurrentCompany()) this.getCurrentCompany(this.companiesStateService.getCurrentCompany());
    this.companiesStateService.onCurrentCompany.subscribe(res => {
      this.getCurrentCompany(res);
    })
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
      interval: serviceExpenseDurationPickerInterval
    });
    this.resetListIntervals(timepickerType);
  }

  resetListIntervals(timepickerType) {
    console.log("timepickerType", timepickerType);
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
        const initialValue = this.ticketForm.value
        this.ticketForm.valueChanges.subscribe(value => {
          this.hasChange = Object.keys(initialValue).some(key => value[key] !=
            initialValue[key])
        });
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
  getSelectedInterval() {
    return this.intervals.find(item => item.value === this.ticketForm.value.interval);
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
      }
    };
    if (this.hasChange) this.invoiceTicketsService.updateTicketsetting(objTicket).subscribe(
      (res: any) => {
        if (res && res.code === 409) {
          this.nextValid = res.message;
          this.ticketForm.patchValue({
            count: this.ticketForm.value.ticketCount
          });
          this.hasChange = false;
        }
      },
      error => {
        this.toastr.error('Bad Request');
      }
    );
  }
}
