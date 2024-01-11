import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsFilterCreatedDropDownComponent } from './tickets-filter-created-drop-down.component';

describe('TicketsFilterCreatedDropDownComponent', () => {
  let component: TicketsFilterCreatedDropDownComponent;
  let fixture: ComponentFixture<TicketsFilterCreatedDropDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketsFilterCreatedDropDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsFilterCreatedDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
