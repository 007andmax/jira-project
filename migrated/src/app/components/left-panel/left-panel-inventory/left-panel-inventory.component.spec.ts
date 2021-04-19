import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftPanelInventoryComponent } from './left-panel-inventory.component';

describe('LeftPanelInventoryComponent', () => {
  let component: LeftPanelInventoryComponent;
  let fixture: ComponentFixture<LeftPanelInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftPanelInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftPanelInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
