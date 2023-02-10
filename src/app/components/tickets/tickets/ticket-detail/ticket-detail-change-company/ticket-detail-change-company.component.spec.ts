import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailChangeCompanyComponent } from './ticket-detail-change-company.component';

describe('TicketDetailChangeCompanyComponent', () => {
  let component: TicketDetailChangeCompanyComponent;
  let fixture: ComponentFixture<TicketDetailChangeCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailChangeCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailChangeCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
