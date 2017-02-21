import { Component, ElementRef, ViewChild } from '@angular/core';


@Component({
    moduleId: module.id,
    selector: 'sd-board-explorer',
    templateUrl: 'board-explorer.component.html',
    styleUrls: ['board-explorer.component.css']
})
export class BoardExplorerComponent {
    public viewerLoaded: boolean = false;

    @ViewChild('boardViewer')
    private boardViewer: ElementRef;

    public init() {
        if (!this.viewerLoaded) {
            let iframe = this.boardViewer.nativeElement;
            iframe.setAttribute('src', iframe.getAttribute('data-src'));
            iframe.onload = () => {
                this.viewerLoaded = true;
            };
        }
    }
}
