import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { UserTableCustomSubscriptionModule } from '../../users/users-table/user-table-custom-subscription/user-table-custom-subscription.module';
import { UsersDetailsTabTicketsItemComponent } from './users-details-tab-tickets-item/users-details-tab-tickets-item.component';
import { UsersDetailsTabTicketsComponent } from './users-details-tab-tickets.component';

describe('UsersDetailsTabTicketsComponent unit test', () => {
  let component: UsersDetailsTabTicketsComponent;
  let fixture: ComponentFixture<UsersDetailsTabTicketsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        FormsModule,
        InfiniteScrollModule,
        UserTableCustomSubscriptionModule,
        DropDownModule,
        HttpClientModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        NoopAnimationsModule, UsersDetailsTabTicketsComponent,
        UsersDetailsTabTicketsItemComponent]
}).compileComponents();

  });

  it('check "setDefaultScoll"', () => {
    const fixture = TestBed.createComponent(UsersDetailsTabTicketsComponent);
    const com = fixture.debugElement.componentInstance;
    com.page_number = 1;
    com.setDefaultScoll();
    expect(com.page_number).toEqual(0);
    expect(com.tickets.length).toEqual(0);
    expect(com.showPreloader).toEqual(true);
  });

});