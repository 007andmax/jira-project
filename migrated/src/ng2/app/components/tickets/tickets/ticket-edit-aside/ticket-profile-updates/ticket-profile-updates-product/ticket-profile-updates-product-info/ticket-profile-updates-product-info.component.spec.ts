import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketProfileUpdatesProductInfoComponent } from './ticket-profile-updates-product-info.component';

describe('TicketProfileUpdatesProductInfoComponent', () => {
  let component: TicketProfileUpdatesProductInfoComponent;
  let fixture: ComponentFixture<TicketProfileUpdatesProductInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketProfileUpdatesProductInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketProfileUpdatesProductInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
