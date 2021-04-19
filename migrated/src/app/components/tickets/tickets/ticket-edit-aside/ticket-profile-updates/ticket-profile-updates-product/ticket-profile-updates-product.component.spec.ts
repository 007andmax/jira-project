import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketProfileUpdatesProductComponent } from './ticket-profile-updates-product.component';

describe('TicketProfileUpdatesProductComponent', () => {
  let component: TicketProfileUpdatesProductComponent;
  let fixture: ComponentFixture<TicketProfileUpdatesProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketProfileUpdatesProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketProfileUpdatesProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
