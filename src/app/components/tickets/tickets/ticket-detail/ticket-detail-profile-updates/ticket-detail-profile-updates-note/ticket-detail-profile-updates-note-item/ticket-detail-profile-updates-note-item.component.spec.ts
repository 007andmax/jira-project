import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailProfileUpdatesNoteItemComponent } from './ticket-detail-profile-updates-note-item.component';

describe('TicketDetailProfileUpdatesNoteItemComponent', () => {
  let component: TicketDetailProfileUpdatesNoteItemComponent;
  let fixture: ComponentFixture<TicketDetailProfileUpdatesNoteItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailProfileUpdatesNoteItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailProfileUpdatesNoteItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
