import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsFilterInfoComponent } from './tickets-filter-info.component';

describe('TicketsFilterInfoComponent', () => {
  let component: TicketsFilterInfoComponent;
  let fixture: ComponentFixture<TicketsFilterInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketsFilterInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsFilterInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
