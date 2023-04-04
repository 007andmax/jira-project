import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTagsComponent } from './dashboard-tags.component';

describe('DashboardTagsComponent', () => {
  let component: DashboardTagsComponent;
  let fixture: ComponentFixture<DashboardTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
