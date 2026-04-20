import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { FormsModule } from '@angular/forms';
import { ContractsAsideBlockTimeBillingAddSubscriptionServicesComponent } from './contracts-aside-block-time-billing-add-subscription-services.component';
import { SubscriptionServices } from 'src/app/components/billing/subscription-services/class/subscription-services';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';



describe('ContractsAsideBlockTimeBillingAddSubscriptionServicesComponent unit test', () => {
  let component: ContractsAsideBlockTimeBillingAddSubscriptionServicesComponent;
  let fixture: ComponentFixture<ContractsAsideBlockTimeBillingAddSubscriptionServicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        FormsModule,
        NgbModule,
        MatErrorModule,
        NoopAnimationsModule, ContractsAsideBlockTimeBillingAddSubscriptionServicesComponent],
}).compileComponents();

  });

  it('check "select function"', () => {
    const fixture = TestBed.createComponent(ContractsAsideBlockTimeBillingAddSubscriptionServicesComponent);
    const com = fixture.debugElement.componentInstance;
    com.select(new SubscriptionServices({ id: "test" }));
    expect(com.isSelected("test")).toEqual(true);
  });
});