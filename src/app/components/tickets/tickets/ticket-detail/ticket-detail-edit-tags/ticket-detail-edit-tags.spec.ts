import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { DeviceCompany } from 'src/app/components/company-devices/class/device-company';
import { TicketDetailDevicesItemComponent } from '../ticket-detail-devices/ticket-detail-devices-item/ticket-detail-devices-item.component';
import { TicketDetailEditTagsComponent } from './ticket-detail-edit-tags.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { MatFormFieldModule } from 'src/app/components/shared/mat-form-field/mat-form-field.module';
import { ReactiveFormsModule } from '@angular/forms';

describe('TicketDetailEditTagsComponent unit test', () => {
  let component: TicketDetailEditTagsComponent;
  let fixture: ComponentFixture<TicketDetailEditTagsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        NgbModule,
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule,
        MatErrorModule,
        HttpClientModule,
        ReactiveFormsModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [TicketDetailEditTagsComponent
      ]
    }).compileComponents();

  });

  it('check "updateTagByRealTimes"', () => {
    const fixture = TestBed.createComponent(TicketDetailEditTagsComponent);
    const com = fixture.debugElement.componentInstance;
    com.updateTagByRealTimes({ id: 1, name: 2 });
    expect(com.tags).toEqual([{ id: 1, name: 2 }])
  });
  it('check "isSelected"', () => {
    const fixture = TestBed.createComponent(TicketDetailEditTagsComponent);
    const com = fixture.debugElement.componentInstance;
    com.selectedTag = [{ id: 1 }];
    expect(com.isSelected(1)).toEqual({ id: 1 });
    expect(com.isSelected(2)).toEqual(undefined);
  });
  it('check "setSelectedTags"', () => {
    const fixture = TestBed.createComponent(TicketDetailEditTagsComponent);
    const com = fixture.debugElement.componentInstance;
    com.setSelectedTags([{ id: 1 }])
    expect(com.selectedTag).toEqual([{ id: 1 }]);
  });
  it('check "selected"', () => {
    const fixture = TestBed.createComponent(TicketDetailEditTagsComponent);
    const com = fixture.debugElement.componentInstance;
    com.selected({ id: 1 })
    expect(com.selectedTag).toEqual([{ id: 1 }]);
    com.selected({ id: 1 })
    expect(com.selectedTag).toEqual([{ id: 1 }]);
    com.selected({ id: 2 })
    expect(com.selectedTag).toEqual([{ id: 1 }, { id: 2 }]);
  });
  it('check "remove"', () => {
    const fixture = TestBed.createComponent(TicketDetailEditTagsComponent);
    const com = fixture.debugElement.componentInstance;
    com.selectedTag = [{ id: 1 }, { id: 2 }, { id: 3 }];
    com.remove(1);
    expect(com.selectedTag).toEqual([{ id: 1 }, { id: 3 }]);
  });
});