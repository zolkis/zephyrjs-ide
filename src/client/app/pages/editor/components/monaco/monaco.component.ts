import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild
} from '@angular/core';

import { AppDataService } from '../../../../app.data.service';
import { FileService } from '../../file.service';
import { WebUsbService } from '../../../../shared/webusb/webusb.service';

import { WebUsbPort } from '../../../../shared/webusb/webusb.port';
import { EditorTab, OPERATION_STATUS } from '../../editor.tab';


declare var $: any;
declare const monaco: any;


@Component({
    moduleId: module.id,
    selector: 'sd-monaco',
    providers: [FileService],
    templateUrl: 'monaco.component.html',
    styleUrls: ['monaco.component.css']
})
export class MonacoComponent implements AfterViewInit {
    @Input('tab') tab: EditorTab;
    @Output() onWarning = new EventEmitter();
    @Output() onError = new EventEmitter();
    @Output() onSuccess = new EventEmitter();

    public filename: string = '';

    @ViewChild('editor')
    private editorView: ElementRef;

    @ViewChild('saveModal')
    private saveModal: ElementRef;

    @ViewChild('overwriteModal')
    private overwriteModal: ElementRef;

    private initialCode: string = '';

    constructor(
        private appDataService: AppDataService,
        private fileService: FileService,
        private webusbService: WebUsbService) {
    }

    public ngAfterViewInit() {
        var onGotAmdLoader = () => {
            // Load monaco
            (<any>window).require.config({ paths: { 'vs': 'libs/monaco/vs' } });
            (<any>window).require(['vs/editor/editor.main'], () => {
                this.initMonaco();
            });
        };

        // Load AMD loader if necessary
        // WARNING: this will 404 doing unit tests. It's fine.
        if (!(<any>window).require) {
            var loaderScript = document.createElement('script');
            loaderScript.type = 'text/javascript';
            loaderScript.src = 'libs/monaco/vs/loader.js';
            loaderScript.addEventListener('load', onGotAmdLoader);
            document.body.appendChild(loaderScript);
        } else {
            onGotAmdLoader();
        }

        if (this.webusbService.usb === undefined) {
            this.onError.emit({
                body: 'Your browser does not support WebUSB',
                sticky: true
            });
        }

        $(this.saveModal.nativeElement).on('shown.bs.modal', () => {
            document.getElementById(
                'saveModal_filename_' + this.tab.id).focus();
        });
    }

    // Will be called once monaco library is available
    public initMonaco() {
        if (this.tab === null) {
            throw('You need to construct the monaco component with a tab');
        }

        let theme = 'vs-dark';
        let model = null;

        if (monaco.editor.defineTheme !== undefined) {
            monaco.editor.defineTheme('web-ide', {
                base: theme,
                inherit: true,
                rules: []
            });
            theme = 'web-ide';
        }

        if (this.tab.editor !== null) {
            model = this.tab.editor.getModel();
        }

        this.tab.editor = monaco.editor.create(this.editorView.nativeElement, {
            value: this.initialCode,
            language: 'javascript',
            automaticLayout: true,
            theme: theme,
            scrollbar: {
                useShadows: false,
                verticalScrollbarSize: 7,
                horizontalScrollbarSize: 7
            },
            hideCursorInOverviewRuler: true,
            scrollBeyondLastLine: false
        });

        if (model !== null) {
            this.tab.editor.setModel(model);
        }
    }

    // tslint:disable-next-line:no-unused-locals
    public mayRun(): boolean {
        return this.webusbService.usb !== null &&
               this.tab.editor !== null &&
               this.tab.editor.getValue().length > 0 &&
               this.tab.runStatus !== OPERATION_STATUS.IN_PROGRESS &&
               this.webusbService.isConnected();
    }

    // tslint:disable-next-line:no-unused-locals
    public onRun() {
        this.tab.runStatus = OPERATION_STATUS.IN_PROGRESS;

        this.webusbService.run(this.tab.editor.getValue())
        .then((warning: string) => {
            this.tab.runStatus = OPERATION_STATUS.DONE;

            if (warning !== undefined) {
                this.onWarning.emit({
                    header: 'Running failed',
                    body: warning
                });
            }
        })
        .catch((error: DOMException) => {
            this.tab.runStatus = OPERATION_STATUS.NOT_STARTED;
            this.onError.emit({
                header: 'Running failed',
                body: error.message
            });
        });
    }

    // tslint:disable-next-line:no-unused-locals
    public onSave() {
        // Initialize filename to tab.title if filename was not previously
        // set and tab title is not pristine.
        if (this.filename.length === 0 &&
            !this.tab.title.match(/Tab # \d+/i)) {
            this.filename = this.tab.title;
        }

        $(this.saveModal.nativeElement).modal('show');
    }

    // tslint:disable-next-line:no-unused-locals
    public onSaveConfirm() {
        if (this.filename.length === 0) {
            return;
        }

        if (this.filename !== this.tab.title &&
            this.fileService.exists(this.filename)) {
            $(this.overwriteModal.nativeElement).modal('show');
        } else {
            this._doSave();
        }
    }

    // tslint:disable-next-line:no-unused-locals
    public onOverwrite() {
        this._doSave();
    }


    ///////////////////////////////////////////////////////////////////////////


    private _doSave() {
        this.fileService.save(this.filename, this.tab.editor.getValue(), true);
        this.tab.title = this.filename;
        $(this.overwriteModal.nativeElement).modal('hide');
        $(this.saveModal.nativeElement).modal('hide');
    }
}
