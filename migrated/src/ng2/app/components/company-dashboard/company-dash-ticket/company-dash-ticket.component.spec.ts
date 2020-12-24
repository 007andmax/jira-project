import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDashTicketComponent } from './company-dash-ticket.component';

describe('CompanyDashTicketComponent', () => {
  let component: CompanyDashTicketComponent;
  let fixture: ComponentFixture<CompanyDashTicketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDashTicketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDashTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
