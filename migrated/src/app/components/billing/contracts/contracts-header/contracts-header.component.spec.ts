import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsHeaderComponent } from './contracts-header.component';

describe('ContractsHeaderComponent', () => {
  let component: ContractsHeaderComponent;
  let fixture: ComponentFixture<ContractsHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
