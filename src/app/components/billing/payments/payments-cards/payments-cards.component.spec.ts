import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsCardsComponent } from './payments-cards.component';

describe('PaymentsCardsComponent', () => {
  let component: PaymentsCardsComponent;
  let fixture: ComponentFixture<PaymentsCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentsCardsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentsCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
