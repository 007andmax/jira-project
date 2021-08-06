import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDashAssociateComponent } from './company-dash-associate.component';

describe('CompanyDashAssociateComponent', () => {
  let component: CompanyDashAssociateComponent;
  let fixture: ComponentFixture<CompanyDashAssociateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDashAssociateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDashAssociateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
