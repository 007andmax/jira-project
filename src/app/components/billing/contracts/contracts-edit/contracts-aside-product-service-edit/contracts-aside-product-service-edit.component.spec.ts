import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsAsideProductServiceEditComponent } from './contracts-aside-product-service-edit.component';

describe('ContractsAsideProductServiceEditComponent', () => {
  let component: ContractsAsideProductServiceEditComponent;
  let fixture: ComponentFixture<ContractsAsideProductServiceEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsAsideProductServiceEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsAsideProductServiceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
