import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteAsidePreviewComponent } from './quote-aside-preview.component';

describe('QuoteAsidePreviewComponent', () => {
  let component: QuoteAsidePreviewComponent;
  let fixture: ComponentFixture<QuoteAsidePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteAsidePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteAsidePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
