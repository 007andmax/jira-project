import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { NgxMaskModule } from 'ngx-mask';
import { PhoneModule } from 'src/app/pipe/phone/phone.module';
import { PreparePhoneModule } from 'src/app/pipe/prepare-phone/prepare-phone.module';
import { PreviewPhoneMaskModule } from '../../shared/preview-phone-mask/preview-phone-mask.module';
import { UserTableCustomSubscriptionModule } from './user-table-custom-subscription/user-table-custom-subscription.module';
import { UserTableDefaultSubscriptionModule } from './user-table-default-subscription/user-table-default-subscription.module';
import { UsersTableComponent } from './users-table.component';
import { User } from '../class/user';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
declare var jasmine;
const mockRouter = {
  navigate: jasmine.createSpy('navigate'),
  routerState: {
    root: {}
  },
  events: of(),
};

describe('UsersTableComponent unit test', () => {
  let component: UsersTableComponent;
  let fixture: ComponentFixture<UsersTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        NgbModule,
        PhoneModule,
        NgxMaskModule.forRoot(),
        PreparePhoneModule,
        DynamicTooltipModule,
        PreviewPhoneMaskModule,
        UserTableDefaultSubscriptionModule,
        UserTableCustomSubscriptionModule,
        HttpClientModule,
        RouterTestingModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [UsersTableComponent
      ],
      providers: [{ provide: Router, useValue: mockRouter }],
    }).compileComponents();

  });

  it('check "getUserName"', () => {
    const fixture = TestBed.createComponent(UsersTableComponent);
    const com = fixture.debugElement.componentInstance;
    com.user = new User();
    com.user.firstName = 'John';
    com.user.lastName = 'Doe';
    expect(com.getUserName()).toEqual('John Doe');
  });
  it('check "user"', () => {
    const fixture = TestBed.createComponent(UsersTableComponent);
    const com = fixture.debugElement.componentInstance;
    com.user = new User();
    com.user.userEmailNotifications = { newDevice: true };
    expect(com.user.getVisibleListUserEmailForTechusers()).toEqual(['New Device']);
    expect(com.user.getTooltipsListUserEmailForTechusers()).toEqual(['When my account is logged in from a new device']);
  });
});