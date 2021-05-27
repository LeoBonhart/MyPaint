import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipsService } from './tooltips.service';

@NgModule({
  imports: [CommonModule],
  providers: [TooltipsService]
})
export class TooltipsModule {

  constructor(private tooltips: TooltipsService) {
  }
}
