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
import { AboutModule } from './pages/about/about.module';
import { EditorModule } from './pages/editor/editor.module';
import { SharedModule } from './shared/shared.module';


@NgModule({
  imports: [
      BrowserAnimationsModule,
      BrowserModule,
      HttpModule,
      RouterModule.forRoot(routes, {useHash: true}),

      ResourceModule.forRoot(),

      AboutModule,
      EditorModule,
      HomeModule,
      SharedModule.forRoot()
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
