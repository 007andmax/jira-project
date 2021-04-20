import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductItemQuoteEditComponent } from './product-item-quote-edit.component';

describe('ProductItemQuoteEditComponent', () => {
  let component: ProductItemQuoteEditComponent;
  let fixture: ComponentFixture<ProductItemQuoteEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductItemQuoteEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductItemQuoteEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
