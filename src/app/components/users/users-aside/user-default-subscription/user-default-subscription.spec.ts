import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserDefaultSubscriptionComponent } from './user-default-subscription.component';
import { UserDefaultSubscription } from '../../class/user-default-subscription';

describe('UserDefaultSubscriptionComponent unit test', () => {
  let component: UserDefaultSubscriptionComponent;
  let fixture: ComponentFixture<UserDefaultSubscriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModuleе({
      imports: [CommonModule,
        NgbModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [UserDefaultSubscriptionComponent
      ]
    }).compileComponents();

  });

  it('check "showPlaceholder"', () => {
    const fixture = TestBed.createComponent(UserDefaultSubscriptionComponent);
    const com = fixture.debugElement.componentInstance;
    com.defaultSubscriptions = new UserDefaultSubscription(null);
    expect(com.showPlaceholder()).toEqual(true);
  });
  it('check "isSeleted"', () => {
    const fixture = TestBed.createComponent(UserDefaultSubscriptionComponent);
    const com = fixture.debugElement.componentInstance;
    com.defaultSubscriptions = new UserDefaultSubscription(null);
    expect(com.isSeleted("invoiceSubscription")).toEqual(true);
  });
  it('check "defaultSubscriptions"', () => {
    const fixture = TestBed.createComponent(UserDefaultSubscriptionComponent);
    const com = fixture.debugElement.componentInstance;
    com.defaultSubscriptions = new UserDefaultSubscription(null);
    com.defaultSubscriptions.clearEnabledAll();
    expect(com.defaultSubscriptions.getDataForUpdate()).toEqual({
      "invoiceSubscription": {
        "enabled": false
      },
      "ticketSubscription": {
        "enabled": false
      },
      "ticketManagerSubscription": {
        "enabled": false
      }
    });
  });
});
