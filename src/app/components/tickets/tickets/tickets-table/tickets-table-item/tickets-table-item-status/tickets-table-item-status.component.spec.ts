import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsTableItemStatusComponent } from './tickets-table-item-status.component';

describe('TicketsTableItemStatusComponent', () => {
  let component: TicketsTableItemStatusComponent;
  let fixture: ComponentFixture<TicketsTableItemStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketsTableItemStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketsTableItemStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
