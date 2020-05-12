import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketProfileUpdatesProductItemComponent } from './ticket-profile-updates-product-item.component';

describe('TicketProfileUpdatesProductItemComponent', () => {
  let component: TicketProfileUpdatesProductItemComponent;
  let fixture: ComponentFixture<TicketProfileUpdatesProductItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketProfileUpdatesProductItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketProfileUpdatesProductItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
