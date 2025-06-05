import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TicketProfileFormUpdateNoteListComponent } from './ticket-profile-form-update-note-list.component';
import { NoteTemplate } from 'src/app/components/setting/ticket-settings-page/canned-responses/class/note-template';
import { HttpClientModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';

describe('TicketProfileFormUpdateNoteListComponent unit test', () => {
  let component: TicketProfileFormUpdateNoteListComponent;
  let fixture: ComponentFixture<TicketProfileFormUpdateNoteListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        NgbModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [TicketProfileFormUpdateNoteListComponent
      ]
    }).compileComponents();

  });

  it('check "noteTemplate"', () => {
    const fixture = TestBed.createComponent(TicketProfileFormUpdateNoteListComponent);
    const com = fixture.debugElement.componentInstance;
    com.noteTemplate = [new NoteTemplate({
      title: "test",
      note: "123",
      active: true
    })];
    expect(com.noteTemplate[0].getDataForRequest()).toEqual({
      title: "test",
      note: "123",
      active: true
    });
  });

});