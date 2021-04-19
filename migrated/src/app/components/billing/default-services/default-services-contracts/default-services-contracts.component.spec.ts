import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultServicesContractsComponent } from './default-services-contracts.component';

describe('DefaultServicesContractsComponent', () => {
  let component: DefaultServicesContractsComponent;
  let fixture: ComponentFixture<DefaultServicesContractsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultServicesContractsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultServicesContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
