import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { UserJobTitle } from 'src/app/components/users/class/user-job-title';
import { UsersDetailsTabCompaniesItemComponent } from './users-details-tab-companies-item.component';
import { UserRole } from 'src/app/components/users/class/user-role';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { FormsModule } from '@angular/forms';
import { CompanyDropDownModule } from 'src/app/components/shared/company-drop-down/company-drop-down.module';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { UserTableDefaultSubscriptionModule } from 'src/app/components/users/users-table/user-table-default-subscription/user-table-default-subscription.module';
import { PreviewPhoneMaskModule } from 'src/app/components/shared/preview-phone-mask/preview-phone-mask.module';
import { UserCustomerCompaniesInfo } from 'src/app/components/users/class/user-customer-companies-info';

describe('UsersDetailsTabCompaniesItemComponent unit test', () => {
  let component: UsersDetailsTabCompaniesItemComponent;
  let fixture: ComponentFixture<UsersDetailsTabCompaniesItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        DropDownModule,
        PreloaderTicketModule,
        CompanyDropDownModule,
        UserTableDefaultSubscriptionModule,
        PreviewPhoneMaskModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [UsersDetailsTabCompaniesItemComponent
      ]
    }).compileComponents();

  });

  it('check "onSelectJobTitle"', () => {
    const fixture = TestBed.createComponent(UsersDetailsTabCompaniesItemComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectJobTitle(new UserJobTitle({
      id: "123",
      name: "Test Company",
    }));
    expect(com.customerCompaniesInfo.jobTitleDto.id).toEqual("123");
    expect(com.customerCompaniesInfo.jobTitleDto.name).toEqual("Test Company");
  });
  it('check "selectCustomerCompaniesInfo"', () => {
    const fixture = TestBed.createComponent(UsersDetailsTabCompaniesItemComponent);
    const com = fixture.debugElement.componentInstance;
    com.customerCompaniesInfo = new UserCustomerCompaniesInfo(null);
    com.selectCustomerCompaniesInfo({ target: { checked: true } });
    expect(com.customerCompaniesInfo.selected).toEqual(true);
  });
  it('check "changeEligibleForTicket"', () => {
    const fixture = TestBed.createComponent(UsersDetailsTabCompaniesItemComponent);
    const com = fixture.debugElement.componentInstance;
    com.customerCompaniesInfo = new UserCustomerCompaniesInfo(null);
    com.changeEligibleForTicket({ target: { checked: true } });
    expect(com.customerCompaniesInfo.eligibleForTicket).toEqual(true);
  });
  it('check "onSelectPortalAccessStatus"', () => {
    const fixture = TestBed.createComponent(UsersDetailsTabCompaniesItemComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectPortalAccessStatus(new UserRole({
      id: "123",
      name: "Test Company",
    }));
    expect(com.customerCompaniesInfo.customerUserRole.id).toEqual("123");
    expect(com.customerCompaniesInfo.customerUserRole.name).toEqual("Test Company");
  });
});