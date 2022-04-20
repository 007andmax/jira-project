import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryModalRemoveComponent } from './inventory-modal-remove.component';

describe('InventoryModalRemoveComponent', () => {
  let component: InventoryModalRemoveComponent;
  let fixture: ComponentFixture<InventoryModalRemoveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryModalRemoveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryModalRemoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
