import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsConfirmComponent } from './contracts-confirm.component';

describe('ContractsConfirmComponent', () => {
  let component: ContractsConfirmComponent;
  let fixture: ComponentFixture<ContractsConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
