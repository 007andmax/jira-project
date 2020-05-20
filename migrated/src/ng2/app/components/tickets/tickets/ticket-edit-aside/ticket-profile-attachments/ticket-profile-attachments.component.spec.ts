import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketProfileAttachmentsComponent } from './ticket-profile-attachments.component';

describe('TicketProfileAttachmentsComponent', () => {
  let component: TicketProfileAttachmentsComponent;
  let fixture: ComponentFixture<TicketProfileAttachmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketProfileAttachmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketProfileAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
