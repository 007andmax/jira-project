import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { CompanySubscriptionModule } from '../../companies/company-subscription/company-subscription.module';
import { CompanyTagsModule } from '../../companies/company-tags/company-tags.module';
import { CompanyDropDownModule } from '../../shared/company-drop-down/company-drop-down.module';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { DynamicTooltipModule } from '../../shared/dynamic-tooltip/dynamic-tooltip.module';
import { MatErrorModule } from '../../shared/mat-error/mat-error.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { UserDefaultSubscription } from '../class/user-default-subscription';
import { UserCustomSubscriptionModule } from './user-custom-subscription/user-custom-subscription.module';
import { UserDefaultSubscriptionComponent } from './user-default-subscription/user-default-subscription.component';
import { UserDefaultSubscriptionModule } from './user-default-subscription/user-default-subscription.module';
import { UsersAsideComponent } from './users-aside.component';
import { UserCustomerCompaniesInfo } from '../class/user-customer-companies-info';
import { UserDefaultSubscriptionItem } from '../class/user-default-subscription-item';


describe('UsersAsideComponent unit test', () => {
  let component: UsersAsideComponent;
  let fixture: ComponentFixture<UsersAsideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        DropDownModule,
        CompanySubscriptionModule,
        CompanyTagsModule,
        DisabledBtnModule,
        TextAreaModule,
        UserDefaultSubscriptionModule,
        UserCustomSubscriptionModule,
        NgbModule,
        NgxMaskModule.forRoot(),
        CompanyDropDownModule,
        PreloaderTicketModule,
        DynamicTooltipModule,
        MatErrorModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [UsersAsideComponent
      ]
    }).compileComponents();

  });

  it('check "onChangeJobDescription"', () => {
    const fixture = TestBed.createComponent(UsersAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.onChangeJobDescription({ target: { value: "test" } });
    expect(com.user.jobDescription).toEqual("test");
  });
  it('check "addPhoneNumber"', () => {
    const fixture = TestBed.createComponent(UsersAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.addPhoneNumber();
    expect(com.user.phoneNumbers[0].typeNumber).toEqual("OFFICE");
  });
  it('check "onChangeTags"', () => {
    const fixture = TestBed.createComponent(UsersAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.onChangeTags([{ id: "test" }]);
    expect(com.user.tags).toEqual([{ id: "test" }]);
  });
  it('check "onChangeDefaultSubscriptions"', () => {
    const fixture = TestBed.createComponent(UsersAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.user.customerCompaniesInfo = [new UserCustomerCompaniesInfo()];
    com.onChangeDefaultSubscriptions({
      invoiceSubscription: new UserDefaultSubscriptionItem({ enabled: false, activated: false, }),
      ticketSubscription: new UserDefaultSubscriptionItem({ enabled: false, activated: false, }),
      ticketManagerSubscription: new UserDefaultSubscriptionItem({ enabled: false, activated: false, })
    }, 0);
    expect(com.user.customerCompaniesInfo[0].defaultSubscriptions.invoiceSubscription.enabled).toEqual(false);
  });
  it('check "onChangeCustomSubscriptions"', () => {
    const fixture = TestBed.createComponent(UsersAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.onChangeCustomSubscriptions([{ id: "test" }]);
    expect(com.user.customSubscriptions.id).toEqual(undefined);
  });
  it('check "onCheckPhoneNumber"', () => {
    const fixture = TestBed.createComponent(UsersAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.addPhoneNumber();
    com.user.phoneNumbers[0].number = "test";
    com.onCheckPhoneNumber(0);
    expect(com.validate.phoneNumber[0]).toEqual(false);
  });
  it('check "addCompnay"', () => {
    const fixture = TestBed.createComponent(UsersAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.addCompnay();
    expect(com.user.customerCompaniesInfo.length).toEqual(1);
  });
  it('check "removeCompnay"', () => {
    const fixture = TestBed.createComponent(UsersAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.addCompnay();
    com.removeCompnay();
    expect(com.user.customerCompaniesInfo.length).toEqual(0);
  });
  it('check "onChangeFistname"', () => {
    const fixture = TestBed.createComponent(UsersAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.user.firstName = "test";
    com.onChangeFistname();
    expect(com.validate.firstName).toEqual(true);
  });
  it('check "addPhoneNumber"', () => {
    const fixture = TestBed.createComponent(UsersAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.addPhoneNumber();
    expect(com.user.phoneNumbers[0].typeNumber).toEqual("OFFICE");
    com.removePhoneNumber(0);
    expect(com.user.phoneNumbers.length).toEqual(0);
  });

});