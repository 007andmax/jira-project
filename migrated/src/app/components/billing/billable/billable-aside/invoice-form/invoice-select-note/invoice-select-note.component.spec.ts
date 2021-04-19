import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceSelectNoteComponent } from './invoice-select-note.component';

describe('InvoiceSelectNoteComponent', () => {
  let component: InvoiceSelectNoteComponent;
  let fixture: ComponentFixture<InvoiceSelectNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceSelectNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceSelectNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
