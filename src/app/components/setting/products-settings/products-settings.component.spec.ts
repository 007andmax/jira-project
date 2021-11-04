import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsSettingsComponent } from './products-settings.component';

describe('ProductsSettingsComponent', () => {
  let component: ProductsSettingsComponent;
  let fixture: ComponentFixture<ProductsSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
