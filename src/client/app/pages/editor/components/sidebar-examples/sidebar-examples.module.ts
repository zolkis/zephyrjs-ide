// Core modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Third-party modules
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';

// This module
import { SidebarExamplesComponent } from './sidebar-examples.component';


@NgModule({
    imports: [
        CommonModule,
        Angular2FontawesomeModule
    ],
    declarations: [SidebarExamplesComponent],
    exports: [SidebarExamplesComponent]
})
export class SidebarExamplesModule { }
