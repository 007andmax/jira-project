import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonContractServicesItemComponent } from './non-contract-services-item.component';

describe('NonContractServicesItemComponent', () => {
  let component: NonContractServicesItemComponent;
  let fixture: ComponentFixture<NonContractServicesItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NonContractServicesItemComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonContractServicesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
