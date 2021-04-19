import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechUsersListReportComponent } from './tech-users-list-report.component';

describe('TechUsersListReportComponent', () => {
  let component: TechUsersListReportComponent;
  let fixture: ComponentFixture<TechUsersListReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechUsersListReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechUsersListReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
