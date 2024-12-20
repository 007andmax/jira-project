import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonContractServicesEditComponent } from './non-contract-services-edit.component';

describe('NonContractServicesEditComponent', () => {
  let component: NonContractServicesEditComponent;
  let fixture: ComponentFixture<NonContractServicesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NonContractServicesEditComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonContractServicesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
