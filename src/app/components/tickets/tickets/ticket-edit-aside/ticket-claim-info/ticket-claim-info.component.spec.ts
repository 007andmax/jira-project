import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketClaimInfoComponent } from './ticket-claim-info.component';

describe('TicketClaimInfoComponent', () => {
  let component: TicketClaimInfoComponent;
  let fixture: ComponentFixture<TicketClaimInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketClaimInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketClaimInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
