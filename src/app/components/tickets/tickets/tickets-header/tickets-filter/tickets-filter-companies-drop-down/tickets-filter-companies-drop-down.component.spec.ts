import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsFilterCompaniesDropDownComponent } from './tickets-filter-companies-drop-down.component';

describe('TicketsFilterCompaniesDropDownComponent', () => {
  let component: TicketsFilterCompaniesDropDownComponent;
  let fixture: ComponentFixture<TicketsFilterCompaniesDropDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketsFilterCompaniesDropDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsFilterCompaniesDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
