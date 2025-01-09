import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsAsideDiscountComponent } from './contracts-aside-discount.component';

describe('ContractsAsideDiscountComponent', () => {
  let component: ContractsAsideDiscountComponent;
  let fixture: ComponentFixture<ContractsAsideDiscountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsAsideDiscountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsAsideDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
