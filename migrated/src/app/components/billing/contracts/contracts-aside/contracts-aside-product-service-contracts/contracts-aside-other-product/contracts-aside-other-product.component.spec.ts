import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsAsideOtherProductComponent } from './contracts-aside-other-product.component';

describe('ContractsAsideOtherProductComponent', () => {
  let component: ContractsAsideOtherProductComponent;
  let fixture: ComponentFixture<ContractsAsideOtherProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsAsideOtherProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsAsideOtherProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
