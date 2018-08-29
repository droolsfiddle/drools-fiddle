import {Component, OnDestroy, OnInit} from '@angular/core';
import {DRLService} from '../services/drl.service';
import {EventsService} from '../services/events.service';
import {Subscription} from 'rxjs';
import {StepFunctionsService} from "../services/step-functions.service";
import {SocketService} from "../services/socket.service";


/*  This component is the Header, it displays the navbar on the top.
 The app uses here the Bootstrap 3.3.7 framework */

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {
    public model = this.eventService.modelLiveButton;
    fireDisableSubscription: Subscription;
    fireDisable = true;

    stepSubscription: Subscription;
    step = 0;

    totalStepSubscription: Subscription;
    totalStep = 0;


    /* dataTarget: string; */



    constructor(private drlService: DRLService, private eventService: EventsService, private stepFunctionService: StepFunctionsService, private socketService: SocketService ) {}


    ngOnInit() {
        this.fireDisableSubscription = this.drlService.hasCompiledSubject.subscribe(
            (hasCompile: boolean) => {
                this.fireDisable = hasCompile;
            }
        );
        this.drlService.emitHasCompiledSubject();

        this.stepSubscription = this.stepFunctionService.stepSubject.subscribe(
            (step: number) => {
                this.step = step;
            }
        );
        this.stepFunctionService.emitStepSubject();

        this.totalStepSubscription = this.stepFunctionService.totalStepSubject.subscribe(
            (totalStep: number) => {
                this.totalStep = totalStep;
            }
        );
        this.stepFunctionService.emitTotalStepSubject();
    }

    actualiseStep() {
        if (this.model['value']) {
            this.nextEnd();
        }
    }

    compileDrl() {
        this.drlService.compile();
        this.stepFunctionService.totalReset();
    }

    fireDrl() {

        this.drlService.fire();
    }

    saveDrl() {
        this.drlService.saveAndCompile();
        this.stepFunctionService.totalReset();
    }

    ngOnDestroy() {
        this.fireDisableSubscription.unsubscribe();
        this.totalStepSubscription.unsubscribe();
        this.stepSubscription.unsubscribe();
    }

    next() {
        this.stepFunctionService.next();
    }

    nextEnd() {
        this.stepFunctionService.nextEnd();
    }

    previousBegin() {
        this.stepFunctionService.previousBegin();
    }

    previous() {
        this.stepFunctionService.previous();

    }

}
