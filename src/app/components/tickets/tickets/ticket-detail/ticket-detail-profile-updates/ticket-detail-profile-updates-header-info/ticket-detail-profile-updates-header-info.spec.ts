import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { TicketDetailProfileUpdatesHeaderInfoComponent } from './ticket-detail-profile-updates-header-info.component';
import { TicketsListService } from '../../../services/tickets-list.service';

describe('TicketDetailProfileUpdatesHeaderInfoComponent unit test', () => {
  let component: TicketDetailProfileUpdatesHeaderInfoComponent;
  let fixture: ComponentFixture<TicketDetailProfileUpdatesHeaderInfoComponent>;

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
        NgbModule,
        NoopAnimationsModule
    ],
    declarations: [TicketDetailProfileUpdatesHeaderInfoComponent],
    providers: [UntypedFormBuilder, TicketsListService]
}).compileComponents();

  });

  it('check "getStyleNetAvatar"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileUpdatesHeaderInfoComponent);
    const com = fixture.debugElement.componentInstance;
    com.getStyleNetAvatar(1);
    expect(com.getStyleNetAvatar(1)).toEqual("12px")
  });
  it('check "getStyleShareText"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileUpdatesHeaderInfoComponent);
    const com = fixture.debugElement.componentInstance;
    com.getStyleShareText(1);
    expect(com.getStyleShareText(1)).toEqual("32px")
  });
});