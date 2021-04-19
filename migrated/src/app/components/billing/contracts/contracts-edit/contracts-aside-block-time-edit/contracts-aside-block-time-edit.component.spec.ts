import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsAsideBlockTimeEditComponent } from './contracts-aside-block-time-edit.component';

describe('ContractsAsideBlockTimeEditComponent', () => {
  let component: ContractsAsideBlockTimeEditComponent;
  let fixture: ComponentFixture<ContractsAsideBlockTimeEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsAsideBlockTimeEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsAsideBlockTimeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
