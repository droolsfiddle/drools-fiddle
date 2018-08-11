import {VisEdges, VisNetworkData, VisNodes} from 'ngx-vis';

export class ExampleNetworkData implements VisNetworkData {
    constructor(public nodes: VisNodes, public edges: VisEdges) {
    }
}
