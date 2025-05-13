import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';
import { MatFormFieldModule } from 'src/app/components/shared/mat-form-field/mat-form-field.module';
import { TicketsFilterCompaniesDropDownModule } from 'src/app/components/tickets/tickets/tickets-header/tickets-filter/tickets-filter-companies-drop-down/tickets-filter-companies-drop-down.module';
import { CompanyTagsModule } from '../../companies/company-tags/company-tags.module';
import { CompanyDropDownModule } from '../../shared/company-drop-down/company-drop-down.module';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { UsersFilterComponent } from './users-filter/users-filter.component';
import { UsersHeaderComponent } from './users-header.component';
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

  it('check "clearSearch"', () => {
    const fixture = TestBed.createComponent(UsersHeaderComponent);
    const com = fixture.debugElement.componentInstance;
    com.searchText = 'test';
    com.clearSearch(false);
    expect(com.searchText).toEqual("");
  });

});