import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryEditAsideComponent } from './inventory-edit-aside.component';

describe('InventoryEditAsideComponent', () => {
  let component: InventoryEditAsideComponent;
  let fixture: ComponentFixture<InventoryEditAsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryEditAsideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryEditAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
