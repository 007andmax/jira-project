import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDiskDrivesComponent } from './dashboard-disk-drives.component';

describe('DashboardDiskDrivesComponent', () => {
  let component: DashboardDiskDrivesComponent;
  let fixture: ComponentFixture<DashboardDiskDrivesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardDiskDrivesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardDiskDrivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
