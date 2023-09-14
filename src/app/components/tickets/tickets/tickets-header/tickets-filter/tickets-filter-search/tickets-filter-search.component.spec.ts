import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsFilterSearchComponent } from './tickets-filter-search.component';

describe('TicketsFilterSearchComponent', () => {
  let component: TicketsFilterSearchComponent;
  let fixture: ComponentFixture<TicketsFilterSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TicketsFilterSearchComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsFilterSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
