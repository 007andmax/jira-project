import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketProfileUpdatesNoteComponent } from './ticket-profile-updates-note.component';

describe('TicketProfileUpdatesNoteComponent', () => {
  let component: TicketProfileUpdatesNoteComponent;
  let fixture: ComponentFixture<TicketProfileUpdatesNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketProfileUpdatesNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketProfileUpdatesNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
