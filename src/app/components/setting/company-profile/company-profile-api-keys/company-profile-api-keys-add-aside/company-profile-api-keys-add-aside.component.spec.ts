import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyProfileApiKeysAddAsideComponent } from './company-profile-api-keys-add-aside.component';

describe('CompanyProfileApiKeysAddAsideComponent', () => {
  let component: CompanyProfileApiKeysAddAsideComponent;
  let fixture: ComponentFixture<CompanyProfileApiKeysAddAsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyProfileApiKeysAddAsideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyProfileApiKeysAddAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
