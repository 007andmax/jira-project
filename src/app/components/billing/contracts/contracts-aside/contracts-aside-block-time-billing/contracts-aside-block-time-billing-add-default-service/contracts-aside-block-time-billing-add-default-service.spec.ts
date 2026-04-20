import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { ContractsAsideBlockTimeBillingAddDefaultServiceComponent } from './contracts-aside-block-time-billing-add-default-service.component';
import { DefaultServicesHourlyContract } from '../../class/default-service-hourly-contract';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';



describe('ContractsAsideBlockTimeBillingAddDefaultServiceComponent unit test', () => {
  let component: ContractsAsideBlockTimeBillingAddDefaultServiceComponent;
  let fixture: ComponentFixture<ContractsAsideBlockTimeBillingAddDefaultServiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        NgbModule,
        MatErrorModule,
        NoopAnimationsModule, ContractsAsideBlockTimeBillingAddDefaultServiceComponent],
}).compileComponents();

  });

  it('check "select function"', () => {
    const fixture = TestBed.createComponent(ContractsAsideBlockTimeBillingAddDefaultServiceComponent);
    const com = fixture.debugElement.componentInstance;
    com.select(new DefaultServicesHourlyContract({ versionedId: { id: "test" }, rate: 100 }));
    expect(com.isSelected("test")).toEqual(true);
  });
});