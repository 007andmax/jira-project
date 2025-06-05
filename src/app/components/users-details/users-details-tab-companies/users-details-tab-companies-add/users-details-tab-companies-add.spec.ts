import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { UsersDetailsTabCompaniesAddComponent } from './users-details-tab-companies-add.component';
import { UserJobTitle } from 'src/app/components/users/class/user-job-title';
import { UserRole } from 'src/app/components/users/class/user-role';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompanyDropDownModule } from 'src/app/components/shared/company-drop-down/company-drop-down.module';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { PreviewPhoneMaskModule } from 'src/app/components/shared/preview-phone-mask/preview-phone-mask.module';
import { FormsModule } from '@angular/forms';
import { UserTableDefaultSubscriptionModule } from 'src/app/components/users/users-table/user-table-default-subscription/user-table-default-subscription.module';

describe('UsersDetailsTabCompaniesAddComponent unit test', () => {
  let component: UsersDetailsTabCompaniesAddComponent;
  let fixture: ComponentFixture<UsersDetailsTabCompaniesAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        DisabledBtnModule,
        HttpClientModule,
        DropDownModule,
        NgbModule,
        FormsModule,
        PreviewPhoneMaskModule,
        PreloaderTicketModule,
        CompanyDropDownModule,
        UserTableDefaultSubscriptionModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [UsersDetailsTabCompaniesAddComponent
      ]
    }).compileComponents();

  });

  it('check "onSelectCompany"', () => {
    const fixture = TestBed.createComponent(UsersDetailsTabCompaniesAddComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectCompany({
      id: "123",
      name: "Test Company",
    });
    expect(com.customerCompaniesInfo.companyId).toEqual("123");
    expect(com.customerCompaniesInfo.clientCompanyName).toEqual("Test Company");
  });
  it('check "onSelectJobTitle"', () => {
    const fixture = TestBed.createComponent(UsersDetailsTabCompaniesAddComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectJobTitle(new UserJobTitle({
      id: "123",
      name: "Test Company",
    }));
    expect(com.customerCompaniesInfo.jobTitleDto.id).toEqual("123");
    expect(com.customerCompaniesInfo.jobTitleDto.name).toEqual("Test Company");
  });
  it('check "onChangeDefaultSubscriptions"', () => {
    const fixture = TestBed.createComponent(UsersDetailsTabCompaniesAddComponent);
    const com = fixture.debugElement.componentInstance;
    com.onChangeDefaultSubscriptions(null);
    expect(com.customerCompaniesInfo.defaultSubscriptions).toEqual(null);
  });
  it('check "onSelectPortalAccessStatus"', () => {
    const fixture = TestBed.createComponent(UsersDetailsTabCompaniesAddComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectPortalAccessStatus(new UserRole({
      id: "123",
      name: "Test Company",
    }));
    expect(com.customerCompaniesInfo.customerUserRole.id).toEqual("123");
    expect(com.customerCompaniesInfo.customerUserRole.name).toEqual("Test Company");
  });
});