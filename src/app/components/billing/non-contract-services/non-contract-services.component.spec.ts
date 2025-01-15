import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonContractServicesComponent } from './non-contract-services.component';

describe('NonContractServicesComponent', () => {
  let component: NonContractServicesComponent;
  let fixture: ComponentFixture<NonContractServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NonContractServicesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonContractServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
