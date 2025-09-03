import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftPanelTasksComponent } from './left-panel-tasks.component';

describe('LeftPanelTasksComponent', () => {
  let component: LeftPanelTasksComponent;
  let fixture: ComponentFixture<LeftPanelTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeftPanelTasksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeftPanelTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
