import { Component } from '@angular/core';

import { AppDataService } from '../../app.data.service';


/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-footer',
  templateUrl: 'footer.component.html',
  styleUrls: ['footer.component.css'],
})

export class FooterComponent {
    public buttons: Array<any>;

    public constructor(private _appDataService: AppDataService) {
        this.buttons = this._appDataService.footerButtons;
    }
}
