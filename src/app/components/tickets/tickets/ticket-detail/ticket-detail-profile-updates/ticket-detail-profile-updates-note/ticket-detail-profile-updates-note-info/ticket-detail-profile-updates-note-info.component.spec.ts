import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailProfileUpdatesNoteInfoComponent } from './ticket-detail-profile-updates-note-info.component';

describe('TicketDetailProfileUpdatesNoteInfoComponent', () => {
  let component: TicketDetailProfileUpdatesNoteInfoComponent;
  let fixture: ComponentFixture<TicketDetailProfileUpdatesNoteInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailProfileUpdatesNoteInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailProfileUpdatesNoteInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
