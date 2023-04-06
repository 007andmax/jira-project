import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailClaimInfoComponent } from './ticket-detail-claim-info.component';

describe('TicketDetailClaimInfoComponent', () => {
  let component: TicketDetailClaimInfoComponent;
  let fixture: ComponentFixture<TicketDetailClaimInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailClaimInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailClaimInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
