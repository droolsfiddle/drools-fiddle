import { Component, OnInit , OnDestroy} from '@angular/core';
import {
  VisNode,
  VisNodes,
  VisEdges,
  VisNetworkService,
  VisNetworkData,
  VisNetworkOptions } from 'ng2-vis';
import {ExampleNetworkData} from '../models/network-data.model';


@Component({
  selector: 'app-visualisation',
  templateUrl: './visualisation.component.html',
  styleUrls: ['./visualisation.component.scss']
})
export class VisualisationComponent implements OnInit, OnDestroy {

  public visNetwork = 'networkId1';
  public visNetworkData: ExampleNetworkData;
  public visNetworkOptions: VisNetworkOptions;

  public constructor(private visNetworkService: VisNetworkService) { }

  public addNode(): void {
    const newId = this.visNetworkData.nodes.getLength() + 1;
    this.visNetworkData.nodes.add({ id: newId.toString(), label: 'Node ' + newId });
    this.visNetworkService.fit(this.visNetwork);
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

  public ngOnInit(): void {
     // (<any>$('#toggleId')).bootstrapToggle(); // This line allows us to use the data toggle property of bootstrap
    const nodes = new VisNodes([
        {id: '1', label : 'User', group : 'users', title : '42'},
        {id: 2, label: 'Rule', group: 'rule'},
        {id: 3,  label: 'Fact Type', group: 'factType'},
        {id: 4,  label: 'Fact Instance', group: 'factInstance'}, ])


    const edges = new VisEdges([
      { from: '1', to: '3' },
      { from: '1', to: '2' },
      { from: '2', to: '4' },
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
            }
        }
    };
  }

  public ngOnDestroy(): void {
    this.visNetworkService.off(this.visNetwork, 'click');
  }
}
