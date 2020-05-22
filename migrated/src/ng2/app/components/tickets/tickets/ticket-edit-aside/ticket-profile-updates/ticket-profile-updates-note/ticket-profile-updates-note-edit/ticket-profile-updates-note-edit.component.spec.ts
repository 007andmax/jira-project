import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketProfileUpdatesNoteEditComponent } from './ticket-profile-updates-note-edit.component';

describe('TicketProfileUpdatesNoteEditComponent', () => {
  let component: TicketProfileUpdatesNoteEditComponent;
  let fixture: ComponentFixture<TicketProfileUpdatesNoteEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketProfileUpdatesNoteEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketProfileUpdatesNoteEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
