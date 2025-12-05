import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftPanelIntegrationsComponent } from './left-panel-integrations.component';

describe('LeftPanelIntegrationsComponent', () => {
  let component: LeftPanelIntegrationsComponent;
  let fixture: ComponentFixture<LeftPanelIntegrationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeftPanelIntegrationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeftPanelIntegrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
