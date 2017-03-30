import { Injectable } from '@angular/core';


// We mask the 'require' keyword in the examples because Karma parses those,
// ignoring the fact that they're just hardcoded strings, and split out errors
// about missing modules.
const REQUIRE: string = 'require';


@Injectable()
export class ExampleService {
    private _examples = [
        {
            filename: 'Accelerometer',
            code:
`// Copyright (c) 2016, Intel Corporation.

// Test code to use the Accelerometer (subclass of Generic Sensor) API
// to communicate with the BMI160 inertia sensor on the Arduino 101
// and obtaining information about acceleration applied to the X, Y and Z axis
console.log("Accelerometer test...");

var updateFrequency = 20 // maximum is 100Hz, but in ashell maximum is 20Hz

var sensor = new Accelerometer({
    includeGravity: false, // true is not supported, will throw error
    frequency: updateFrequency
});

sensor.onchange = function() {
    console.log("acceleration (m/s^2): " +
                " x=" + sensor.x +
                " y=" + sensor.y +
                " z=" + sensor.z);
};

sensor.onstatechange = function(event) {
    console.log("state: " + event);
};

sensor.onerror = function(event) {
    console.log("error: " + event.error.name +
                " - " + event.error.message);
};

sensor.start();`
        },
        {
            filename: 'BLE',
            code:
`// Copyright (c) 2016, Intel Corporation.

// Register a BLE echo service that expose read/write capabilities
// write will allow client to send bytes to be stored
// read will allow client to read back the stored value, or 0 if not found

var ble = ` + REQUIRE + ` ("ble");

var deviceName = 'BLE Test';

var echoValue = new Buffer(1);
echoValue.writeUInt8(0);

ble.on('stateChange', function(state) {
    if (state === 'poweredOn') {
        ble.startAdvertising(deviceName, ['ab00']);
    }
});

ble.on('accept', function(clientAddress) {
    console.log("Accepted Connection: " + clientAddress);
    ble.updateRssi();
});

ble.on('disconnect', function(clientAddress) {
    console.log("Disconnected Connection: " + clientAddress);
});

ble.on('rssiUpdate', function(rssi) {
    console.log("RSSI value: " + rssi + "dBm");
});

ble.on('advertisingStart', function(error) {
    if (error) {
        console.log("Advertising start error: " + error);
        return;
    }

    ble.setServices([
        new ble.PrimaryService({
            uuid: 'ab00',
            characteristics: [
                new ble.Characteristic({
                    uuid: 'ab01',
                    properties: ['read', 'write'],
                    descriptors: [
                        new ble.Descriptor({
                            uuid: '2901',
                            value: 'Echo'
                        })
                    ],
                    onReadRequest: function(offset, callback) {
                        console.log("Read value: " + echoValue.toString('hex'));
                        callback(this.RESULT_SUCCESS, echoValue);
                    },
                    onWriteRequest: function(data, offset, withoutResponse,
                                             callback) {
                        console.log("Write value: " + data.toString('hex'));
                        echoValue = data;
                        callback(this.RESULT_SUCCESS);
                    }
                })
            ]
        })
    ], function(error) {
        if (error) {
            console.log("Set services error: " + error);
        }
    });
});

console.log("BLE sample...");`
        },
        {
            filename: 'Blink',
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
var gpio = ` + REQUIRE + `("gpio");
var pins = ` + REQUIRE + `("arduino101_pins");

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
            filename: 'Gyroscope',
            code:
`// Copyright (c) 2016-2017, Intel Corporation.

// Test code to use the Gyroscope (subclass of Generic Sensor) API
// to communicate with the BMI160 inertia sensor on the Arduino 101
// and monitor the rate of rotation around the the X, Y and Z axis
console.log("Gyroscope test...");

var updateFrequency = 20 // maximum is 100Hz, but in ashell maximum is 20Hz

var sensor = new Gyroscope({
    frequency: updateFrequency
});

sensor.onchange = function() {
    console.log("rotation (rad/s): " +
                " x=" + sensor.x +
                " y=" + sensor.y +
                " z=" + sensor.z);
};

sensor.onstatechange = function(event) {
    console.log("state: " + event);
};

sensor.onerror = function(event) {
    console.log("error: " + event.error.name +
                " - " + event.error.message);
};

sensor.start();`
        },
        {
            filename: 'Traffic Light',
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
var gpio = ` + REQUIRE + `("gpio");
var pins = ` + REQUIRE + `("arduino101_pins");

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
