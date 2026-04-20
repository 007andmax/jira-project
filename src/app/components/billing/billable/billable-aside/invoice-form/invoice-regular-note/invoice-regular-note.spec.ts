import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NumberModule } from 'src/app/directives/number/number.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { InvoiceFormTicketInfoComponent } from '../invoice-form-ticket-info/invoice-form-ticket-info.component';
import { InvoiceRegularNoteComponent } from './invoice-regular-note.component';
import { InvoiceNote } from '../../../class/invoice-note';

describe('InvoiceRegularNoteComponent unit test', () => {
  let component: InvoiceRegularNoteComponent;
  let fixture: ComponentFixture<InvoiceRegularNoteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        NgbModule,
        FormsModule,
        MatErrorModule,
        HttpClientModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        NoopAnimationsModule, InvoiceRegularNoteComponent]
}).compileComponents();

  });

  it('check "onCheckUpdateTitleNote"', () => {
    const fixture = TestBed.createComponent(InvoiceRegularNoteComponent);
    const com = fixture.debugElement.componentInstance;
    com.selectedNote = new InvoiceNote({ id: "123", content: "test", title: "title" });
    com.onCheckUpdateTitleNote("test 123")
    expect(com.selectedNote.title).toEqual("test 123");
  });
  it('check "onSetRegularNote"', () => {
    const fixture = TestBed.createComponent(InvoiceRegularNoteComponent);
    const com = fixture.debugElement.componentInstance;
    com.selectedNote = new InvoiceNote({ id: "123", content: "test", title: "title" });
    com.onSetRegularNote("test 123")
    expect(com.selectedNote.title).toEqual("test 123");
  });
  it('check "onCheckUpdateDescriptionNote"', () => {
    const fixture = TestBed.createComponent(InvoiceRegularNoteComponent);
    const com = fixture.debugElement.componentInstance;
    com.selectedNote = new InvoiceNote({ id: "123", content: "test", title: "title" });
    com.onCheckUpdateDescriptionNote()
    expect(com.changeRegularNote).toEqual(true);
  });
});