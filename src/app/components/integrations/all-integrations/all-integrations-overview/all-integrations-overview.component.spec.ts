import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllIntegrationsOverviewComponent } from './all-integrations-overview.component';

describe('AllIntegrationsOverviewComponent', () => {
  let component: AllIntegrationsOverviewComponent;
  let fixture: ComponentFixture<AllIntegrationsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllIntegrationsOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllIntegrationsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
