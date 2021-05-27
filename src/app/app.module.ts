import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS } from '@angular-material-components/color-picker';
import { SettingBottomComponent } from './setting-bottom/setting-bottom/setting-bottom.component';
import { TooltipsModule } from './tooltips/tooltips.module';

@NgModule({
  declarations: [
    AppComponent,
    SettingBottomComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSliderModule,
    NgxMatColorPickerModule,
    TooltipsModule
  ],
  providers: [
    { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
