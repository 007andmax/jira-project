import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateContractsComponent } from './create-contracts.component';

describe('CreateContractsComponent', () => {
  let component: CreateContractsComponent;
  let fixture: ComponentFixture<CreateContractsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateContractsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
