import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsSettingsTypeComponent } from './products-settings-type.component';

describe('ProductsSettingsTypeComponent', () => {
  let component: ProductsSettingsTypeComponent;
  let fixture: ComponentFixture<ProductsSettingsTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsSettingsTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsSettingsTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
