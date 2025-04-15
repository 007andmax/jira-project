import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { UserTableDefaultSubscriptionComponent } from './user-table-default-subscription.component';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { UserDefaultSubscription } from '../../class/user-default-subscription';


describe('UserTableDefaultSubscriptionComponent unit test', () => {
  let component: UserTableDefaultSubscriptionComponent;
  let fixture: ComponentFixture<UserTableDefaultSubscriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        NgbModule,
        DynamicTooltipModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [UserTableDefaultSubscriptionComponent
      ]
    }).compileComponents();

  });

  it('check "updateDefault"', () => {
    const fixture = TestBed.createComponent(UserTableDefaultSubscriptionComponent);
    const com = fixture.debugElement.componentInstance;
    com.defaultSubscriptions = new UserDefaultSubscription();
    com.updateDefault("invoiceSubscription");
    expect(com.defaultSubscriptions["invoiceSubscription"].enabled).toEqual(false);
  });
  it('check "isSeleted"', () => {
    const fixture = TestBed.createComponent(UserTableDefaultSubscriptionComponent);
    const com = fixture.debugElement.componentInstance;
    com.defaultSubscriptions = new UserDefaultSubscription();
    com.updateDefault("invoiceSubscription");
    expect(com.isSeleted("invoiceSubscription")).toEqual(false);
  });
});