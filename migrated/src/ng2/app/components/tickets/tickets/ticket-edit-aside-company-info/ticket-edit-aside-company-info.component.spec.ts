import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketEditAsideCompanyInfoComponent } from './ticket-edit-aside-company-info.component';

describe('TicketEditAsideCompanyInfoComponent', () => {
  let component: TicketEditAsideCompanyInfoComponent;
  let fixture: ComponentFixture<TicketEditAsideCompanyInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketEditAsideCompanyInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketEditAsideCompanyInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
