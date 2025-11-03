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
import { CompanyAddAsideFullComponent } from './company-add-aside-full.component';
import { UserCustomerCompaniesInfo } from 'src/app/components/users/class/user-customer-companies-info';


describe('CompanyAddAsideFullComponent unit test', () => {
  let component: CompanyAddAsideFullComponent;
  let fixture: ComponentFixture<CompanyAddAsideFullComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        MatErrorModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [CompanyAddAsideFullComponent
      ],
    }).compileComponents();

  });
  it('check "removeThirdParty"', () => {
    const fixture = TestBed.createComponent(CompanyAddAsideFullComponent);
    const com = fixture.debugElement.componentInstance;
    com.company.thirdPartyApps = [{ name: "Test App", id: 1 }];
    com.removeThirdParty(0);
    expect(com.company.thirdPartyApps.length).toEqual(0);
  });
  it('check "onCheckPrimaryNumber"', () => {
    const fixture = TestBed.createComponent(CompanyAddAsideFullComponent);
    const com = fixture.debugElement.componentInstance;
    com.company.contacts = [{ phoneNumbers: [{ number: '1234567890' }] }];
    com.onCheckPrimaryNumber();
    expect(com.validate.primaryPhoneNumber).toEqual(false);
  });
  it('check "onSelectCompanyTypes"', () => {
    const fixture = TestBed.createComponent(CompanyAddAsideFullComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectCompanyTypes({ value: 'Test Type' });
    expect(com.company.clientType).toEqual('Test Type');
  });
  it('check "onChangeType"', () => {
    const fixture = TestBed.createComponent(CompanyAddAsideFullComponent);
    const com = fixture.debugElement.componentInstance;
    com.company.clientType = 'Test Type';
    com.onChangeType();
    expect(com.validate.type).toEqual(true);
  });
  it('check "onSelectClientIndustry"', () => {
    const fixture = TestBed.createComponent(CompanyAddAsideFullComponent);
    const com = fixture.debugElement.componentInstance;
    com.company.clientIndustry.name = 'Test Type';
    com.onSelectClientIndustry({ name: 'Test Industry' });
    expect(com.company.clientIndustry.name).toEqual('Test Industry');
  });
  it('check "onChangeShippingPhoneNumber"', () => {
    const fixture = TestBed.createComponent(CompanyAddAsideFullComponent);
    const com = fixture.debugElement.componentInstance;
    com.company.addresses = [{ phoneNumbers: [{ number: '1234567890' }] }, { phoneNumbers: [{ number: '0987654321' }] }];
    com.onChangeShippingPhoneNumber();
    expect(com.validate.shippingPhoneNumber).toEqual(false);
  });
  it('check "onChangeFirstName"', () => {
    const fixture = TestBed.createComponent(CompanyAddAsideFullComponent);
    const com = fixture.debugElement.componentInstance;
    com.company.contacts = [{ firstName: 'A' }];
    com.onChangeFirstName();
    expect(com.validate.firstName).toEqual(false);
  });
  it('check "onSelectJobTitle"', () => {
    const fixture = TestBed.createComponent(CompanyAddAsideFullComponent);
    const com = fixture.debugElement.componentInstance;
    com.company.contacts = [{ customerCompaniesInfo: [new UserCustomerCompaniesInfo({ jobTitleDto: { id: 1, name: 'Test Job' } })] }];
    com.onSelectJobTitle({ id: 1, name: 'Test Job' });
    expect(com.company.contacts[0].customerCompaniesInfo[0].jobTitleDto.id).toEqual(1);
  });
  it('check "onChangePrimaryEmail"', () => {
    const fixture = TestBed.createComponent(CompanyAddAsideFullComponent);
    const com = fixture.debugElement.componentInstance;
    com.company.contacts = [{ primaryEmail: '' }];
    com.onChangePrimaryEmail();
    expect(com.validate.primaryContactEmail).toEqual(false);
  });
  it('check "onSelectPaymentTerms"', () => {
    const fixture = TestBed.createComponent(CompanyAddAsideFullComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectPaymentTerms({ value: 'Net 30' });
    expect(com.company.paymentTerms).toEqual('Net 30');
  });
  it('check "onChangeTimeZone"', () => {
    const fixture = TestBed.createComponent(CompanyAddAsideFullComponent);
    const com = fixture.debugElement.componentInstance;
    com.company.addresses = [{ locale: 'UTC' }];
    com.onChangeTimeZone(null);
    expect(com.company.addresses[0].locale).toEqual('');
  });
  it('check "onSelectPaymentMethod"', () => {
    const fixture = TestBed.createComponent(CompanyAddAsideFullComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectPaymentMethod({ value: 'Credit Card' });
    expect(com.company.defaultPaymentMethod).toEqual('Credit Card');
  });
  it('check "onSelectServiceTypes"', () => {
    const fixture = TestBed.createComponent(CompanyAddAsideFullComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectServiceTypes({ name: 'Test Service' });
    expect(com.company.serviceType).toEqual('Test Service');
  });
  it('check "onSelectTechLead"', () => {
    const fixture = TestBed.createComponent(CompanyAddAsideFullComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectTechLead({ id: 1, firstName: 'John', lastName: 'Doe' });
    expect(com.company.techLeadId).toEqual(1);
  });
  it('check "onChangeTags"', () => {
    const fixture = TestBed.createComponent(CompanyAddAsideFullComponent);
    const com = fixture.debugElement.componentInstance;
    com.onChangeTags(['Tag1', 'Tag2']);
    expect(com.company.tags).toEqual(['Tag1', 'Tag2']);
  });
  it('check "onChangeDescription"', () => {
    const fixture = TestBed.createComponent(CompanyAddAsideFullComponent);
    const com = fixture.debugElement.componentInstance;
    com.onChangeDescription({ target: { value: 'Test Description' } });
    expect(com.company.description).toEqual('Test Description');
  });
});