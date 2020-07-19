import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordPaymentFormComponent } from './record-payment-form.component';

describe('RecordPaymentFormComponent', () => {
  let component: RecordPaymentFormComponent;
  let fixture: ComponentFixture<RecordPaymentFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordPaymentFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordPaymentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
