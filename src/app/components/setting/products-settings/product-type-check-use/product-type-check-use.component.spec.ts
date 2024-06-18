import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTypeCheckUseComponent } from './product-type-check-use.component';

describe('ProductTypeCheckUseComponent', () => {
  let component: ProductTypeCheckUseComponent;
  let fixture: ComponentFixture<ProductTypeCheckUseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductTypeCheckUseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTypeCheckUseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
