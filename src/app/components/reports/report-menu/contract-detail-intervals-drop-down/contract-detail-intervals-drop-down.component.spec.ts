import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractDetailIntervalsDropDownComponent } from './contract-detail-intervals-drop-down.component';

describe('ContractDetailIntervalsDropDownComponent', () => {
  let component: ContractDetailIntervalsDropDownComponent;
  let fixture: ComponentFixture<ContractDetailIntervalsDropDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractDetailIntervalsDropDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractDetailIntervalsDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
