import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsLeftMenuComponent } from './reports-left-menu.component';

describe('ReportsLeftMenuComponent', () => {
  let component: ReportsLeftMenuComponent;
  let fixture: ComponentFixture<ReportsLeftMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsLeftMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsLeftMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
