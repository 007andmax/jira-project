import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyProfileOperationalHoursComponent } from './company-profile-operational-hours.component';

describe('CompanyProfileOperationalHoursComponent', () => {
  let component: CompanyProfileOperationalHoursComponent;
  let fixture: ComponentFixture<CompanyProfileOperationalHoursComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyProfileOperationalHoursComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyProfileOperationalHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
