import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { FormsModule } from '@angular/forms';
import { ContractsAsideBlockTimeBillingCustomerServiceComponent } from './contracts-aside-block-time-billing-customer-service.component';
import { ContractsBlockTimeService } from '../../class/contracts-block-time-service';



describe('ContractsAsideBlockTimeBillingCustomerServiceComponent unit test', () => {
  let component: ContractsAsideBlockTimeBillingCustomerServiceComponent;
  let fixture: ComponentFixture<ContractsAsideBlockTimeBillingCustomerServiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        MatErrorModule],
      declarations: [ContractsAsideBlockTimeBillingCustomerServiceComponent
      ],
    }).compileComponents();

  });

  it('check "service"', () => {
    const fixture = TestBed.createComponent(ContractsAsideBlockTimeBillingCustomerServiceComponent);
    const com = fixture.debugElement.componentInstance;
    com.service = new ContractsBlockTimeService("test", 100, "123");
    com.onChange()
    expect(com.service.validate).toEqual(true);
    expect(com.service.validateDuplicated).toEqual(true);
  });
});