// Modules
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { routes } from './app.routes';

// Third party
import { ResourceModule } from 'ngx-resource';


// This app
import { HomeModule } from './pages/home/home.module';
import { EditorModule } from './pages/editor/editor.module';
import { SettingsService } from './pages/editor/settings.service';
import { SharedModule } from './shared/shared.module';


@NgModule({
  imports: [
      BrowserAnimationsModule,
      BrowserModule,
      HttpModule,
      RouterModule.forRoot(routes, {useHash: true}),

      ResourceModule.forRoot(),

      EditorModule,
      HomeModule,
      SharedModule.forRoot()
  ],
  declarations: [AppComponent],
  providers: [SettingsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
