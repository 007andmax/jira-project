import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditCategoryProductComponent } from './modal-edit-category-product.component';

describe('ModalEditCategoryProductComponent', () => {
  let component: ModalEditCategoryProductComponent;
  let fixture: ComponentFixture<ModalEditCategoryProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalEditCategoryProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEditCategoryProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
