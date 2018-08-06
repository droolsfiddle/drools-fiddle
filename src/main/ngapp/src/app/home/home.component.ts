import {Component, OnInit} from '@angular/core';

/* This Component is the home page, it shows the structure of the home page
 Thanks to this structure it would be possible to implement more pages */

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

}
