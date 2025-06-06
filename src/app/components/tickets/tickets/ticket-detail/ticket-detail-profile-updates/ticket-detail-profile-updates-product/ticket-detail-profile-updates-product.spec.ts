import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { TicketDetailProfileUpdatesProductComponent } from './ticket-detail-profile-updates-product.component';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { TicketDetailProfileUpdatesProductHeaderInfoComponent } from './ticket-detail-profile-updates-product-header-info/ticket-detail-profile-updates-product-header-info.component';
import { TicketDetailProfileUpdatesProductItemComponent } from './ticket-detail-profile-updates-product-item/ticket-detail-profile-updates-product-item.component';
import { TicketDetailProfileUpdatesProductInfoComponent } from './ticket-detail-profile-updates-product-info/ticket-detail-profile-updates-product-info.component';
import { TicketDetailProfileUpdatesProductEditComponent } from './ticket-detail-profile-updates-product-edit/ticket-detail-profile-updates-product-edit.component';
import { TechUsersModule } from 'src/app/components/shared/tech-users/tech-users.module';
import { DatePickerModule } from 'src/app/components/shared/date-picker/date-picker.module';
import { ProductListModule } from 'src/app/components/shared/product-list/product-list.module';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { MatFormFieldModule } from 'src/app/components/shared/mat-form-field/mat-form-field.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { TicketsListService } from '../../../services/tickets-list.service';


describe('TicketDetailProfileUpdatesProductComponent unit test', () => {
  let component: TicketDetailProfileUpdatesProductComponent;
  let fixture: ComponentFixture<TicketDetailProfileUpdatesProductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        CommonModule,
        DynamicTooltipModule,
        NgbModule,
        TechUsersModule,
        DatePickerModule,
        ProductListModule,
        NumberModule,
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule,
        MatErrorModule,
        NoopAnimationsModule
      ],
      declarations: [TicketDetailProfileUpdatesProductComponent,
        TicketDetailProfileUpdatesProductHeaderInfoComponent,
        TicketDetailProfileUpdatesProductItemComponent,
        TicketDetailProfileUpdatesProductInfoComponent,
        TicketDetailProfileUpdatesProductEditComponent
      ],
      providers: [TicketsListService]
    }).compileComponents();

  });

  it('check "getTotal"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileUpdatesProductComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getTotal(20, 1)).toEqual(20);
  });
});