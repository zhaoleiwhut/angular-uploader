import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularUploaderModule } from 'angular-uploader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularUploaderModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
