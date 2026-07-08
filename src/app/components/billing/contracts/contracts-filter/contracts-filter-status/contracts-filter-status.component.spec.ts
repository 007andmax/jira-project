import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsFilterStatusComponent } from './contracts-filter-status.component';

describe('ContractsFilterStatusComponent', () => {
  let component: ContractsFilterStatusComponent;
  let fixture: ComponentFixture<ContractsFilterStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractsFilterStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractsFilterStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
