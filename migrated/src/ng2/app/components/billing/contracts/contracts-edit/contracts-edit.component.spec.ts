import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsEditComponent } from './contracts-edit.component';

describe('ContractsEditComponent', () => {
  let component: ContractsEditComponent;
  let fixture: ComponentFixture<ContractsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
