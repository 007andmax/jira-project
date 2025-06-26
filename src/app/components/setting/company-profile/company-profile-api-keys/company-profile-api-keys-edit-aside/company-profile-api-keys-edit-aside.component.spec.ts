import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyProfileApiKeysEditAsideComponent } from './company-profile-api-keys-edit-aside.component';

describe('CompanyProfileApiKeysEditAsideComponent', () => {
  let component: CompanyProfileApiKeysEditAsideComponent;
  let fixture: ComponentFixture<CompanyProfileApiKeysEditAsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyProfileApiKeysEditAsideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyProfileApiKeysEditAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
