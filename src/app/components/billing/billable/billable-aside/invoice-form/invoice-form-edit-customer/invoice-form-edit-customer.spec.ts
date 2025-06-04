import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { InvoiceFormEditCustomerComponent } from './invoice-form-edit-customer.component';


describe('InvoiceFormEditCustomerComponent unit test', () => {
  let component: InvoiceFormEditCustomerComponent;
  let fixture: ComponentFixture<InvoiceFormEditCustomerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        DropDownModule,
        NgxMaskModule.forRoot(),
        MatErrorModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [InvoiceFormEditCustomerComponent
      ]
    }).compileComponents();

  });

  it('check "onChangeLastName"', () => {
    const fixture = TestBed.createComponent(InvoiceFormEditCustomerComponent);
    const com = fixture.debugElement.componentInstance;
    com.company = {
      addresses: [{
        address: '',
        addressWithSuitNumberAndPostalCode: '',
        locationLat: 0,
        locationLng: 0,
        postalCode: ''
      }],
      firstName: '',
      lastName: '',
      companyName: '',
      contacts: [
        {
          id: '',
          name: '',
          description: '',
          startDate: '',
          endDate: '',
          status: '',
          firstName: 'test',
          lastName: ''
        }
      ]
    };
    com.onChangeLastName();
    expect(com.validate.lastName).toEqual(false);
  });
  it('check "onChangeFirstName"', () => {
    const fixture = TestBed.createComponent(InvoiceFormEditCustomerComponent);
    const com = fixture.debugElement.componentInstance;
    com.company = {
      addresses: [{
        address: '',
        addressWithSuitNumberAndPostalCode: '',
        locationLat: 0,
        locationLng: 0,
        postalCode: ''
      }],
      firstName: '',
      lastName: '',
      companyName: '',
      contacts: [
        {
          id: '',
          name: '',
          description: '',
          startDate: '',
          endDate: '',
          status: '',
          firstName: 'test',
          lastName: ''
        }
      ]
    };
    com.onChangeFirstName();
    expect(com.validate.firstName).toEqual(true);
  });
  it('check "onChangePrimaryEmail"', () => {
    const fixture = TestBed.createComponent(InvoiceFormEditCustomerComponent);
    const com = fixture.debugElement.componentInstance;
    com.company = {
      addresses: [{
        address: '',
        addressWithSuitNumberAndPostalCode: '',
        locationLat: 0,
        locationLng: 0,
        postalCode: ''
      }],
      firstName: '',
      lastName: '',
      companyName: '',
      contacts: [
        {
          id: '',
          name: '',
          description: '',
          startDate: '',
          endDate: '',
          status: '',
          firstName: 'test',
          primaryEmail: ''
        }
      ]
    };
    com.onChangePrimaryEmail();
    expect(com.validate.primaryContactEmail).toEqual(false);
  });
  it('check "onChangePhoneNumber"', () => {
    const fixture = TestBed.createComponent(InvoiceFormEditCustomerComponent);
    const com = fixture.debugElement.componentInstance;
    com.company = {
      addresses: [{
        address: '',
        addressWithSuitNumberAndPostalCode: '',
        locationLat: 0,
        locationLng: 0,
        postalCode: ''
      }],
      firstName: '',
      lastName: '',
      companyName: '',
      contacts: [
        {
          id: '',
          name: '',
          description: '',
          startDate: '',
          endDate: '',
          status: '',
          firstName: 'test',
          primaryEmail: '',
          phoneNumbers: [{
            number: ''
          }]
        }
      ]
    };
    com.onChangePhoneNumber();
    expect(com.validate.phoneNumber).toEqual(false);
  });
});