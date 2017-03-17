import { Injectable } from '@angular/core';
import { TestBed, inject } from '@angular/core/testing';

import { ExampleService } from './example.service';


export function main() {
    describe('Example Service', () => {
        let service: ExampleService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [
                    ExampleService
                ]
            });
        });

        beforeEach(inject([ExampleService], (exampleService: ExampleService) => {
            service = exampleService;
        }));

        it('core functions are defined', () => {
            expect(service.count).toBeDefined();
            expect(service.ls).toBeDefined();
            expect(service.load).toBeDefined();
        });
    });
}
