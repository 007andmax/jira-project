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
import { HttpClientModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { NonContractServicesEditComponent } from './non-contract-services-edit.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';



describe('NonContractServicesEditComponent unit test', () => {
  let component: NonContractServicesEditComponent;
  let fixture: ComponentFixture<NonContractServicesEditComponent>;

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
      declarations: [NonContractServicesEditComponent
      ],
    }).compileComponents();

  });

  it('check "onChangeName"', () => {
    const fixture = TestBed.createComponent(NonContractServicesEditComponent);
    const com = fixture.debugElement.componentInstance;
    com.service = new NonContractServices(
      {
        name: "1234"
      }
    )
    com.onChangeName();
    expect(com.validate.name).toEqual(true);
  });
  it('check "onChangeRate"', () => {
    const fixture = TestBed.createComponent(NonContractServicesEditComponent);
    const com = fixture.debugElement.componentInstance;
    com.service = new NonContractServices(
      {
        name: "1234"
      }
    )
    com.onChangeRate({ target: { value: "100" } })
    expect(com.validate.rate).toEqual(true);
  });
  it('check "glDropDownItemName"', () => {
    const fixture = TestBed.createComponent(NonContractServicesEditComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.glDropDownItemName({ glNumber: "test", description: "123" })).toEqual("test - 123");
  });
  it('check "service"', () => {
    const fixture = TestBed.createComponent(NonContractServicesEditComponent);
    const com = fixture.debugElement.componentInstance;
    com.service = new NonContractServices(
      {
        billable: true,
        glNumber: {
          description: "description",
          glNumber: "glNumber",
          id: "123"
        },
        isDefault: true,
        name: "name",
        rate: 100,
        taxes: [{ id: 1 }, { id: 2 }, { id: 3 }]
      }
    )
    expect(com.service.getDataForAddDefault()).toEqual({
      basedOnDefault: true,
      billable: true,
      isDefault: true,
      name: "name",
      rate: 100,
      taxIds: [1, 2, 3]
    });
    com.service.onInitForAdd();
    expect(com.service.getDataForAdd()).toEqual({
      billable: true,
      glNumber: {
        description: "description",
        glNumber: "glNumber",
        id: "123"
      },
      isDefault: true,
      name: "",
      rate: 0,
      taxIds: []
    });
    com.service.setVersionedId({ id: 1 });
    expect(com.service.getDataForUpdate()).toEqual({
      id: 1,
      name: "",
      rate: 0,
      canUseInTicket: undefined,
      billable: true,
      taxIds: [],
      glNumber: {
        description: "description",
        glNumber: "glNumber",
        id: "123"
      },
      isDefault: true,
    });
  });
});