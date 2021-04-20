import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsAsideProductServiceContractsComponent } from './contracts-aside-product-service-contracts.component';

describe('ContractsAsideProductServiceContractsComponent', () => {
  let component: ContractsAsideProductServiceContractsComponent;
  let fixture: ComponentFixture<ContractsAsideProductServiceContractsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsAsideProductServiceContractsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsAsideProductServiceContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
