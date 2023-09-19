import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsFilterStatusComponent } from './tickets-filter-status.component';

describe('TicketsFilterStatusComponent', () => {
  let component: TicketsFilterStatusComponent;
  let fixture: ComponentFixture<TicketsFilterStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketsFilterStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsFilterStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
