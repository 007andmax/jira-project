import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { TicketDetailProfileUpdatesProductEditComponent } from '../ticket-detail-profile-updates-product-edit/ticket-detail-profile-updates-product-edit.component';
import { TicketDetailProfileUpdatesProductInfoComponent } from './ticket-detail-profile-updates-product-info.component';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { TechUsersModule } from 'src/app/components/shared/tech-users/tech-users.module';
import { DatePickerModule } from 'src/app/components/shared/date-picker/date-picker.module';
import { TicketsListService } from '../../../../services/tickets-list.service';
import { TicketProfileProduct } from '../../../../class/ticket-profile-product';


describe('TicketDetailProfileUpdatesProductInfoComponent unit test', () => {
  let component: TicketDetailProfileUpdatesProductInfoComponent;
  let fixture: ComponentFixture<TicketDetailProfileUpdatesProductInfoComponent>;

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
        TechUsersModule,
        NgbModule,
        DatePickerModule,
        NoopAnimationsModule
    ],
    declarations: [TicketDetailProfileUpdatesProductInfoComponent],
    providers: [TicketsListService]
}).compileComponents();

  });

  it('check "getTotal"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileUpdatesProductInfoComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getTotal(20, 1)).toEqual("20.00");
  });
  it('check "getPrice"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileUpdatesProductInfoComponent);
    const com = fixture.debugElement.componentInstance;
    com.product = new TicketProfileProduct();
    com.product.price = 300;
    expect(com.getPrice()).toEqual("300.00");
  });
});