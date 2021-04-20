import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketProfileFormUpdateProductsComponent } from './ticket-profile-form-update-products.component';

describe('TicketProfileFormUpdateProductsComponent', () => {
  let component: TicketProfileFormUpdateProductsComponent;
  let fixture: ComponentFixture<TicketProfileFormUpdateProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketProfileFormUpdateProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketProfileFormUpdateProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
