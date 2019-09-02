import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyPasswordMenegerComponent } from './company-password-manager.component';

describe('CompanyPasswordMenegerComponent', () => {
  let component: CompanyPasswordMenegerComponent;
  let fixture: ComponentFixture<CompanyPasswordMenegerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyPasswordMenegerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyPasswordMenegerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
