import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { UsersFilterModule } from './users-header/users-filter/users-filter.module';
import { UsersHeaderModule } from './users-header/users-header.module';
import { UsersRoutingModule } from './users-routing.module';
import { UsersTableModule } from './users-table/users-table.module';
import { UsersComponent } from './users.component';

describe('UsersComponent unit test', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        UsersHeaderModule,
        InfiniteScrollModule,
        UsersTableModule,
        UsersRoutingModule,
        UsersFilterModule,
        FormsModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [UsersComponent
      ]
    }).compileComponents();

  });

  it('check "filter"', () => {
    const fixture = TestBed.createComponent(UsersComponent);
    const com = fixture.debugElement.componentInstance;
    com.filter.setIsArchive(true);
    com.filter.setHasAccess(true);
    com.filter.setSortBy("PORTAL_STATUS");
    expect(com.filter.isArchive).toEqual(true);
    expect(com.filter.hasAccess).toEqual(true);
    expect(com.filter.filterTop[2].filter).toEqual("ASC");
    com.filter.clearFilter();
    expect(com.filter.filterTop[2].filter).toEqual("");
    com.filter.setUserName("test");
    expect(com.filter.username).toEqual("test");
    com.filter.resetDefaultSubscriptions();
    expect(com.filter.ticketSubscription).toEqual(false);
    expect(com.filter.ticketManagerSubscription).toEqual(false);
    expect(com.filter.invoiceSubscription).toEqual(false);
    com.filter.setTags(["1", "2"]);
    expect(com.filter.tags.length).toEqual(2);
    com.filter.setCustomSubscriptions(["1", "2"]);
    expect(com.filter.customSubscriptions.length).toEqual(2);
    com.filter.setClientType("test");
    expect(com.filter.clientType).toEqual("test");
    com.filter.setJobTitles(["1", "2"]);
    expect(com.filter.jobTitles.length).toEqual(2);
    com.filter.setCompanies(["1", "2"]);
    expect(com.filter.companies.length).toEqual(2);
    expect(com.filter.isExistFilters()).toEqual(true);
  });

});