import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsAsideTopComponent } from './contracts-aside-top.component';

describe('ContractsAsideTopComponent', () => {
  let component: ContractsAsideTopComponent;
  let fixture: ComponentFixture<ContractsAsideTopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsAsideTopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsAsideTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
