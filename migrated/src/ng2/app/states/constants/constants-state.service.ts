import { Injectable } from '@angular/core';
import { ConstantsService } from '../../services/constants/constants.service';

@Injectable({
  providedIn: 'root'
})
export class ConstantsStateService {
    constants;
  constructor(private constantsService:ConstantsService) { }

  public onInit() {
    this.constantsService.getConstants().subscribe(data => {
      console.log("data",data);
      this.constants = data;
    })

  }
  public  getConstant(constantName) {
return this.constants[constantName];
  
  }
}
