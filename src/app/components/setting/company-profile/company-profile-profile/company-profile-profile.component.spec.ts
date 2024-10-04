import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyProfileProfileComponent } from './company-profile-profile.component';

describe('CompanyProfileProfileComponent', () => {
  let component: CompanyProfileProfileComponent;
  let fixture: ComponentFixture<CompanyProfileProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyProfileProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyProfileProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
