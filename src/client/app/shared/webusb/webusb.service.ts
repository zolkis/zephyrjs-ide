import { Injectable } from '@angular/core';
import { WebUsbPort } from './webusb.port';

/**
 * This class provides the WebUsb service.
 */
@Injectable()
export class WebUsbService {
    public usb: any = null;
    public port: WebUsbPort = null;

    constructor() {
        this.usb = (navigator as any).usb;
    }

    public onReceive(data: string) {
        // tslint:disable-next-line:no-empty
    }

    public onReceiveError(error: DOMException) {
        // tslint:disable-next-line:no-empty
    }

    public requestPort(): Promise<WebUsbPort> {
        return new Promise<WebUsbPort>((resolve, reject) => {
            const filters = [{
                'vendorId': 0x8086,
                'productId': 0xF8A1
            }];

            if (this.usb === undefined) {
                reject('WebUSB not available');
            }

            this.usb.requestDevice({'filters': filters})
            .then((device: any) => {
                resolve(new WebUsbPort(device));
            })
            .catch((error: string) => {
                reject(error);
            });
        });
    }

    public connect(): Promise<void> {
        let _doConnect = (): Promise<void> => {
            return this.port.connect().then(() => {
                this.port.onReceive = (data: string) => {
                    this.onReceive(data);
                };

                this.port.onReceiveError = (error: DOMException) => {
                    this.onReceiveError(error);
                };
            });
        };

        if (this.port !== null) {
            return _doConnect();
        }

        return new Promise<void>((resolve, reject) => {
            this.requestPort()
            .then((p: WebUsbPort) => {
                this.port = p;
                _doConnect()
                .then(() => resolve())
                .catch((error: DOMException) => reject(error));
            })
            .catch((error: DOMException) => reject(error));
        });
    }

    public disconnect(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.port === null) {
                resolve();
            } else {
                this.port.disconnect()
                .then(() => {
                    this.port = null;
                    resolve();
                })
                .catch((error: DOMException) => {
                    this.port = null;
                    reject(error);
                });
            }
        });
    }

    public isConnected(): boolean {
        return this.port && this.port.isConnected();
    }

    public send(data: string) {
        return this.port.send(data);
    }

    public run(data: string) {
        return this.port.run(data);
    }
}
