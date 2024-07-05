import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsSettingsCategoryComponent } from './products-settings-category.component';

describe('ProductsSettingsCategoryComponent', () => {
  let component: ProductsSettingsCategoryComponent;
  let fixture: ComponentFixture<ProductsSettingsCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsSettingsCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsSettingsCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
