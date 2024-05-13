import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturesCheckUseComponent } from './manufactures-check-use.component';

describe('ManufacturesCheckUseComponent', () => {
  let component: ManufacturesCheckUseComponent;
  let fixture: ComponentFixture<ManufacturesCheckUseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManufacturesCheckUseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufacturesCheckUseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
