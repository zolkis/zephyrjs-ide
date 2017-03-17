import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';


@Component({
    moduleId: module.id,
    selector: 'sd-board-explorer',
    templateUrl: 'board-explorer.component.html',
    styleUrls: ['board-explorer.component.css']
})
export class BoardExplorerComponent implements OnInit {
    public viewerLoaded: boolean = false;

    @ViewChild('boardViewer')
    private boardViewer: ElementRef;

    public ngOnInit() {
        let iframe = this.boardViewer.nativeElement;
        iframe.setAttribute('src', iframe.getAttribute('data-src'));
        iframe.onload = () => {
            this.viewerLoaded = true;
        };
    }
}
