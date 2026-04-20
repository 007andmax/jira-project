import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';
import { ContractsAsideBlockTimeBillingUsersComponent } from './contracts-aside-block-time-billing-users.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';



describe('ContractsAsideBlockTimeBillingUsersComponent unit test', () => {
  let component: ContractsAsideBlockTimeBillingUsersComponent;
  let fixture: ComponentFixture<ContractsAsideBlockTimeBillingUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        MatChipModule,
        MatChipListModule,
        NoopAnimationsModule, ContractsAsideBlockTimeBillingUsersComponent]
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