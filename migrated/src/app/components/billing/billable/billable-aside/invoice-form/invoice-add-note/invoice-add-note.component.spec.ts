import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceAddNoteComponent } from './invoice-add-note.component';

describe('InvoiceAddNoteComponent', () => {
  let component: InvoiceAddNoteComponent;
  let fixture: ComponentFixture<InvoiceAddNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceAddNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceAddNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
