import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyProfileApiKeysComponent } from './company-profile-api-keys.component';

describe('CompanyProfileApiKeysComponent', () => {
  let component: CompanyProfileApiKeysComponent;
  let fixture: ComponentFixture<CompanyProfileApiKeysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyProfileApiKeysComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyProfileApiKeysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
