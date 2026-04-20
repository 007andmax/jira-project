import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { UsersFilterModule } from '../users/users-header/users-filter/users-filter.module';
import { UsersHeaderModule } from '../users/users-header/users-header.module';
import { UsersTableModule } from '../users/users-table/users-table.module';
import { MarketingRoutingModule } from './marketing-routing.module';
import { MarketingComponent } from './marketing.component';

describe('MarketingComponent unit test', () => {
  let component: MarketingComponent;
  let fixture: ComponentFixture<MarketingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        MarketingRoutingModule,
        UsersHeaderModule,
        InfiniteScrollModule,
        UsersTableModule,
        FormsModule,
        UsersFilterModule,
        HttpClientModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        NoopAnimationsModule, MarketingComponent]
}).compileComponents();

  });
  it('check "setFilters"', () => {
    const fixture = TestBed.createComponent(MarketingComponent);
    const com = fixture.debugElement.componentInstance;
    com.setFilters({
      customSubscriptions: [],
      jobTitles: [],
      companies: [],
      tags: [],
      ticketSubscription: false,
      invoiceSubscription: false,
      ticketManagerSubscription: false
    });
    expect(com.filter.customSubscriptions).toEqual([]);
  });
  it('check "setIdDetailUser"', () => {
    const fixture = TestBed.createComponent(MarketingComponent);
    const com = fixture.debugElement.componentInstance;
    com.setIdDetailUser("test");
    expect(com.idDetailUser).toEqual("test");
  });
  it('check "setDefaultScoll"', () => {
    const fixture = TestBed.createComponent(MarketingComponent);
    const com = fixture.debugElement.componentInstance;
    com.setDefaultScoll();
    expect(com.filter.page).toEqual(0);
  });
});