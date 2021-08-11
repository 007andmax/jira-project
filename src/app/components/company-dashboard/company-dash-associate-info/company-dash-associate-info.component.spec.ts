import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDashAssociateInfoComponent } from './company-dash-associate-info.component';

describe('CompanyDashAssociateInfoComponent', () => {
  let component: CompanyDashAssociateInfoComponent;
  let fixture: ComponentFixture<CompanyDashAssociateInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDashAssociateInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDashAssociateInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
