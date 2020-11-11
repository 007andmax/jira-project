import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteAsidePreviewBodyComponent } from './quote-aside-preview-body.component';

describe('QuoteAsidePreviewBodyComponent', () => {
  let component: QuoteAsidePreviewBodyComponent;
  let fixture: ComponentFixture<QuoteAsidePreviewBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteAsidePreviewBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteAsidePreviewBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
