import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailChangeStatusComponent } from './ticket-detail-change-status.component';

describe('TicketDetailChangeStatusComponent', () => {
  let component: TicketDetailChangeStatusComponent;
  let fixture: ComponentFixture<TicketDetailChangeStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailChangeStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailChangeStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
