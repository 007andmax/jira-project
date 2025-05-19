import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { UserJobTitle } from 'src/app/components/users/class/user-job-title';

import { UsersDetailsTabCompaniesComponent } from './users-details-tab-companies.component';
import { UsersDetailsTabCompaniesAddComponent } from './users-details-tab-companies-add/users-details-tab-companies-add.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClickOutsideModule } from 'ng4-click-outside';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { CompanyDropDownModule } from '../../shared/company-drop-down/company-drop-down.module';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { PreviewPhoneMaskModule } from '../../shared/preview-phone-mask/preview-phone-mask.module';
import { UserTableDefaultSubscriptionModule } from '../../users/users-table/user-table-default-subscription/user-table-default-subscription.module';
import { UsersDetailsTabCompaniesItemComponent } from './users-details-tab-companies-item/users-details-tab-companies-item.component';

describe('UsersDetailsTabCompaniesComponent unit test', () => {
  let component: UsersDetailsTabCompaniesComponent;
  let fixture: ComponentFixture<UsersDetailsTabCompaniesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        DropDownModule,
        CompanyDropDownModule,
        PreviewPhoneMaskModule,
        UserTableDefaultSubscriptionModule,
        ClickOutsideModule,
        NgbModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [UsersDetailsTabCompaniesComponent,
        UsersDetailsTabCompaniesAddComponent,
        UsersDetailsTabCompaniesItemComponent
      ]
    }).compileComponents();

  });

  it('check "onSelectJobTitle"', () => {
    const fixture = TestBed.createComponent(UsersDetailsTabCompaniesComponent);
    const com = fixture.debugElement.componentInstance;
    com.user.customerCompaniesInfo = [{ clientCompanyName: "1" }, { clientCompanyName: "3" }, { clientCompanyName: "1" }]
    com.sortCompanies();
    expect(com.customerCompaniesInfo).toEqual([{ clientCompanyName: "3" }, { clientCompanyName: "1" }, { clientCompanyName: "1" }]);
  });
  it('check "toggleAllUser"', () => {
    const fixture = TestBed.createComponent(UsersDetailsTabCompaniesComponent);
    const com = fixture.debugElement.componentInstance;
    com.user.customerCompaniesInfo = [{ selected: false }, { selected: false }, { selected: false }]
    com.toggleAllUser({ target: { checked: true } });
    expect(com.customerCompaniesInfo).toEqual([{ clientCompanyName: "3" }, { clientCompanyName: "1" }, { clientCompanyName: "1" }]);
  });
});