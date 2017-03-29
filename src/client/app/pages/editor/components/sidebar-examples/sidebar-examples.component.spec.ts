import { Component } from '@angular/core';
import {
  async,
  TestBed
} from '@angular/core/testing';

import { SidebarExamplesModule } from './sidebar-examples.module';


export function main() {
   describe('SidebarExamples component', () => {

    beforeEach(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

      TestBed.configureTestingModule({
        declarations: [TestComponent],
        imports: [SidebarExamplesModule]
      });
    });

    it('should work',
      async(() => {
        TestBed.compileComponents().then(() => {
            let fixture = TestBed.createComponent(TestComponent);
            expect(fixture).not.toBe(null);
          });
        }));
    });
}

@Component({
  selector: 'test-cmp',
  template: '<sd-sidebar-examples></sd-sidebar-examples>'
})
class TestComponent { }
