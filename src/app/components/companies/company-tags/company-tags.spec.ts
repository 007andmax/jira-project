import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlNumbersDropDownModule } from 'src/app/components/inventory/gl-numbers-drop-down/gl-numbers-drop-down.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CompanyTagsComponent } from './company-tags.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatChipListModule } from '../../shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from '../../shared/mat-chip/mat-chip.module';
import { MatFormFieldModule } from '../../shared/mat-form-field/mat-form-field.module';


describe('CompanyTagsComponent unit test', () => {
  let component: CompanyTagsComponent;
  let fixture: ComponentFixture<CompanyTagsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule,
        NgbModule,
        InfiniteScrollModule,
        HttpClientModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        NoopAnimationsModule, CompanyTagsComponent],
}).compileComponents();

  });
  it('check "setEditItems"', () => {
    const fixture = TestBed.createComponent(CompanyTagsComponent);
    const com = fixture.debugElement.componentInstance;
    com.setEditItems([1, 2, 3]);
    expect(com.editItems.length).toEqual(3);
  });
  it('check "setDefaultScoll"', () => {
    const fixture = TestBed.createComponent(CompanyTagsComponent);
    const com = fixture.debugElement.componentInstance;
    com.setDefaultScoll();
    expect(com.page).toEqual(0);
  });
  it('check "isSeleted"', () => {
    const fixture = TestBed.createComponent(CompanyTagsComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.isSeleted({ id: 1 })).toEqual(undefined);
  });
});