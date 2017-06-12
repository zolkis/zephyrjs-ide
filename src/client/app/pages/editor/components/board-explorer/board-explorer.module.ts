// Core modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Third party
import { InlineSVGModule } from 'ng-inline-svg';
import { MarkdownModule } from 'angular2-markdown';

// This module
import { BoardExplorerComponent } from './board-explorer.component';
import { BoardExplorerService } from './board-explorer.service';


@NgModule({
    imports: [CommonModule, InlineSVGModule, MarkdownModule.forRoot()],
    declarations: [BoardExplorerComponent],
    exports: [BoardExplorerComponent]
})
export class BoardExplorerModule { }
