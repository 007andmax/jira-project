import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteAsideAddComponent } from './quote-aside-add.component';

describe('QuoteAsideAddComponent', () => {
  let component: QuoteAsideAddComponent;
  let fixture: ComponentFixture<QuoteAsideAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteAsideAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteAsideAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
