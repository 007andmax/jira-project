import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { TaxesService } from 'src/app/services/taxes/taxes.service';


@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'taxes-add',
  templateUrl: './taxes-add.component.html',
  styleUrls: ['./taxes-add.component.scss']
})
export class TaxesAddComponent implements OnInit {
  taxForm: UntypedFormGroup;
  unique = true;
  submitted = false;
  @Output() onClose = new EventEmitter();
  constructor(private taxesService: TaxesService,
    private formBuilder: UntypedFormBuilder,) { }

  ngOnInit() {
    this.taxForm = this.formBuilder.group({
      name: [
        "",
        [Validators.required, Validators.minLength(2), Validators.maxLength(30)]
      ],
      rate: [
        "",
        [Validators.required, Validators.min(0.01), Validators.max(99)]
      ],
      isDefault: [false]
    });
  }
  isUniqueName(name) {
    if (!this.taxForm.controls["name"].errors) {
      this.taxesService
        .isUniqueName(name)
        .pipe(
          map((res: any) => {
            if (res) {
              this.unique = res.valid;
            } else {
              this.unique = true;
            }
          })
        )
        .subscribe();
    }
  }
  get f() {
    return this.taxForm.controls;
  }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.taxForm.invalid || !this.unique) {
      return;
    }

    this.taxesService
      .saveTaxes(this.taxForm.value)
      .pipe(
        map((res: any) => {
          this.onClose.emit();
        })
      )
      .subscribe();
  }
  closed() {
    this.onClose.emit();
  }
}
