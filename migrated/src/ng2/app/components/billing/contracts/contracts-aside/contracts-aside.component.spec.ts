import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsAsideComponent } from './contracts-aside.component';

describe('ContractsAsideComponent', () => {
  let component: ContractsAsideComponent;
  let fixture: ComponentFixture<ContractsAsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsAsideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
