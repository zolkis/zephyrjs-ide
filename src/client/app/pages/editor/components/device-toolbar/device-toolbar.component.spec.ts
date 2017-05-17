// Angular
import { Component } from '@angular/core';
import {
    async,
    TestBed
} from '@angular/core/testing';

// This app
import { DeviceToolbarModule } from './device-toolbar.module';


export function main() {
    describe('Device Toolbar component', () => {

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestComponent],
                imports: [DeviceToolbarModule]
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
