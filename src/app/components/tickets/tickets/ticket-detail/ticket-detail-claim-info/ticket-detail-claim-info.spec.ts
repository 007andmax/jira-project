import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TicketDetailClaimInfoComponent } from './ticket-detail-claim-info.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('TicketDetailClaimInfoComponent unit test', () => {
  let component: TicketDetailClaimInfoComponent;
  let fixture: ComponentFixture<TicketDetailClaimInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        HttpClientModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        NoopAnimationsModule, TicketDetailClaimInfoComponent],
    providers: [TicketDetailClaimInfoComponent]
}).compileComponents();

  });

  it('check "getUserName"', () => {
    const fixture = TestBed.createComponent(TicketDetailClaimInfoComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getUserName({ firstName: "test", lastName: "123" })).toEqual("test 123");
    expect(com.getUserName(null)).toEqual("");
  });
});