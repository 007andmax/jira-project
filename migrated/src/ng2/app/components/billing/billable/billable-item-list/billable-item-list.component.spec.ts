import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillableItemListComponent } from './billable-item-list.component';

describe('BillableItemListComponent', () => {
  let component: BillableItemListComponent;
  let fixture: ComponentFixture<BillableItemListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillableItemListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillableItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
