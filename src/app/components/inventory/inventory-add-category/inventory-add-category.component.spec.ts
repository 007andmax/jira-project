import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryAddCategoryComponent } from './inventory-add-category.component';

describe('InventoryAddCategoryComponent', () => {
  let component: InventoryAddCategoryComponent;
  let fixture: ComponentFixture<InventoryAddCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryAddCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryAddCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
