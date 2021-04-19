import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsTableItemComponent } from './tickets-table-item.component';

describe('TicketsTableItemComponent', () => {
  let component: TicketsTableItemComponent;
  let fixture: ComponentFixture<TicketsTableItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketsTableItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsTableItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
