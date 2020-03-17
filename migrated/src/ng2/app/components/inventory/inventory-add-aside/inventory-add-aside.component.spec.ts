import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryAddAsideComponent } from './inventory-add-aside.component';

describe('InventoryAddAsideComponent', () => {
  let component: InventoryAddAsideComponent;
  let fixture: ComponentFixture<InventoryAddAsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryAddAsideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryAddAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
