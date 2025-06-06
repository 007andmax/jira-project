import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { GlNumbersDropDownModule } from 'src/app/components/inventory/gl-numbers-drop-down/gl-numbers-drop-down.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { TaxesModule } from 'src/app/components/shared/taxes/taxes.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { NonContractServices } from '../class/non-contract-service';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NonContractServicesContractsComponent } from './non-contract-services-contracts.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';



describe('NonContractServicesContractsComponent unit test', () => {
  let component: NonContractServicesContractsComponent;
  let fixture: ComponentFixture<NonContractServicesContractsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        NumberModule,
        TaxesModule,
        DropDownModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        GlNumbersDropDownModule,
        MatErrorModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [NonContractServicesContractsComponent
      ],
    }).compileComponents();

  });

  it('check "glDropDownItemName"', () => {
    const fixture = TestBed.createComponent(NonContractServicesContractsComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.glDropDownItemName({ glNumber: "test", description: "123" })).toEqual("test - 123");
  });
});