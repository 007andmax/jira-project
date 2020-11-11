import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteAsideAddBodyComponent } from './quote-aside-add-body.component';

describe('QuoteAsideAddBodyComponent', () => {
  let component: QuoteAsideAddBodyComponent;
  let fixture: ComponentFixture<QuoteAsideAddBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteAsideAddBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteAsideAddBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
