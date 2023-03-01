import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailAttachmentsComponent } from './ticket-detail-attachments.component';

describe('TicketDetailAttachmentsComponent', () => {
  let component: TicketDetailAttachmentsComponent;
  let fixture: ComponentFixture<TicketDetailAttachmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailAttachmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
