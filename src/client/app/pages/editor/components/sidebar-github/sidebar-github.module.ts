// Core modules
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// 3rd party modules
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';

// This module
import { SidebarGitHubComponent } from './sidebar-github.component';


@NgModule({
    imports: [
        Angular2FontawesomeModule,
        CommonModule,
        FormsModule
    ],
    declarations: [SidebarGitHubComponent],
    exports: [SidebarGitHubComponent]
})
export class SidebarGitHubModule {}
