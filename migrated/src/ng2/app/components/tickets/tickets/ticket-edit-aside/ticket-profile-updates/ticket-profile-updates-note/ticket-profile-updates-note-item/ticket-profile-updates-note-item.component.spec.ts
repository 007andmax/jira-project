import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketProfileUpdatesNoteItemComponent } from './ticket-profile-updates-note-item.component';

describe('TicketProfileUpdatesNoteItemComponent', () => {
  let component: TicketProfileUpdatesNoteItemComponent;
  let fixture: ComponentFixture<TicketProfileUpdatesNoteItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketProfileUpdatesNoteItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketProfileUpdatesNoteItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
