import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryItem } from 'src/app/components/inventory/class/inventory-item';
import { ContractsOtherProduct } from '../../class/contracts-other-product';
import { DatePickerModule } from 'src/app/components/shared/date-picker/date-picker.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { TicketProfileUpdatesServiceDurationModule } from 'src/app/components/tickets/tickets/ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-service-duration/ticket-profile-updates-service-duration.module';
import { ContractsAsideOtherServiceComponent } from './contracts-aside-other-service.component';
import { ContractsOtherService } from '../../class/contracts-other-service';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';



describe('ContractsAsideOtherServiceComponent unit test', () => {
  let component: ContractsAsideOtherServiceComponent;
  let fixture: ComponentFixture<ContractsAsideOtherServiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        DropDownModule,
        FormsModule,
        TicketProfileUpdatesServiceDurationModule,
        DatePickerModule,
        MatErrorModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [ContractsAsideOtherServiceComponent
      ],
    }).compileComponents();

  });

  it('check "service"', () => {
    const fixture = TestBed.createComponent(ContractsAsideOtherServiceComponent);
    const com = fixture.debugElement.componentInstance;
    com.service = new ContractsOtherService(new Date().getTime(), "description", 150, "123", "test", 10);
    com.onChangeDurationService(60);
    expect(com.getHours()).toEqual(60);
    expect(com.getMinutes()).toEqual(0);
  });
});