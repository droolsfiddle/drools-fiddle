import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs/index";
import {EventsService} from "../../services/events.service";
import {DRLService} from "../../services/drl.service";

@Component({
    selector: 'app-copy-button',
    templateUrl: './copy-button.component.html',
    styleUrls: ['./copy-button.component.scss']
})
export class CopyButtonComponent implements OnInit, OnDestroy {

    textSubscription: Subscription;
    text: string = window.location.href;
    isCopied1: boolean;

    constructor(private drlService: DRLService) {
    }

    ngOnInit() {
        this.textSubscription = this.drlService.UrlSubject.subscribe(
            (UrlText: string) => {
                this.text = UrlText;
            }
        );
    }

    ngOnDestroy() {
        this.textSubscription.unsubscribe();
    }

}
