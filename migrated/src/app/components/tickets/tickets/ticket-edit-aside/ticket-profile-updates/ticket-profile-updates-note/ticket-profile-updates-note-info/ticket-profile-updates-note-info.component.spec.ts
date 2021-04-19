import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketProfileUpdatesNoteInfoComponent } from './ticket-profile-updates-note-info.component';

describe('TicketProfileUpdatesNoteInfoComponent', () => {
  let component: TicketProfileUpdatesNoteInfoComponent;
  let fixture: ComponentFixture<TicketProfileUpdatesNoteInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketProfileUpdatesNoteInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketProfileUpdatesNoteInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
