import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsAsideComponent } from './payments-aside.component';

describe('PaymentsAsideComponent', () => {
  let component: PaymentsAsideComponent;
  let fixture: ComponentFixture<PaymentsAsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentsAsideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
