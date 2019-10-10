import { Component, OnInit } from "@angular/core";
import { TaxesService } from "./taxes.service";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: "app-taxes",
  templateUrl: "./taxes.component.html",
  styleUrls: ["./taxes.component.scss"]
})
export class TaxesComponent implements OnInit {
  taxes: any;
  loading = false;

  constructor(private taxesService: TaxesService,
    private toastrService : ToastrService) {}

  ngOnInit() {
    this.getTaxes();
  }

  getTaxes() {
    this.loading = true;
    this.taxesService.getTaxes().subscribe(
      res => {
        this.loading = false;
        if (res) {
          this.taxes = res;
        }
      },
      error => {
        this.loading = false;
      }
    );
  }
}
