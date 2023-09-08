import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsFilterDropDownComponent } from './tickets-filter-drop-down.component';

describe('TicketsFilterDropDownComponent', () => {
  let component: TicketsFilterDropDownComponent;
  let fixture: ComponentFixture<TicketsFilterDropDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketsFilterDropDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsFilterDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
