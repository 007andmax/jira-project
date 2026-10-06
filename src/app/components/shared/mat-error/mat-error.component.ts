import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mat-error',
  templateUrl: './mat-error.component.html',
  styleUrls: ['./mat-error.component.scss'],
  standalone: true,
  imports: [CommonModule],

})
export class MatErrorComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
