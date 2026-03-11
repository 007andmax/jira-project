import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsTableItemRequestedByComponent } from './tickets-table-item-requested-by.component';

describe('TicketsTableItemRequestedByComponent', () => {
  let component: TicketsTableItemRequestedByComponent;
  let fixture: ComponentFixture<TicketsTableItemRequestedByComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketsTableItemRequestedByComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketsTableItemRequestedByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
