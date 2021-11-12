import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingYearComponent } from './accounting-year.component';

describe('AccountingYearComponent', () => {
  let component: AccountingYearComponent;
  let fixture: ComponentFixture<AccountingYearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingYearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
