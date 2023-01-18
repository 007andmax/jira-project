import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailProfileUpdatesNoteEditComponent } from './ticket-detail-profile-updates-note-edit.component';

describe('TicketDetailProfileUpdatesNoteEditComponent', () => {
  let component: TicketDetailProfileUpdatesNoteEditComponent;
  let fixture: ComponentFixture<TicketDetailProfileUpdatesNoteEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailProfileUpdatesNoteEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailProfileUpdatesNoteEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
