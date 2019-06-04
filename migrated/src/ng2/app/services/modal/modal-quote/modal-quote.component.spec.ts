import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalQuoteComponent } from './modal-quote.component';

describe('ModalQuoteComponent', () => {
  let component: ModalQuoteComponent;
  let fixture: ComponentFixture<ModalQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalQuoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
