import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { GlNumbersDropDownModule } from 'src/app/components/inventory/gl-numbers-drop-down/gl-numbers-drop-down.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CompanyEditAsideComponent } from './company-edit-aside.component';
import { CompanySetting } from '../class/company-setting';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';

describe('CompanyEditAsideComponent unit test', () => {
  let component: CompanyEditAsideComponent;
  let fixture: ComponentFixture<CompanyEditAsideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        DisabledBtnModule,
        MatErrorModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [CompanyEditAsideComponent
      ],
    }).compileComponents();

  });
  it('check "getSelectedPaymentMethod"', () => {
    const fixture = TestBed.createComponent(CompanyEditAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.company.defaultPaymentMethod = 'CREDIT_CARD';
    expect(com.getSelectedPaymentMethod()).toEqual(new CompanySetting('Credit Card', 'CREDIT_CARD'));
  });
  it('check "onChangeShippingPhoneNumber"', () => {
    const fixture = TestBed.createComponent(CompanyEditAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.company.addresses = [{ phoneNumbers: [{ number: '1234567890' }] }, { phoneNumbers: [{ number: '0987654321' }] }];
    com.onChangeShippingPhoneNumber();
    expect(com.validate.shippingPhoneNumber).toEqual(false);
  });
  it('check "removeThirdParty"', () => {
    const fixture = TestBed.createComponent(CompanyEditAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.company.thirdPartyApps = [{ name: "Test App", id: 1 }];
    com.removeThirdParty(0);
    expect(com.company.thirdPartyApps.length).toEqual(0);
  });
  it('check "onSelectCompanyTypes"', () => {
    const fixture = TestBed.createComponent(CompanyEditAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectCompanyTypes({ value: 'Test Type' });
    expect(com.company.clientType).toEqual('Test Type');
  });
  it('check "onSelectCompanyTypes"', () => {
    const fixture = TestBed.createComponent(CompanyEditAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectCompanyTypes({ value: 'Test Type' });
    expect(com.company.clientType).toEqual('Test Type');
  });
  it('check "onChangeType"', () => {
    const fixture = TestBed.createComponent(CompanyEditAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.company.clientType = 'Test Type';
    com.onChangeType();
    expect(com.validate.type).toEqual(true);
  });
  it('check "onSelectTechLead"', () => {
    const fixture = TestBed.createComponent(CompanyEditAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectTechLead({ id: 1, firstName: 'John', lastName: 'Doe' });
    expect(com.company.techLeadId).toEqual(1);
  });
  it('check "onSelectPaymentMethod"', () => {
    const fixture = TestBed.createComponent(CompanyEditAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectPaymentMethod({ value: 'Credit Card' });
    expect(com.company.defaultPaymentMethod).toEqual('Credit Card');
  });
  it('check "onSelectPaymentTerms"', () => {
    const fixture = TestBed.createComponent(CompanyEditAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectPaymentTerms({ value: 'Net 30' });
    expect(com.company.paymentTerms).toEqual('Net 30');
  });
  it('check "onSelectServiceTypes"', () => {
    const fixture = TestBed.createComponent(CompanyEditAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectServiceTypes({ name: 'Test Service' });
    expect(com.company.serviceType).toEqual('Test Service');
  });
  it('check "onChangePrimaryEmail"', () => {
    const fixture = TestBed.createComponent(CompanyEditAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.company.contacts = [{ primaryEmail: '' }];
    com.onChangePrimaryEmail();
    expect(com.validate.primaryContactEmail).toEqual(false);
  });
  it('check "removeThirdParty"', () => {
    const fixture = TestBed.createComponent(CompanyEditAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.company.thirdPartyApps = [{ name: "Test App", id: 1 }];
    com.removeThirdParty(0);
    expect(com.company.thirdPartyApps.length).toEqual(0);
  });
  it('check "onChangeFirstName"', () => {
    const fixture = TestBed.createComponent(CompanyEditAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.company.contacts = [{ firstName: 'A' }];
    com.onChangeFirstName();
    expect(com.validate.firstName).toEqual(false);
  });
  it('check "onChangeTimeZone"', () => {
    const fixture = TestBed.createComponent(CompanyEditAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.company.addresses = [{ locale: 'UTC' }];
    com.onChangeTimeZone(null);
    expect(com.company.addresses[0].locale).toEqual('');
  });
  it('check "onSelectClientIndustry"', () => {
    const fixture = TestBed.createComponent(CompanyEditAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.company.clientIndustry.name = 'Test Type';
    com.onSelectClientIndustry({ name: 'Test Industry' });
    expect(com.company.clientIndustry.name).toEqual('Test Industry');
  });
  it('check "onChangeTags"', () => {
    const fixture = TestBed.createComponent(CompanyEditAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.onChangeTags(['Tag1', 'Tag2']);
    expect(com.company.tags).toEqual(['Tag1', 'Tag2']);
  });
  it('check "onChangeDescription"', () => {
    const fixture = TestBed.createComponent(CompanyEditAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.onChangeDescription({ target: { value: 'Test Description' } });
    expect(com.company.description).toEqual('Test Description');
  });
  it('check "getSelectedClientTypes"', () => {
    const fixture = TestBed.createComponent(CompanyEditAsideComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getSelectedClientTypes()).toEqual(null);
  });
  it('check "getSelectedCompanyTypes"', () => {
    const fixture = TestBed.createComponent(CompanyEditAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.company.clientType = 'CLIENT';
    expect(com.getSelectedCompanyTypes()).toEqual(new CompanySetting('Client', 'CLIENT'));
  });
  it('check "getSelectedServiceType"', () => {
    const fixture = TestBed.createComponent(CompanyEditAsideComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getSelectedServiceType()).toEqual('');
  });
  it('check "getSelectedPaymentTerms"', () => {
    const fixture = TestBed.createComponent(CompanyEditAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.company.paymentTerms = 7;
    expect(com.getSelectedPaymentTerms()).toEqual(new CompanySetting('7 days', 7));
  });
});