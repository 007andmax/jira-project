import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonContractServicesAddComponent } from './non-contract-services-add.component';

describe('NonContractServicesAddComponent', () => {
  let component: NonContractServicesAddComponent;
  let fixture: ComponentFixture<NonContractServicesAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NonContractServicesAddComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonContractServicesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
