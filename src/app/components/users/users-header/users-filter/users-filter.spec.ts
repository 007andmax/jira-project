import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';
import { MatFormFieldModule } from 'src/app/components/shared/mat-form-field/mat-form-field.module';
import { TicketsFilterCompaniesDropDownModule } from 'src/app/components/tickets/tickets/tickets-header/tickets-filter/tickets-filter-companies-drop-down/tickets-filter-companies-drop-down.module';
import { UserDefaultSubscriptionModule } from '../../users-aside/user-default-subscription/user-default-subscription.module';
import { UsersFilterSubscriptionsComponent } from './users-filter-subscriptions/users-filter-subscriptions.component';
import { UsersFilterComponent } from './users-filter.component';

describe('UsersFilterComponent unit test', () => {
  let component: UsersFilterComponent;
  let fixture: ComponentFixture<UsersFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        TicketsFilterCompaniesDropDownModule,
        UserDefaultSubscriptionModule,
        FormsModule,
        NgbModule,
        DynamicTooltipModule,
        MatFormFieldModule,
        InfiniteScrollModule,
        MatChipModule,
        MatChipListModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [UsersFilterComponent
      ]
    }).compileComponents();

  });

  it('check "onChangeDefaultSubscriptions"', () => {
    const fixture = TestBed.createComponent(UsersFilterComponent);
    const com = fixture.debugElement.componentInstance;
    com.onChangeDefaultSubscriptions({ invoiceSubscription: { enabled: true }, ticketSubscription: { enabled: true }, ticketManagerSubscription: { enabled: false } });
    expect(com.filter.invoiceSubscription).toEqual(true);
    expect(com.filter.ticketSubscription).toEqual(true);
    expect(com.filter.ticketManagerSubscription).toEqual(false);
  });
  it('check "onChangeTags"', () => {
    const fixture = TestBed.createComponent(UsersFilterComponent);
    const com = fixture.debugElement.componentInstance;
    com.onChangeTags([{ id: 1 }, { id: 2 }, { id: 3 }]);
    expect(com.filter.tags).toEqual([1, 2, 3]);
  });
  it('check "onChangeHasAccess"', () => {
    const fixture = TestBed.createComponent(UsersFilterComponent);
    const com = fixture.debugElement.componentInstance;
    com.onChangeHasAccess({ target: { checked: true } });
    expect(com.filter.hasAccess).toEqual(true);
  });
  it('check "onChangeCustomSubscription"', () => {
    const fixture = TestBed.createComponent(UsersFilterComponent);
    const com = fixture.debugElement.componentInstance;
    com.onChangeCustomSubscription(["1", "2", "3"]);
    expect(com.filter.customSubscriptions).toEqual(["1", "2", "3"]);
  });
  it('check "onSelectCompany"', () => {
    const fixture = TestBed.createComponent(UsersFilterComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectCompany([{ id: 1 }, { id: 2 }, { id: 3 }]);
    expect(com.filter.companies).toEqual(["1", "2", "3"]);
  });
  it('check "onSelectCustomSubscription"', () => {
    const fixture = TestBed.createComponent(UsersFilterComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectCustomSubscription([{ id: 1 }, { id: 2 }, { id: 3 }]);
    expect(com.filter.customSubscriptions).toEqual(["1", "2", "3"]);
  });
});