import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteAsideEditBodyComponent } from './quote-aside-edit-body.component';

describe('QuoteAsideEditBodyComponent', () => {
  let component: QuoteAsideEditBodyComponent;
  let fixture: ComponentFixture<QuoteAsideEditBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteAsideEditBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteAsideEditBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
