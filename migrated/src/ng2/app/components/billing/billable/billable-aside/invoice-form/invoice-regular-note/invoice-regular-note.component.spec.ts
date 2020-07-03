import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceRegularNoteComponent } from './invoice-regular-note.component';

describe('InvoiceRegularNoteComponent', () => {
  let component: InvoiceRegularNoteComponent;
  let fixture: ComponentFixture<InvoiceRegularNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceRegularNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceRegularNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
