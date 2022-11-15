import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyTechUsersComponent } from './company-tech-users.component';

describe('CompanyTechUsersComponent', () => {
  let component: CompanyTechUsersComponent;
  let fixture: ComponentFixture<CompanyTechUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyTechUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyTechUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
