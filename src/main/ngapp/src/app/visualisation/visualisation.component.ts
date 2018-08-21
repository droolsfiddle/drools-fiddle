import {Component, OnInit, OnDestroy} from '@angular/core';
import {
    VisNode,
    VisNodes,
    VisEdges,
    VisNetworkService,
    VisNetworkData,
    VisNetworkOptions
} from 'ng2-vis';
import {EventsService} from "../services/events.service";
import {Subscription} from "rxjs/index";
import {ExampleNetworkData} from "../models/network-data.model";


@Component({
    selector: 'app-visualisation',
    templateUrl: './visualisation.component.html',
    styleUrls: ['./visualisation.component.scss']
})
export class VisualisationComponent implements OnInit, OnDestroy {

    public visNetwork = this.eventsService.visNetwork;
    public visNetworkDataSubscription: Subscription;
    public visNetworkData: ExampleNetworkData;
    public visNetworkOptions: VisNetworkOptions;

    public visualisationMessage: string = '';
    visualisationMessageSubscription: Subscription;


    public constructor(private eventsService: EventsService) {
    }


    public ngOnInit(): void {
        // (<any>$('#toggleId')).bootstrapToggle(); // This line allows us to use the data toggle property of bootst
        this.eventsService.init();

        this.visNetworkDataSubscription = this.eventsService.visNetworkDataSubject.subscribe(
            (visNetworkData: ExampleNetworkData) => {
                this.visNetworkData = visNetworkData;
            }
        );
        this.eventsService.emitVisNetworkDataSubject();

        this.visNetworkOptions = this.eventsService.visNetworkOptions

        this.visualisationMessageSubscription = this.eventsService.visualisationMessageSubject.subscribe(
            (visualisationMessage: string) => {
                this.visualisationMessage = visualisationMessage;
            }
        );
        this.eventsService.emitVisualisationMessageSubject();

    }

    public networkInitialized() {
        this.eventsService.networkInitialized();
    }

    public addRule() {
        this.eventsService.addRule();

    }


    public ngOnDestroy(): void {
        this.eventsService.destroy();
        this.visNetworkDataSubscription.unsubscribe();
        this.visualisationMessageSubscription.unsubscribe();
    }
}
