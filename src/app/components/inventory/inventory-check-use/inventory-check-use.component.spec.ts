import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryCheckUseComponent } from './inventory-check-use.component';

describe('InventoryCheckUseComponent', () => {
  let component: InventoryCheckUseComponent;
  let fixture: ComponentFixture<InventoryCheckUseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryCheckUseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryCheckUseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
