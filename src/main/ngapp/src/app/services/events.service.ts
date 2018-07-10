import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {VisEdges, VisNetworkOptions, VisNetworkService, VisNodes} from "ng2-vis";
import {ExampleNetworkData} from "../models/network-data.model";
import {Subscription} from "rxjs/internal/Subscription";

/* This Service will manage the events */

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  /* tabsSubject = new Subject<any[]>();

  tabsArray: any[] = ['' , 'in active']; */

  /* emitTabsSubject() {
        this.tabsSubject.next(this.tabsArray.slice());
        console.log(this.tabsArray);
    } */
  /*
  updateScheme() {
    this.myFormData = this.text.jsonSchema;
  } */

    public visNetwork = 'networkId1';
    private visNetworkData: ExampleNetworkData;
    public visNetworkOptions: VisNetworkOptions;



    visNetworkDataSubject = new Subject<ExampleNetworkData>();


    public modelLiveButton: any = {
        onColor: 'success',
        offColor: 'danger',
        onText: 'Live',
        offText: 'Off',
        disabled: false,
        size: '',
        value: true
    };

    public constructor(private visNetworkService: VisNetworkService) {

    }



    emitVisNetworkDataSubject() {
        this.visNetworkDataSubject.next(this.visNetworkData);
    }



    public addRule(): void {
        const newId = this.visNetworkData.nodes.getLength() + 1;
        this.visNetworkData.nodes.add({ id: newId.toString(), label: 'Rule ' + newId, group: 'rule' });

        console.log (this.visNetworkData.nodes.update([{id: 1, title : 'hello'}]));
        console.log (this.visNetworkData.nodes.get(1));
        this.visNetworkService.fit(this.visNetwork);
        this.emitVisNetworkDataSubject();
    }

    public addEdge(): void {
        this.visNetworkData.edges.add({from: '2', to: '3'});
        this.visNetworkService.fit(this.visNetwork);
    }

    public networkInitialized(): void {
        // now we can use the service to register on events
        this.visNetworkService.on(this.visNetwork, 'click');

        // open your console/dev tools to see the click params
        this.visNetworkService.click
            .subscribe((eventData: any[]) => {
                if (eventData[0] === this.visNetwork) {
                    console.log(eventData[1].nodes);
                }
            });
    }

    public reset(){

        this.destroy();
        this.networkInitialized();
        this.init();

        console.log(this.visNetworkData);
        this.visNetworkService.fit(this.visNetwork);
        this.visNetworkDataSubject.next(this.visNetworkData);
    }

    public init(): void {
        // (<any>$('#toggleId')).bootstrapToggle(); // This line allows us to use the data toggle property of bootstrap
        const nodes = new VisNodes([
            {id: 1, label : 'User', group : 'users', title : '42'},
            {id: 2, label: 'Rule', group: 'rule',title : '42'},
            {id: 3,  label: 'Fact Type', group: 'factType', title : '42'},
            {id: 4,  label: 'Fact Instance', group: 'factInstance'}, ]);


        const edges = new VisEdges([
            { from: '1', to: '3', dashes: 'true' },
            { from: '1', to: '2', arrows: 'to' },
            { from: '2', to: '4', group: 'test' },
            { from: '2', to: '5' }]);

        this.visNetworkData = {
            nodes,
            edges,
        };

        this.visNetworkOptions = {
            interaction: {hover: true},
            height: '90%',
            groups: {
                users: {
                    shape: 'icon',
                    icon: {
                        face: 'FontAwesome',
                        code: '\uf007',
                        size: 50,
                        color: '#aa00ff'
                    }
                },
                rule: {
                    shape: 'box',
                    color: '#f3ac5d',
                    value: 1,
                },
                factType: {
                    shape: 'box',
                    color: '#de5152',

                },
                factInstance: {
                    color : '#51c1db'
                },
                test: {
                    arrows: 'to',
                }
            },
            edges:{
                arrows: {
                    to:     {enabled: false, scaleFactor:1, type:'arrow'},
                    middle: {enabled: false, scaleFactor:1, type:'arrow'},
                    from:   {enabled: false, scaleFactor:1, type:'arrow'}
                },
                dashes: false,

            }
        };
        this.visNetworkDataSubject.next(this.visNetworkData);
    }

    public destroy(): void {
        this.visNetworkService.off(this.visNetwork, 'click');
    }


}
