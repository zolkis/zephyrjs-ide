// Angular
import { Component, Injectable } from '@angular/core';
import {
    async,
    TestBed
} from '@angular/core/testing';

// Third party
import { LocalStorageService } from 'angular-2-local-storage';

// This app
import { DeviceToolbarModule } from './device-toolbar.module';


@Injectable()
class MockLocalStorageService {
    public exists(filename: string): boolean {
        return false;
    }

    public save(filename: string, content: string) {
        // tslint:disable-next-line:no-empty
    }
}


export function main() {
    describe('Device Toolbar component', () => {

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestComponent],
                imports: [DeviceToolbarModule],
                providers: [
                    {
                        provide: LocalStorageService,
                        useClass: MockLocalStorageService
                    }
                ]

            });
        });

        it('should compile', done => {
            TestBed.compileComponents().then(() => done());
        });
    });
}

@Component({
    selector: 'test-cmp',
    template: '<sd-device-toolbar></sd-device-toolbar>'
})
class TestComponent {}
