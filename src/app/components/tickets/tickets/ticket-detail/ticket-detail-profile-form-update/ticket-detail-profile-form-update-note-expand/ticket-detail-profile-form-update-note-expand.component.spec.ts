import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailProfileFormUpdateNoteExpandComponent } from './ticket-detail-profile-form-update-note-expand.component';

describe('TicketDetailProfileFormUpdateNoteExpandComponent', () => {
  let component: TicketDetailProfileFormUpdateNoteExpandComponent;
  let fixture: ComponentFixture<TicketDetailProfileFormUpdateNoteExpandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailProfileFormUpdateNoteExpandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailProfileFormUpdateNoteExpandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
