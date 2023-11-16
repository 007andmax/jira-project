import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketProfileFormUpdateNoteListComponent } from './ticket-profile-form-update-note-list.component';

describe('TicketProfileFormUpdateNoteListComponent', () => {
  let component: TicketProfileFormUpdateNoteListComponent;
  let fixture: ComponentFixture<TicketProfileFormUpdateNoteListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketProfileFormUpdateNoteListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketProfileFormUpdateNoteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
