import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TicketSettingsComponent } from './ticket-settings.component';
import { CompanySetting } from 'src/app/components/companies/class/company-setting';

describe('TicketSettingsComponent unit test', () => {
  let component: TicketSettingsComponent;
  let fixture: ComponentFixture<TicketSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [TicketSettingsComponent
      ],
      providers: [FormBuilder]
    }).compileComponents();

  });

  it('check "getCurrentCompany"', () => {
    const fixture = TestBed.createComponent(TicketSettingsComponent);
    const com = fixture.debugElement.componentInstance;
    com.ngOnInit();
    com.getCurrentCompany({ serviceExpenseDurationPresentation: null, serviceExpenseDurationPickerInterval: null, outliersSeconds: 3600, defaulTticketSortOrder: 'CREATED_DATE_DESC' });
    expect(com.ticketForm.value.outliersTime).toEqual(1);
    expect(com.ticketForm.value.timepickerType).toEqual("DURATION_PICKER");
    expect(com.ticketForm.value.interval).toEqual("FIVE_MINUTES");
    expect(com.ticketForm.value.defaultTicketSortOrder).toEqual("CREATED_DATE_DESC");
  });
  it('check "onChangeType"', () => {
    const fixture = TestBed.createComponent(TicketSettingsComponent);
    const com = fixture.debugElement.componentInstance;
    com.ngOnInit();
    com.onChangeType({ value: 'DURATION_PICKER' });
    expect(com.ticketForm.value.timepickerType).toEqual('DURATION_PICKER');
    expect(com.ticketForm.value.interval).toEqual('FIVE_MINUTES');
  });
  it('check "onChangeInterval"', () => {
    const fixture = TestBed.createComponent(TicketSettingsComponent);
    const com = fixture.debugElement.componentInstance;
    com.ngOnInit();
    com.onChangeInterval({ value: 'FIVE_MINUTES' });
    expect(com.ticketForm.value.interval).toEqual("FIVE_MINUTES");
  });
  it('check "onChangeTicketSortOrder"', () => {
    const fixture = TestBed.createComponent(TicketSettingsComponent);
    const com = fixture.debugElement.componentInstance;
    com.ngOnInit();
    com.onChangeTicketSortOrder({ value: 'CREATED_DATE_DESC' });
    expect(com.ticketForm.value.defaultTicketSortOrder).toEqual("CREATED_DATE_DESC");
  });
  it('check "getSelectedInterval"', () => {
    const fixture = TestBed.createComponent(TicketSettingsComponent);
    const com = fixture.debugElement.componentInstance;
    com.ngOnInit();
    expect(com.getSelectedInterval()).toEqual(new CompanySetting('5 minutes', 'FIVE_MINUTES'));
  });
  it('check "getSelectedTicketSorting"', () => {
    const fixture = TestBed.createComponent(TicketSettingsComponent);
    const com = fixture.debugElement.componentInstance;
    com.ngOnInit();
    expect(com.getSelectedTicketSorting()).toEqual(undefined);
  });
  it('check "getSelectedTimepickerType"', () => {
    const fixture = TestBed.createComponent(TicketSettingsComponent);
    const com = fixture.debugElement.componentInstance;
    com.ngOnInit();
    expect(com.getSelectedTimepickerType()).toEqual(new CompanySetting('Duration picker', 'DURATION_PICKER'));
  });
});