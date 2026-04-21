import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { TicketDetailProfileUpdatesServiceHeaderInfoComponent } from './ticket-detail-profile-updates-service-header-info.component';
import { TicketsListService } from '../../../../services/tickets-list.service';


describe('TicketDetailProfileUpdatesServiceHeaderInfoComponent unit test', () => {
  let component: TicketDetailProfileUpdatesServiceHeaderInfoComponent;
  let fixture: ComponentFixture<TicketDetailProfileUpdatesServiceHeaderInfoComponent>;

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
        NoopAnimationsModule, TicketDetailProfileUpdatesServiceHeaderInfoComponent],
    providers: [TicketsListService]
}).compileComponents();

  });

  it('check "getStyleNetAvatar"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileUpdatesServiceHeaderInfoComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getStyleNetAvatar(2)).toEqual("24px");
  });
  it('check "getStyleShareText"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileUpdatesServiceHeaderInfoComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getStyleShareText(2)).toEqual("44px");
  });
});