import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductItemQuoteComponent } from './product-item-quote.component';

describe('ProductItemQuoteComponent', () => {
  let component: ProductItemQuoteComponent;
  let fixture: ComponentFixture<ProductItemQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductItemQuoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductItemQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
