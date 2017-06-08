// Core modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// 3rd party modules
import { Angular2FontawesomeModule } from 'angular2-fontawesome';

// This module
import { DeviceToolbarComponent } from './device-toolbar.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,

        Angular2FontawesomeModule
    ],
    declarations: [DeviceToolbarComponent],
    exports: [DeviceToolbarComponent]
})
export class DeviceToolbarModule { }
