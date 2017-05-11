import { Component } from '@angular/core';

import { WebUsbService } from '../webusb/webusb.service';


/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css'],
})
export class NavbarComponent {
    constructor(public webusbService: WebUsbService) {}
}
