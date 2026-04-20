import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatChipModule } from '../../shared/mat-chip/mat-chip.module';
import { MatFormFieldModule } from '../../shared/mat-form-field/mat-form-field.module';
import { MatChipListModule } from '../../shared/mat-chip-list/mat-chip-list.module';
import { CompanyDevicesTagsComponent } from './company-devices-tags.component';
 

describe('CompanyDevicesTagsComponent unit test', () => {
  let component: CompanyDevicesTagsComponent;
  let fixture: ComponentFixture<CompanyDevicesTagsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NgbModule,
        InfiniteScrollModule,
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule,
        HttpClientModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        NoopAnimationsModule, CompanyDevicesTagsComponent],
}).compileComponents();

  });
  it('check "setSelectedTag"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesTagsComponent);
    const com = fixture.debugElement.componentInstance;
    com.setSelectedTag([{id:1, name:"test"}]);
     expect(com.selectedTag).toEqual([{id:1, name:"test"}]);
  });
   it('check "setSelectedTag"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesTagsComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSearch({target:{value:"test"}});
     expect(com.searchName).toEqual("test");
  });
   it('check "setSelectedTag"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesTagsComponent);
    const com = fixture.debugElement.componentInstance;
    com.clearWithOutChanges();
     expect(com.selectedTag).toEqual([]);
  });
    it('check "isSeleted"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesTagsComponent);
    const com = fixture.debugElement.componentInstance;
     expect(com.isSeleted({id:"test"})).toEqual(undefined);
  });
   it('check "close"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesTagsComponent);
    const com = fixture.debugElement.componentInstance;
    com.close();
     expect(com.selectedTag).toEqual([]);
  });
});