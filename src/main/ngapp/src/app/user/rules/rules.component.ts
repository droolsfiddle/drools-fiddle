import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DRLService} from '../../services/drl.service';
import {Subscription} from 'rxjs';

/* This Component Displays the Rules. It uses the ace editor library for Angular 6.
You can check how to install it here : https://github.com/fxmontigny/ng2-ace-editor */

@Component({
    selector: 'app-rules',
    templateUrl: './rules.component.html',
    styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit, OnDestroy {

    textDRL: string;
    DrlCodeSubscription: Subscription;
    options: any = {animatedScroll: true, maxLines: 1000, printMargin: false};


    constructor(private drlService: DRLService) {
    }

    ngOnInit() {
        this.DrlCodeSubscription = this.drlService.DrlCodeSubject.subscribe(
            (DrlCode: string) => {
                this.textDRL = DrlCode;
            }
        );
        this.drlService.emitDrlCodeSubject();
    }


    onChange(code) {
        this.drlService.changeDrlCode(code);

    }

    ngOnDestroy() {
        this.DrlCodeSubscription.unsubscribe();
    }
}
