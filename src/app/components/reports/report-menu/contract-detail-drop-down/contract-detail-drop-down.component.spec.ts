import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractDetailDropDownComponent } from './contract-detail-drop-down.component';

describe('ContractDetailDropDownComponent', () => {
  let component: ContractDetailDropDownComponent;
  let fixture: ComponentFixture<ContractDetailDropDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractDetailDropDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractDetailDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
