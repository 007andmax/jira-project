import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyPasswordManagerComponent } from './company-password-manager.component';

describe('CompanyPasswordManagerComponent', () => {
  let component: CompanyPasswordManagerComponent;
  let fixture: ComponentFixture<CompanyPasswordManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyPasswordManagerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyPasswordManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
