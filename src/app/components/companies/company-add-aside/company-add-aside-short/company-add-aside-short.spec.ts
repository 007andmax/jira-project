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
import { CompanyAddAsideShortComponent } from './company-add-aside-short.component';


describe('CompanyAddAsideShortComponent unit test', () => {
  let component: CompanyAddAsideShortComponent;
  let fixture: ComponentFixture<CompanyAddAsideShortComponent>;

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
        NoopAnimationsModule, CompanyAddAsideShortComponent],
}).compileComponents();

  });
  it('check "onSelectCompanyTypes"', () => {
    const fixture = TestBed.createComponent(CompanyAddAsideShortComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectCompanyTypes({ value: 'Test Type' });
    expect(com.company.clientType).toEqual('Test Type');
  });
  it('check "onChangeType"', () => {
    const fixture = TestBed.createComponent(CompanyAddAsideShortComponent);
    const com = fixture.debugElement.componentInstance;
    com.company.clientType = 'Test Type';
    com.onChangeType();
    expect(com.validate.type).toEqual(true);
  });
  it('check "onChangeFirstName"', () => {
    const fixture = TestBed.createComponent(CompanyAddAsideShortComponent);
    const com = fixture.debugElement.componentInstance;
    com.company.contacts = [{ firstName: 'A' }];
    com.onChangeFirstName();
    expect(com.validate.firstName).toEqual(false);
  });
  it('check "onChangePhoneNumber"', () => {
    const fixture = TestBed.createComponent(CompanyAddAsideShortComponent);
    const com = fixture.debugElement.componentInstance;
    com.company.addresses = [{ phoneNumbers: [{ number: '1234567890' }] }];
    com.onChangePhoneNumber();
    expect(com.validate.shippingPhoneNumber).toEqual(false);
  });
  it('check "onChangePhoneNumber"', () => {
    const fixture = TestBed.createComponent(CompanyAddAsideShortComponent);
    const com = fixture.debugElement.componentInstance;
    com.company.addresses = [{ phoneNumbers: [{ number: '1234567890' }] }];
    com.onChangePhoneNumber();
    expect(com.validate.shippingPhoneNumber).toEqual(false);
  });
});