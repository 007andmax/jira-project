import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HttpClientModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { DecimalNumberModule } from 'src/app/directives/decimal-number/decimal-number.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { ContractsAsideDiscountComponent } from './contracts-aside-discount.component';
import { ContractsUserDeviceService } from '../class/contracts-user-device-service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';



describe('ContractsAsideDiscountComponent unit test', () => {
  let component: ContractsAsideDiscountComponent;
  let fixture: ComponentFixture<ContractsAsideDiscountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        NgbModule,
        NumberModule,
        DecimalNumberModule,
        MatErrorModule,
        NoopAnimationsModule],
      declarations: [ContractsAsideDiscountComponent
      ],
    }).compileComponents();

  });

  it('check "service"', () => {
    const fixture = TestBed.createComponent(ContractsAsideDiscountComponent);
    const com = fixture.debugElement.componentInstance;
    com.service = new ContractsUserDeviceService(1, "test", 123, [], "134", "20", "FIXED")
    expect(com.service.discountAmount).toEqual("20");
    expect(com.service.discountType).toEqual("FIXED");
    expect(com.service.getDataForCreate()).toEqual({
      count: 1,
      rate: "123",
      taxIds: [],
      subscriptionService: "134",
      discountAmount: "20",
      discountType: "FIXED"
    });
  });
});