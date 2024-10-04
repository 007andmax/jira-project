import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyProfileWorkspaceComponent } from './company-profile-workspace.component';

describe('CompanyProfileWorkspaceComponent', () => {
  let component: CompanyProfileWorkspaceComponent;
  let fixture: ComponentFixture<CompanyProfileWorkspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyProfileWorkspaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyProfileWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
