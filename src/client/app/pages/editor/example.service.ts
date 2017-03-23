import { Injectable } from '@angular/core';


@Injectable()
export class ExampleService {
    private _examples = [
        {
            filename: 'Arduino Blink',
            code:
`// Copyright (c) 2016, Intel Corporation.

// Reimplementation of Arduino - Basics - Blink example
//   - Toggles an onboard LED on and off every second

// Hardware Requirements:
//   - None, to use the onboard LED
//   - Otherwise, an LED and a resistor
// Wiring:
//   For an external LED:
//     - Wire its long lead to the IO pin you choose below
//     - Wire its short lead to one end of a resistor
//     - Wire the other end of the resistor to Arduino GND
// Note: For a completely safe resistor size, find the LED's actual forward
//   voltage (or lowest reported), subtract from 3.3V, and divide by the
//   desired current. For example:
//     (3.3V - 1.8V) / 20 mA = 1.5 V / 0.02 A = 75 Ohms.
//   Larger resistors will make the LED dimmer. Smaller ones could reduce its
//     life.

console.log("Starting Blink example...");

// import gpio module
var gpio = require("gpio");
var pins = require("arduino101_pins");

// pin 8 is one of the onboard LEDs on the Arduino 101
// 'out' direction is default, could be left out
var pin = gpio.open({
    pin: pins.LED0,
    direction: 'out'
});

// remember the current state of the LED
var toggle = false;

// schedule a function to run every 1s (1000ms)
setInterval(function () {
    toggle = !toggle;
    pin.write(toggle);
}, 1000);`
        },
        {
            filename: 'Arduino Traffic Light',
            code:
`// Copyright (c) 2016, Intel Corporation.

// Reimplementation of Arduino - Basics - Blink example
//   - Toggles onboard LEDs as if they were a traffic light

// Hardware Requirements:
//   - None, to use the onboard LED
//   - Otherwise, three LEDs and resistors
// Wiring:
//   For an external LED:
//     - Wire its long lead to the IO pin you choose below
//     - Wire its short lead to one end of a resistor
//     - Wire the other end of the resistor to Arduino GND
// Note: For a completely safe resistor size, find the LED's actual forward
//   voltage (or lowest reported), subtract from 3.3V, and divide by the
//   desired current. For example:
//     (3.3V - 1.8V) / 20 mA = 1.5 V / 0.02 A = 75 Ohms.
//   Larger resistors will make the LED dimmer. Smaller ones could reduce its
//     life.

console.log("Starting TrafficLight example...");

// WARNING: These traffic light timings are appropriate for hummingbirds only

// import gpio module
var gpio = require("gpio");
var pins = require("arduino101_pins");

var red    = gpio.open({pin: pins.LED2, direction: 'out', activeLow: true});
var yellow = gpio.open({pin: pins.LED1, direction: 'out', activeLow: true});
var green  = gpio.open({pin: pins.LED0, direction: 'out', activeLow: false});

var elapsed = 0;

// turn red light on first
red.write(true);
yellow.write(false);
green.write(false);

// schedule a function to run every 1s (1000ms)
setInterval(function () {
    elapsed++;
    if (elapsed == 5) {
        // switch to green after 5s
        red.write(false);
        green.write(true);
    } else if (elapsed == 8) {
        // switch to yellow after 3s
        green.write(false);
        yellow.write(true);
    } else if (elapsed == 10) {
        // switch to red after 2s
        yellow.write(false);
        red.write(true);
        elapsed = 0;
    }
}, 1000);`
        }
    ];

    public exists(filename: string): boolean {
        return this.load(filename) !== null;
    }

    public load(filename: string): string {
        for (let i of this._examples) {
            if (i.filename === filename) {
                return i.code;
            }
        }

        return null;
    }

    public ls(): Array<string> {
        let filenames: Array<string> = [];
        for (let i of this._examples) {
            filenames.push(i.filename);
        }

        return filenames;
    }

    public count(): number {
        return this.ls().length;
    }
}
