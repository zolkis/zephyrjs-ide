// Core modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// 3rd party modules
import { Angular2FontawesomeModule } from 'angular2-fontawesome';

// This module
import { TabBarComponent } from './tab-bar.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,

        Angular2FontawesomeModule
    ],
    declarations: [TabBarComponent],
    exports: [TabBarComponent]
})
export class TabBarModule { }
