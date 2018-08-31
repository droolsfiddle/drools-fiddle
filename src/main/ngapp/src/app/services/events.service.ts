import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {VisEdges, VisNetworkOptions, VisNetworkService, VisNodes} from "ng2-vis";
import {ExampleNetworkData} from "../models/network-data.model";

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
    public visNetworkOptions: VisNetworkOptions;
    public visualisationMessage: string = '';
    visualisationMessageSubject = new Subject<string>(); // We use a Subject to set the variable DrlCode Private
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
    private visNetworkData: ExampleNetworkData;

    public constructor(private visNetworkService: VisNetworkService) {

    }

    emitVisualisationMessageSubject() {
        this.visualisationMessageSubject.next(this.visualisationMessage);
    }


    emitVisNetworkDataSubject() {
        this.visNetworkDataSubject.next(this.visNetworkData);
    }


    public addRule(): void {
        const newId = this.visNetworkData.nodes.getLength() + 1;
        this.visNetworkData.nodes.add({id: newId.toString(), label: 'Rule ' + newId, group: 'rule'});
        this.visNetworkService.fit(this.visNetwork);
        this.emitVisNetworkDataSubject();
    }

    public addNode(node: any) {
        this.visNetworkData.nodes.add(node);
        this.visNetworkService.fit(this.visNetwork);
        this.emitVisNetworkDataSubject();
    }

    public addEdge(edge: any): void {
        this.visNetworkData.edges.add(edge);
        this.visNetworkService.fit(this.visNetwork);
        this.emitVisNetworkDataSubject();
    }

    public removeEdge(edgeId: any): void {
        this.visNetworkData.edges.remove(edgeId);
        this.visNetworkService.fit(this.visNetwork);
        this.emitVisNetworkDataSubject();
    }

    public removeNode(nodeId: any): void {
        this.visNetworkData.nodes.remove(nodeId);
        this.visNetworkService.fit(this.visNetwork);
        this.emitVisNetworkDataSubject();
    }

    public updateEdge(edge: any): void {
        this.visNetworkData.edges.update(edge);
        this.visNetworkService.fit(this.visNetwork);
        this.emitVisNetworkDataSubject();
    }

    public updateNode(node: any): void {
        this.visNetworkData.nodes.update(node);
        this.visNetworkService.fit(this.visNetwork);
        this.emitVisNetworkDataSubject();
    }

    public networkInitialized(): void {
        // now we can use the service to register on events
        this.visNetworkService.on(this.visNetwork, 'click');

        // open your console/dev tools to see the click params
        this.visNetworkService.click
            .subscribe((eventData: any[]) => {
                if (eventData[0] === this.visNetwork) {
                    if (this.visNetworkData.nodes.get(eventData[1].nodes)[0]) {
                        let label = this.visNetworkData.nodes.get(eventData[1].nodes)[0]['label'];
                        let title = this.visNetworkData.nodes.get(eventData[1].nodes)[0]['title'];
                        this.visualisationMessage = label + ' :\n' + title;
                        this.emitVisualisationMessageSubject();
                    }
                    else if (this.visNetworkData.edges.get(eventData[1].edges)[0]) {
                        let label = this.visNetworkData.edges.get(eventData[1].edges)[0]['label'];
                        let from = this.visNetworkData.nodes.get(this.visNetworkData.edges.get(eventData[1].edges)[0]['from'])['label'];
                        let to = this.visNetworkData.nodes.get(this.visNetworkData.edges.get(eventData[1].edges)[0]['to'])['label'];
                        this.visualisationMessage = 'Edge :' + label + '\n' + "from " + from + " to " + to;
                        this.emitVisualisationMessageSubject();
                    }
                }
            });
    }

    public reset() {

        const nodes = new VisNodes([
            /*{id: 1, label : 'User', group : 'users', title : '42'},
            {id: 2, label: 'Rule', group: 'rule',title : '42'},
            {id: 3,  label: 'Fact Type', group: 'factType', title : '42'},
            {id: 4,  label: 'Fact Instance', group: 'factInstance'}, ]); */
            {"id": 0, "label": "User", "group": "users", "title": "42"},]);
        /* {"id":"1151983785","title":"{\n  \"value\": 42\n}","group":"factInstance"},
        {"id":"Rule","label":"Rule","title":"{\n  \"name\": \"Rule\"\n}","group":"rule"},
        {"id":"Fact","label":"Fact","title":"[\n  {\n    \"id\": 0,\n    \"name\": \"value\",\n    \"type\": \"int\",\n    \"enumValues\": null\n  }\n]","group":"factType"},]); */

        const edges = new VisEdges([
            /*{ from: '1', to: '3', dashes: 'true' },
            { from: '1', to: '2', arrows: 'to' },
            { from: '2', to: '4', group: 'test' },
            { from: '2', to: '5' }]); */
            /* {"id":"Fact-1151983785","from":"Fact","to":"1151983785","dashes":true},
            {"id":"0-1151983785","from":0,"to":"1151983785","arrows":"to","label":1},
            {"id":"1151983785-Rule","from":"1151983785","to":"Rule","arrows":"to","color":"purple","label":2},]); */
            //{"id":"Rule-1151983785","from":"Rule","to":"1151983785","arrows":"to","label":3},])
        ]);

        this.visNetworkData = {
            nodes,
            edges,
        };
        this.visNetworkService.fit(this.visNetwork);
        this.visNetworkDataSubject.next(this.visNetworkData);
    }

    public init(): void {
        // (<any>$('#toggleId')).bootstrapToggle(); // This line allows us to use the data toggle property of bootstrap
        const nodes = new VisNodes([
            /*{id: 1, label : 'User', group : 'users', title : '42'},
            {id: 2, label: 'Rule', group: 'rule',title : '42'},
            {id: 3,  label: 'Fact Type', group: 'factType', title : '42'},
            {id: 4,  label: 'Fact Instance', group: 'factInstance'}, ]);*/
            {"id": 0, "label": "User", "group": "users", "title": "42"},]);
        /* {"id":"1151983785","title":"{\n  \"value\": 42\n}","group":"factInstance"},
        {"id":"Rule","label":"Rule","title":"{\n  \"name\": \"Rule\"\n}","group":"rule"},
        {"id":"Fact","label":"Fact","title":"[\n  {\n    \"id\": 0,\n    \"name\": \"value\",\n    \"type\": \"int\",\n    \"enumValues\": null\n  }\n]","group":"factType"},]); */

        const edges = new VisEdges([
            /*{ from: '1', to: '3' },
            { from: '1', to: '2' }, */
            /*{ from: '2', to: '4', group: 'test' },
            { from: '2', to: '5', label: 'testing' }*/
            /* {"id":"Fact-1151983785","from":"Fact","to":"1151983785","dashes":true},
            {"id":"0-1151983785","from":0,"to":"1151983785","arrows":"to","label":1},
            {"id":"1151983785-Rule","from":"1151983785","to":"Rule","arrows":"to","color":"purple","label":2},]); */
            //{"id":"Rule-1151983785","from":"Rule","to":"1151983785","arrows":"to","label":3},])
        ]);

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
                    color: '#51c1db'
                },
                test: {
                    arrows: 'to',
                    label: 'test'
                }
            },
            edges: {
                arrows: {
                    to: {enabled: false, scaleFactor: 1, type: 'arrow'},
                    middle: {enabled: false, scaleFactor: 1, type: 'arrow'},
                    from: {enabled: false, scaleFactor: 1, type: 'arrow'}
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
