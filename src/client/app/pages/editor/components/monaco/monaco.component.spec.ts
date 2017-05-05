// Core
import { Component } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';

// Third party
import {
    LocalStorageModule, LocalStorageService
} from 'angular-2-local-storage';

// Own
import { AppDataService } from '../../../../app.data.service';
import { EditorTab } from '../../editor.tab';
import { MonacoModule } from './monaco.module';
import { MonacoComponent } from './monaco.component';


export function main() {
    describe('Monaco component', () => {
        let tab: EditorTab = {
            id: 1,
            active: true,
            title: 'Tab # 1',
            editor: null,
            port: null,
            term: null
        };

        let loadMonaco = (component: MonacoComponent): Promise<void> => {
            return new Promise<void>(resolve => {
                let onGotAmdLoader = () => {
                    (<any>window).require.config({
                        paths: {
                            'vs': 'base/node_modules/monaco-editor/min/vs'
                        }
                    });
                    (<any>window).require(['vs/editor/editor.main'], () => {
                        component.initMonaco();
                        resolve();
                    });
                };

                if (!(<any>window).require) {
                    let loaderScript = document.createElement('script');
                    loaderScript.type = 'text/javascript';
                    loaderScript.src = 'base/node_modules/monaco-editor/min/vs/loader.js';
                    loaderScript.addEventListener('load', onGotAmdLoader);
                    document.body.appendChild(loaderScript);
                } else {
                    onGotAmdLoader();
                }
            });
        };

        beforeEach(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

            TestBed.configureTestingModule({
                declarations: [TestComponent],
                providers: [
                    AppDataService,
                    LocalStorageService,
                ],
                imports: [
                    LocalStorageModule.withConfig({
                        prefix: 'zephyrjs-ide-test',
                        storageType: 'localStorage'
                    }),

                    MonacoModule
                ]
            });
        });

        it('should build', async(() => {
            TestBed.compileComponents().then(() => {
                let fixture = TestBed.createComponent(TestComponent);
                let el = fixture.debugElement.children[0].nativeElement;
                expect(el).toBeTruthy();
            });
        }));

        it('should create monaco editor', done => {
            TestBed.compileComponents().then(() => {
                const fixture = TestBed.createComponent(MonacoComponent);
                let component = fixture.componentInstance;
                component.tab = tab;

                loadMonaco(component).then(() => {
                    expect(component.tab.editor).not.toBeNull();
                    done();
                });
            });
        });

        it('reinstantiating preserves contents', done => {
            TestBed.compileComponents().then(() => {
                const fixture = TestBed.createComponent(MonacoComponent);
                let component = fixture.componentInstance;
                component.tab = tab;

                loadMonaco(component).then(() => {
                    component.tab.editor.setValue('test content');
                    expect(component.tab.editor.getValue()).toBe('test content');

                    const fixture2 = TestBed.createComponent(MonacoComponent);
                    let component2 = fixture2.componentInstance;

                    component2.tab = tab;

                    loadMonaco(component2).then(() => {
                        expect(component2.tab.editor.getValue()).toBe('test content');
                        done();
                    });
                });
            });
        });
    });
}

@Component({
    selector: 'test-cmp',
    template: '<sd-monaco></sd-monaco>'
})
class TestComponent { }
