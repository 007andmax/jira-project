import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteAsideEditComponent } from './quote-aside-edit.component';

describe('QuoteAsideEditComponent', () => {
  let component: QuoteAsideEditComponent;
  let fixture: ComponentFixture<QuoteAsideEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteAsideEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteAsideEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
