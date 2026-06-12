import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';
import { ContractsAsideBlockTimeBillingUsersComponent } from './contracts-aside-block-time-billing-users.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TicketsTableItemRequestedByModule } from 'src/app/components/tickets/tickets/tickets-table/tickets-table-item/tickets-table-item-requested-by/tickets-table-item-requested-by.module';
import { UserLogoPopoverModule } from 'src/app/directives/user-logo-popover/user-logo-popover.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';
import { ToastrModule } from 'ngx-toastr';



describe('ContractsAsideBlockTimeBillingUsersComponent unit test', () => {
  let component: ContractsAsideBlockTimeBillingUsersComponent;
  let fixture: ComponentFixture<ContractsAsideBlockTimeBillingUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        MatChipModule,
        MatChipListModule,
        NoopAnimationsModule,
        TicketsTableItemRequestedByModule,
        UserLogoPopoverModule,
        NgbModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        HttpClientModule, ContractsAsideBlockTimeBillingUsersComponent],
    providers: [TicketsListService]
}).compileComponents();

  });

  it('check "selectedUsers"', () => {
    const fixture = TestBed.createComponent(ContractsAsideBlockTimeBillingUsersComponent);
    const com = fixture.debugElement.componentInstance;
    com.selectedUsers = [1, 2, 3, 4, 5];
    com.remove(1)
    expect(com.selectedUsers).toEqual([1, 3, 4, 5]);
  });
});