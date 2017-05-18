import { APP_BASE_HREF } from '@angular/common';
import { Component } from '@angular/core';
import { async } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { LocalStorageModule } from 'angular-2-local-storage';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { SidebarModule } from 'ng-sidebar/lib/sidebar.module';
import { SplitPaneModule } from 'ng2-split-pane/lib/ng2-split-pane';

// Main app component
import { AppComponent } from './app.component';

// Pages
import { HomeModule } from './pages/home/home.module';
import { AboutModule } from './pages/about/about.module';
import { EditorModule } from './pages/editor/editor.module';

import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { EditorComponent } from './pages/editor/editor.component';

// Shared
import { SharedModule } from './shared/shared.module';
import { WebUsbService } from './shared/index';


export function main() {
    describe('App component', () => {
        let config: Route[] = [
            { path: '', component: HomeComponent },
            { path: 'about', component: AboutComponent },
            { path: 'editor', component: EditorComponent }
        ];

        beforeEach(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

            TestBed.configureTestingModule({
                imports: [
                    FormsModule,
                    RouterTestingModule.withRoutes(config),
                    Angular2FontawesomeModule,
                    LocalStorageModule,
                    SimpleNotificationsModule,
                    SidebarModule,
                    SplitPaneModule,

                    HomeModule,
                    AboutModule,
                    EditorModule,
                    SharedModule
                ],
                declarations: [
                    TestComponent,
                    AppComponent
                ],
                providers: [
                    { provide: APP_BASE_HREF, useValue: '/' },
                    WebUsbService
                ]
            });
        });

        it('should build without a problem', async(() => {
            TestBed.compileComponents().then(() => {
                let fixture = TestBed.createComponent(TestComponent);
                let compiled = fixture.nativeElement;
                expect(compiled).toBeTruthy();
            });
        }));

        it('route id should be set on element', async(() => {
            TestBed.compileComponents().then(() => {
                let fixture = TestBed.createComponent(TestComponent);
                let el = fixture.debugElement.children[0].nativeElement;

                fixture.detectChanges();
                TestBed.get(Router).navigate(['/']).then(() => {
                    fixture.detectChanges();
                    expect(el.id).toEqual('home-route');
                });
            });
        }));
    });
}

@Component({
    selector: 'test-cmp',
    template: '<sd-app></sd-app>'
})
class TestComponent { }
