import { Component, ElementRef, Input, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TimerObservable } from 'rxjs/observable/TimerObservable';

import { BoardExplorerService } from './board-explorer.service';


declare var $: any;


enum BoardComponentType {
    PIN = 1,
    OTHER
}

class BoardComponent {
    private _el: SVGElement;
    private _container: HTMLElement;

    private _id: string;
    private _type: BoardComponentType;
    private _clientRect: ClientRect;

    public constructor(el: SVGElement, container: HTMLElement) {
        this._el = el;
        this._container = container;

        this._id = this._getComponentId();
        this._type = this._getComponentType();

        this.calculateComponentClientRect();
    }

    public getId(): string { return this._id; }
    public getType(): BoardComponentType { return this._type; }
    public getClientRect(): ClientRect { return this._clientRect; }

    public calculateComponentClientRect() {
        let svgRect: ClientRect = this._el.getBoundingClientRect();
        let containerRect: ClientRect = this._container.getBoundingClientRect();
        let padding: number = 8;

        this._clientRect = {
            top:
                Math.abs(containerRect.top - svgRect.top) +
                this._container.offsetTop -
                padding / 2,
            left:
                Math.abs(containerRect.left - svgRect.left) +
                this._container.offsetLeft -
                padding / 2,
            height: svgRect.height + padding,
            width: svgRect.width + padding,
            right: 0, // We do not care.
            bottom: 0 // We do not care.
        };
    }

    private _getComponentId(): string {
        let id: string = this._el.getAttribute('id');

        let bvSplit: string[] = id.split('BV_');
        if (bvSplit.length === 1) {
            return bvSplit[0];
        }

        return bvSplit[1];
    }

    private _getComponentType(): BoardComponentType {
        let id: string = this._el.getAttribute('id');

        let isPin: boolean = id.indexOf('Pin') > 0;
        if (isPin) {
            return BoardComponentType.PIN;
        }

        return BoardComponentType.OTHER;
    }
}

@Component({
    moduleId: module.id,
    selector: 'sd-board-explorer',
    templateUrl: 'board-explorer.component.html',
    styleUrls: ['board-explorer.component.css']
})
export class BoardExplorerComponent implements OnInit, OnDestroy {
    @Input('board') public board: string;
    public selectedComponent: any = {
        id: null,
        name: null,
        description: null,
        keywords: [],
        docs: null
    };

    @ViewChild('boardEl') private $boardEl: ElementRef;
    private _components: BoardComponent[] = [];
    private _refreshComponentsPositionSub: Subscription;

    public constructor(public boardExplorerService: BoardExplorerService) {
    }

    public onSVGInserted(svg: SVGElement) {
        this._components = [];
        let children: NodeListOf<Element> = svg.querySelectorAll('[id^="BV_"');
        [].forEach.call(children, (el: SVGElement) => {
            let component = new BoardComponent(el, this.$boardEl.nativeElement);
            this._components.push(component);
        });
    }

    public getComponents(): BoardComponent[] {
        return this._components;
    }


    public ngOnInit() {
        let interval: number = 250;
        let timer = TimerObservable.create(interval, interval);
        this._refreshComponentsPositionSub = timer.subscribe(() => {
            for (let component of this.getComponents()) {
                component.calculateComponentClientRect();
            }
        });
    }

    public ngOnDestroy() {
        this._refreshComponentsPositionSub.unsubscribe();
    }

    public onComponentMouseover(component: BoardComponent): boolean {
        $('#highlight-' + component.getId()).tooltip('show');
        return false;
    }

    public onComponentClicked(component: BoardComponent): boolean {
        this.selectedComponent.id = component.getId();

        this.boardExplorerService.getComponentName(
            this.board, component.getId())
            .subscribe((name: string) => {
                this.selectedComponent.name = name;
            });

        this.boardExplorerService.getComponentDescription(
            this.board, component.getId())
            .subscribe((desc: string) => {
                this.selectedComponent.description = desc;
            });

        this.boardExplorerService.getComponentKeywords(
            this.board, component.getId())
            .subscribe((keywords: string[]) => {
                this.selectedComponent.keywords = keywords;
            });

        this.boardExplorerService.getComponentDocs(
            this.board, component.getId())
            .subscribe((docs: string) => {
                this.selectedComponent.docs = docs;
            });

        return true; // Continue to the modal dialog.
    }
}
