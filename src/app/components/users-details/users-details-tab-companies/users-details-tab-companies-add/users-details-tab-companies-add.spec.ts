import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { UsersDetailsTabCompaniesAddComponent } from './users-details-tab-companies-add.component';
import { UserJobTitle } from 'src/app/components/users/class/user-job-title';
import { UserRole } from 'src/app/components/users/class/user-role';

describe('UsersDetailsTabCompaniesAddComponent unit test', () => {
  let component: UsersDetailsTabCompaniesAddComponent;
  let fixture: ComponentFixture<UsersDetailsTabCompaniesAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        HttpClientModule,
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
    com.setDefaultSubscriptions(null);
    expect(com.customerCompaniesInfo.defaultSubscriptions.invoiceSubscription.enabled).toEqual(true);
    expect(com.customerCompaniesInfo.defaultSubscriptions.ticketSubscription.enabled).toEqual(true);
  });
  it('check "onSelectPortalAccessStatus"', () => {
    const fixture = TestBed.createComponent(UsersDetailsTabCompaniesAddComponent);
    const com = fixture.debugElement.componentInstance;
    com.setUserRole(new UserRole({
      id: "123",
      name: "Test Company",
    }));
    expect(com.customerCompaniesInfo.customerUserRole.id).toEqual("123");
    expect(com.customerCompaniesInfo.customerUserRole.name).toEqual("Test Company");
  });
});