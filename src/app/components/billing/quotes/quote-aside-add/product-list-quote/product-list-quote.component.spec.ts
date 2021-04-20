import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListQuoteComponent } from './product-list-quote.component';

describe('ProductListQuoteComponent', () => {
  let component: ProductListQuoteComponent;
  let fixture: ComponentFixture<ProductListQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductListQuoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
