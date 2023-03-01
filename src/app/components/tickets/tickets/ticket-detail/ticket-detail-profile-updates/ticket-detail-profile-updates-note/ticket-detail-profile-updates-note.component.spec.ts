import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailProfileUpdatesNoteComponent } from './ticket-detail-profile-updates-note.component';

describe('TicketDetailProfileUpdatesNoteComponent', () => {
  let component: TicketDetailProfileUpdatesNoteComponent;
  let fixture: ComponentFixture<TicketDetailProfileUpdatesNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailProfileUpdatesNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailProfileUpdatesNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
