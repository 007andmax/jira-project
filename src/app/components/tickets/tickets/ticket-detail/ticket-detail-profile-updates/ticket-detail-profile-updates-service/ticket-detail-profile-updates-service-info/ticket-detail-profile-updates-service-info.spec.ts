import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { TicketDetailProfileUpdatesServiceInfoComponent } from './ticket-detail-profile-updates-service-info.component';
import { TechUsersModule } from 'src/app/components/shared/tech-users/tech-users.module';
import { DatePickerModule } from 'src/app/components/shared/date-picker/date-picker.module';
import { TicketsListService } from '../../../../services/tickets-list.service';


describe('TicketDetailProfileUpdatesServiceInfoComponent unit test', () => {
  let component: TicketDetailProfileUpdatesServiceInfoComponent;
  let fixture: ComponentFixture<TicketDetailProfileUpdatesServiceInfoComponent>;

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
        DatePickerModule,
        NoopAnimationsModule, TicketDetailProfileUpdatesServiceInfoComponent],
    providers: [TicketsListService]
}).compileComponents();

  });

  it('check "getDuration"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileUpdatesServiceInfoComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getDuration(2)).toEqual("02 : 00");
  });

});