import {Component, OnInit} from '@angular/core';
import {EventsService} from '../../services/events.service';
import {Location} from "@angular/common";

/* This component displays what we call the user part of the app
it is the part that includes the Rules and the facts. */

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
    /* tabsSubscription: Subscription;
    activeArray: any[]; */

    constructor() {
    }


    ngOnInit() {
    }

}
