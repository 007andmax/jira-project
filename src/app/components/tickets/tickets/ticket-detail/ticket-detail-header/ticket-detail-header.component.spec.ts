import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailHeaderComponent } from './ticket-detail-header.component';

describe('TicketDetailHeaderComponent', () => {
  let component: TicketDetailHeaderComponent;
  let fixture: ComponentFixture<TicketDetailHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
