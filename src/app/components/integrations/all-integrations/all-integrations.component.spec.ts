import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllIntegrationsComponent } from './all-integrations.component';

describe('AllIntegrationsComponent', () => {
  let component: AllIntegrationsComponent;
  let fixture: ComponentFixture<AllIntegrationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllIntegrationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllIntegrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
