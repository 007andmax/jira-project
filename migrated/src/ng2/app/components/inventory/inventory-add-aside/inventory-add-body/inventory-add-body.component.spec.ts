import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryAddBodyComponent } from './inventory-add-body.component';

describe('InventoryAddBodyComponent', () => {
  let component: InventoryAddBodyComponent;
  let fixture: ComponentFixture<InventoryAddBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryAddBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryAddBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
