import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailProfileFormUpdateNoteComponent } from './ticket-detail-profile-form-update-note.component';

describe('TicketDetailProfileFormUpdateNoteComponent', () => {
  let component: TicketDetailProfileFormUpdateNoteComponent;
  let fixture: ComponentFixture<TicketDetailProfileFormUpdateNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailProfileFormUpdateNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailProfileFormUpdateNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
