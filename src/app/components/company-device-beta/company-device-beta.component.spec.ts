import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDeviceBetaComponent } from './company-device-beta.component';

describe('CompanyDeviceBetaComponent', () => {
  let component: CompanyDeviceBetaComponent;
  let fixture: ComponentFixture<CompanyDeviceBetaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDeviceBetaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDeviceBetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
