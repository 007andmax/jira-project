import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { DeviceCompany } from 'src/app/components/company-devices/class/device-company';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TicketProfileFormProduct } from '../../../ticket-edit-aside/class/ticket-profile-form-product';
import { ProductListModule } from 'src/app/components/shared/product-list/product-list.module';
import { DecimalNumberModule } from 'src/app/directives/decimal-number/decimal-number.module';
import { FormBuilder, FormsModule } from '@angular/forms';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { MatFormFieldModule } from 'src/app/components/shared/mat-form-field/mat-form-field.module';
import { InvoiceFormTicketEditTaxesModule } from 'src/app/components/billing/billable/billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-taxes/invoice-form-ticket-edit-taxes.module';
import { ServicesListModule } from 'src/app/components/shared/services-list/services-list.module';
import { TicketDetailProfileEditUpdatesServicesComponent } from './ticket-detail-profile-edit-updates-services.component';
import { TicketProfileFormService } from '../../../ticket-edit-aside/class/ticket-profile-form-service';
import { TicketDetailProfileEditUpdatesProductsComponent } from '../ticket-detail-profile-edit-updates-products/ticket-detail-profile-edit-updates-products.component';
import { TicketProfileUpdatesServiceTimepickerModule } from '../../../ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-service-timepicker/ticket-profile-updates-service-timepicker.module';
import { TicketProfileUpdatesServiceDurationModule } from '../../../ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-service-duration/ticket-profile-updates-service-duration.module';
import { DatePickerModule } from 'src/app/components/shared/date-picker/date-picker.module';
import { TicketProfileService } from '../../../class/ticket-profile-service';

describe('TicketDetailProfileEditUpdatesServicesComponent unit test', () => {
  let component: TicketDetailProfileEditUpdatesServicesComponent;
  let fixture: ComponentFixture<TicketDetailProfileEditUpdatesServicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NgbModule,
        DecimalNumberModule,
        NoopAnimationsModule,
        ServicesListModule,
        TicketProfileUpdatesServiceTimepickerModule,
        TicketProfileUpdatesServiceDurationModule,
        DatePickerModule
      ],
      declarations: [TicketDetailProfileEditUpdatesServicesComponent
      ],
    }).compileComponents();

  });

  it('check "getHours"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileEditUpdatesServicesComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getHours({ quantity: 1 })).toEqual(1)
  });
  it('check "getMinutes"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileEditUpdatesServicesComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getMinutes({ quantity: 1.5 })).toEqual(30)
  });
  it('check "onChangeDurationService"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileEditUpdatesServicesComponent);
    const com = fixture.debugElement.componentInstance;
    com.addedServiceList.push(new TicketProfileFormService(JSON.parse(JSON.stringify(com.currentService))));
    com.onChangeDurationService(2, 0);
    expect(com.addedServiceList[0].quantity).toEqual(2)
    expect(com.addedServiceList[0].durationEnd).toEqual(com.addedServiceList[0].durationStart + (3600000 * 2))
  });
  it('check "removeService"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileEditUpdatesServicesComponent);
    const com = fixture.debugElement.componentInstance;
    com.addedServiceList.push(new TicketProfileFormService(JSON.parse(JSON.stringify(com.currentService))));
    com.removeService(0);
    expect(com.addedServiceList.length).toEqual(0)
  });
  it('check "onChangeStartTimePickerService"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileEditUpdatesServicesComponent);
    const com = fixture.debugElement.componentInstance;
    com.addedServiceList.push(new TicketProfileFormService(JSON.parse(JSON.stringify(com.currentService))));
    let currentDate = new Date();
    let durationStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes()).getTime();
    com.onChangeStartTimePickerService(durationStart, 0);
    expect(com.addedServiceList[0].quantity).toEqual(0)
  });
  it('check "onChangeEndTimePickerSerice"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileEditUpdatesServicesComponent);
    const com = fixture.debugElement.componentInstance;
    com.addedServiceList.push(new TicketProfileFormService(JSON.parse(JSON.stringify(com.currentService))));
    let currentDate = new Date();
    let durationStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes()).getTime();
    com.onChangeEndTimePickerSerice(durationStart, 0);
    expect(com.addedServiceList[0].quantity).toEqual(0)
  });
  it('check "getItemOrger"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileEditUpdatesServicesComponent);
    const com = fixture.debugElement.componentInstance;
    com.addedServiceList.push(new TicketProfileFormService(JSON.parse(JSON.stringify(com.currentService))));
    expect(com.getItemOrger()).toEqual(0)
  });
  it('check "onChangeDescription"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileEditUpdatesServicesComponent);
    const com = fixture.debugElement.componentInstance;
    com.onChangeDescription({ target: { value: "test" } })
    expect(com.currentService.description).toEqual("test")
  });
  it('check "onChangeDescriptionService"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileEditUpdatesServicesComponent);
    const com = fixture.debugElement.componentInstance;
    com.addedServiceList.push(new TicketProfileFormService(JSON.parse(JSON.stringify(com.currentService))));
    com.onChangeDescriptionService({ target: { value: "test" } }, 0)
    expect(com.addedServiceList[0].description).toEqual("test")
  });
  it('check "onPastDescription"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileEditUpdatesServicesComponent);
    const com = fixture.debugElement.componentInstance;
    com.onPastDescription("test")
    expect(com.currentService.description).toEqual("test")
  });
  it('check "onPastDescriptionService"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileEditUpdatesServicesComponent);
    const com = fixture.debugElement.componentInstance;
    com.addedServiceList.push(new TicketProfileFormService(JSON.parse(JSON.stringify(com.currentService))));
    com.onPastDescriptionService("test", 0)
    expect(com.addedServiceList[0].description).toEqual("test")
  });
  it('check "getSelectedServices"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileEditUpdatesServicesComponent);
    const com = fixture.debugElement.componentInstance;
    com.addedServiceList.push(new TicketProfileFormService(JSON.parse(JSON.stringify(com.currentService))));
    expect(com.getSelectedServices().length).toEqual(1)
  });
  it('check "onValidateServices"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileEditUpdatesServicesComponent);
    const com = fixture.debugElement.componentInstance;
    com.addedServiceList.push(new TicketProfileFormService(JSON.parse(JSON.stringify(com.currentService))));
    expect(com.onValidateServices()).toEqual(false)
  });
  it('check "onChangeStartTimePicker"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileEditUpdatesServicesComponent);
    const com = fixture.debugElement.componentInstance;
    let currentDate = new Date();
    let durationStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes()).getTime();
    com.service = new TicketProfileService();
    com.service.durationEnd = durationStart;
    com.onChangeStartTimePicker(durationStart);
    expect(com.service.durationStart).toEqual(durationStart)
  });
  it('check "onChangeEndTimePicker"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileEditUpdatesServicesComponent);
    const com = fixture.debugElement.componentInstance;
    let currentDate = new Date();
    let durationEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes()).getTime();
    com.service = new TicketProfileService();
    com.onChangeEndTimePicker(durationEnd);
    expect(com.service.durationEnd).toEqual(durationEnd)
  });
  it('check "onChangeDuration"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileEditUpdatesServicesComponent);
    const com = fixture.debugElement.componentInstance;
    com.service = new TicketProfileService();
    com.onChangeDuration(2);
    expect(com.service.durationEnd).toEqual((3600000 * 2) + com.service.durationStart);
  });
});