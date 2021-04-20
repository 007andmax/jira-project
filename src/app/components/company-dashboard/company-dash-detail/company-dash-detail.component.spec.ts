import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDashDetailComponent } from './company-dash-detail.component';

describe('CompanyDashDetailComponent', () => {
  let component: CompanyDashDetailComponent;
  let fixture: ComponentFixture<CompanyDashDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDashDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDashDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
