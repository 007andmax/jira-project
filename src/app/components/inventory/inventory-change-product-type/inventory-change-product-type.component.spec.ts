import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryChangeProductTypeComponent } from './inventory-change-product-type.component';

describe('InventoryChangeProductTypeComponent', () => {
  let component: InventoryChangeProductTypeComponent;
  let fixture: ComponentFixture<InventoryChangeProductTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryChangeProductTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryChangeProductTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
