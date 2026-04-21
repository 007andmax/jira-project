import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { UserDefaultSubscription } from '../../class/user-default-subscription';
import { UserTableSubscriptionComponent } from './user-table-subscription.component';


describe('UserTableSubscriptionComponent unit test', () => {
  let component: UserTableSubscriptionComponent;
  let fixture: ComponentFixture<UserTableSubscriptionComponent>;

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
        NoopAnimationsModule, UserTableSubscriptionComponent]
}).compileComponents();

  });

  it('check "defaultSubscriptions"', () => {
    const fixture = TestBed.createComponent(UserTableSubscriptionComponent);
    const com = fixture.debugElement.componentInstance;
    com.defaultSubscriptions = new UserDefaultSubscription();
    com.defaultSubscriptions.clearEnabledAll();
    expect(com.defaultSubscriptions.invoiceSubscription.enabled).toEqual(false);
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