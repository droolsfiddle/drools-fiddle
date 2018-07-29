import {VisEdges, VisNetworkData, VisNodes} from 'ng2-vis';

export class ExampleNetworkData implements VisNetworkData {
  constructor(public nodes: VisNodes, public edges: VisEdges) {
  }
}
