import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsFilterComponent } from './tickets-filter.component';

describe('TicketsFilterComponent', () => {
  let component: TicketsFilterComponent;
  let fixture: ComponentFixture<TicketsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketsFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
