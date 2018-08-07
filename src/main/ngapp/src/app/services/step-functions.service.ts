import {Injectable} from '@angular/core';
import {Subscription} from "rxjs/internal/Subscription";
import {EventsService} from "./events.service";
import {Subject} from "rxjs";
import {ExampleNetworkData} from "../models/network-data.model";

@Injectable({
    providedIn: 'root'
})
export class StepFunctionsService {

    public queue = [];
    stepSubject = new Subject<number>(); // We use a Subject to subscribe to it in real time
    totalStepSubject = new Subject<number>(); // We use a Subject to subscribe to it in real time
    public visNetworkDataSubscription: Subscription;
    public visNetworkData: ExampleNetworkData;
    private step = -1;
    private totalStep = 0;
    private edgeStep = 0;
    private factInstanceStep = 1;

    /*
    actionHandle = {
        "insert-fact": this.addFactInstance,
        "insert-fact-type": this.addFactType,
        "insert-rule": this.addRule,
        "update-fact": this.updateFactInstance,
        "delete-fact": this.removeFactInstance,
        "fire": this.fire
    };

    nextHandle = {
        "insert-fact": this.nextFI,
        "insert-fact-type": this.nextFT,
        "insert-rule": this.nextR,
        "update-fact": this.nextUFI,
        "delete-fact": this.nextRFI,
        "fire": this.nextF
    };

    previousHandle = {
        "insert-fact": this.nextFIR,
        "insert-fact-type": this.nextFTR,
        "insert-rule": this.nextRR,
        "update-fact": this.nextUFIR,
        "delete-fact": this.nextRFIR,
        "fire": this.nextFR
    };*/

    constructor(private eventsService: EventsService) {

        this.visNetworkDataSubscription = this.eventsService.visNetworkDataSubject.subscribe(
            (visNetworkData: ExampleNetworkData) => {
                this.visNetworkData = visNetworkData;
            }
        );
        this.eventsService.emitVisNetworkDataSubject();
    }

    emitStepSubject() {
        this.stepSubject.next(this.step);
    }

    emitTotalStepSubject() {
        this.totalStepSubject.next(this.totalStep);
    }

    public totalReset() {
        this.eventsService.reset();
        this.queue = [];
        this.step = -1;
        this.totalStep = this.queue.length;
        this.edgeStep = 0;
        this.factInstanceStep = 1;
        this.emitStepSubject();
        this.emitTotalStepSubject();
    }

    public stepTotalUp() {
        this.step++;
        this.totalStep++;
        this.emitStepSubject();
        this.emitTotalStepSubject();
    }

    public stepUp() {
        this.step++;
        this.emitStepSubject();

    }

    public stepDown() {
        this.step--;
        this.emitStepSubject();

    }

    public nodeAdd(node) {
        this.eventsService.addNode(node);
    }


    public edgeAdd(edge: any) {
        this.eventsService.addEdge(edge);
    }

    public removeEdge(edgeId: any) {
        this.eventsService.removeEdge(edgeId);
    }

    public removeNode(nodeId: any) {
        this.eventsService.removeNode(nodeId);
    }

    public updateEdge(edge: any) {
        this.eventsService.updateEdge(edge);
    }

    public updateNode(node: any) {
        this.eventsService.updateNode(node);
    }


    /* _____________________________________ HANDLE SWITCH ___________________*/
    actionHandle(action, data) {
        switch (action) {
            case "insert-fact": {
                this.addFactInstance(data);
                break;
            }
            case "insert-fact-type": {
                this.addFactType(data);
                break;
            }
            case "insert-rule": {
                this.addRule(data);
                break;
            }
            case "update-fact": {
                this.updateFactInstance(data);
                break;
            }
            case "delete-fact": {
                this.removeFactInstance(data);
                break;
            }
            case "fire": {
                this.fire(data);
                break;
            }
            default: {
                console.log('Invalid DATA');
                break;
            }
        }
    }

    nextHandle(action, data1, data2) {
        switch (action) {
            case "insert-fact": {
                this.nextFI(data1, data2);
                break;
            }
            case "insert-fact-type": {
                this.nextFT(data1, data2);
                break;
            }
            case "insert-rule": {
                this.nextR(data1, data2);
                break;
            }
            case "update-fact": {
                this.nextUFI(data1, data2);
                break;
            }
            case "delete-fact": {
                this.nextRFI(data1, data2);
                break;
            }
            case "fire": {
                this.nextF(data1, data2);
                break;
            }
            default: {
                console.log('Invalid DATA');
                break;
            }
        }
    }

    previousHandle(action, data1, data2) {
        switch (action) {
            case "insert-fact": {
                this.nextFIR(data1, data2);
                break;
            }
            case "insert-fact-type": {
                this.nextFTR(data1, data2);
                break;
            }
            case "insert-rule": {
                this.nextRR(data1, data2);
                break;
            }
            case "update-fact": {
                this.nextUFIR(data1, data2);
                break;
            }
            case "delete-fact": {
                this.nextRFIR(data1, data2);
                break;
            }
            case "fire": {
                this.nextFR(data1, data2);
                break;
            }
            default: {
                console.log('Invalid DATA');
                break;
            }
        }
    }

    /* ------------------------ EVENTS  S ------------------- */

    public addFactInstance(data) {
        const event = {'action': 'insert-fact', 'before': {}, 'after': data};
        this.queue.push(event);
        this.totalStep = this.queue.length;
        this.emitTotalStepSubject();
        if (this.eventsService.modelLiveButton['value']) {
            this.nextFI({}, data);
            this.stepUp();
        }
    }


    public updateFactInstance(data) {
        const node = this.visNetworkData.nodes.get(data.id);
        const event = {'action': 'update-fact', 'before': node, 'after': data};
        this.queue.push(event);
        this.totalStep = this.queue.length;
        this.emitTotalStepSubject();
        if (this.eventsService.modelLiveButton['value']) {
            this.nextUFI(node, data);
            this.stepUp();
        }

    }

    public removeFactInstance(data) {
        const node = this.visNetworkData.nodes.get(data.id);
        const event = {'action': 'delete-fact', 'before': node, 'after': data};
        this.queue.push(event);
        this.totalStep = this.queue.length;
        this.emitTotalStepSubject();
        if (this.eventsService.modelLiveButton['value']) {
            this.nextRFI(node, data);
            this.stepUp();
        }
    }

    public addFactType(data) {
        data.id = (Math.random() * 1e7).toString(32);
        const event = {'action': 'insert-fact-type', 'before': {}, 'after': data};
        this.queue.push(event);
        this.totalStep = this.queue.length;
        this.emitTotalStepSubject();
        if (this.eventsService.modelLiveButton['value']) {
            this.nextFT({}, data);
            this.stepUp();
        }
    }

    public addRule(data) {
        const event = {'action': 'insert-rule', 'before': {}, 'after': data};
        this.queue.push(event);
        this.totalStep = this.queue.length;
        this.emitTotalStepSubject();
        if (this.eventsService.modelLiveButton['value']) {
            this.nextR({}, data);
            this.stepUp();
        }
    }

    public fire(data) {
        const event = {'action': 'fire', 'before': {}, 'after': data};
        this.queue.push(event);
        this.totalStep = this.queue.length;
        this.emitTotalStepSubject();
        if (this.eventsService.modelLiveButton['value']) {
            this.nextF({}, data);
            this.stepUp();
        }
    }

    public previousBegin() {
        while (this.step >= 0) {
            this.previousHandle(this.queue[this.step].action, this.queue[this.step]['before'], this.queue[this.step]['after']);
            this.stepDown();
            this.totalStep = this.queue.length;
            this.emitTotalStepSubject();
        }
    }

    public previous() {
        if (this.step >= 0) {
            this.previousHandle(this.queue[this.step].action, this.queue[this.step]['before'], this.queue[this.step]['after']);
            this.stepDown();
            this.totalStep = this.queue.length;
            this.emitTotalStepSubject();
        }
    }

    public next() {
        if (this.step < this.totalStep - 1) {
            this.stepUp();
            this.nextHandle(this.queue[this.step].action, this.queue[this.step]['before'], this.queue[this.step]['after']);
        }

    }

    public nextEnd() {
        while (this.step < this.totalStep - 1) {
            this.stepUp();
            this.nextHandle(this.queue[this.step].action, this.queue[this.step]['before'], this.queue[this.step]['after']);
        }
    }


    public nextFI(dataP, dataA) {
        const newId = dataA.id;
        const dataJson = JSON.stringify(dataA.object, null, 2);
        this.nodeAdd({id: newId, label: "FI-" + this.factInstanceStep, title: dataJson, group: "factInstance"});
        this.factInstanceStep++;
        const edgesId = dataA.type + "-" + newId;
        this.edgeAdd({id: edgesId, label: '', from: dataA.type, to: newId, dashes: true});
        if (dataA.from.length > 0) {
            const edgesId = dataA.from[0] + "-" + newId;
            this.edgeStep++;
            this.edgeAdd({id: edgesId, from: dataA.from[0], to: newId, arrows: 'to', label: this.edgeStep});
        } else {
            const edgesId = "0-" + String(newId);
            this.edgeStep++;
            this.edgeAdd({id: edgesId, from: 0, to: newId, arrows: 'to', label: this.edgeStep});
        }
    }

    public nextUFI(dataP, dataA) {
        //const node = this.visNetworkData.nodes.get(dataA.id);
        const dataJson = JSON.stringify(dataA.object, null, 2);
        this.updateNode([{id: dataA.id, group: 'factInstance', title: dataJson}]);
        //node.borderWidth = 3;
        //node.color = {background:'#51c1db', border:'#de5152'};
        //this.updateNode(node);
        if (dataA.from.length > 0) {
            const edgesId = dataA.from[0] + "-" + dataA.id;
            this.edgeStep++;
            this.edgeAdd({id: edgesId, from: dataA.from[0], to: dataA.id, arrows: 'to', label: this.edgeStep});
        }
    }

    public nextRFI(dataP, dataA) {
        //const node = this.visNetworkData.nodes.get(dataA.id);
        const dataJson = "The fact instance has been deleted";
        this.updateNode([{id: dataA.id, /* group : 'factInstanceDeleted' */ title: dataJson}]);
        //node.color = {background:'black', border:'black'};
        //node.title = dataJson;
        //this.updateNode(node);
        if (dataA.from.length > 0) {
            const edgesId = dataA.from[0] + "-" + dataA.id;
            this.edgeStep++;
            this.edgeAdd({id: edgesId, from: dataA.from[0], to: dataA.id, arrows: 'to', label: this.edgeStep});
        }
    }

    public nextFT(dataP, dataA) {
        //const newId = dataA.id;
        //const newId = dataA.object.name;
        const dataJson = JSON.stringify(dataA.object.attributes, null, 2);
        this.nodeAdd({id: dataA.object.name, label: dataA.object.name, title: dataJson, group: "factType"});
    }

    public nextR(dataP, dataA) {
        const dataJson = JSON.stringify(dataA.object, null, 2);
        this.updateNode({id: dataA.object.name, label: dataA.object.name, title: dataJson, group: "rule"});
    }

    public nextF(dataP, dataA) {
        //const node = this.visNetworkData.nodes.get(dataA.object);
        //node.borderWidth = 3;
        //node.color = {background:'#f3ac5d', border:'#de5152'};
        //this.updateNode(node);
        this.updateNode([{id: dataA.object, group: 'rule'}]);
        for (let i = 0; i < dataA.from.length; i++) {
            const edgesId = dataA.from[i] + "-" + dataA.object;
            this.edgeStep++;
            this.edgeAdd({
                id: edgesId,
                from: dataA.from[i],
                to: dataA.object,
                arrows: 'to',
                color: 'purple',
                label: this.edgeStep
            });
        }
    }

    public nextFIR(dataP, dataA) {
        this.removeEdge(dataA.type + "-" + dataA.id);
        if (dataA.from.length > 0) {
            this.removeEdge(dataA.from[0] + "-" + dataA.id);
        } else {
            this.removeEdge("0-" + dataA.id);
        }
        this.edgeStep--;
        this.factInstanceStep--;
        this.removeNode(dataA.id);
    }

    public nextFTR(dataP, dataA) {
        this.removeNode(dataA.object.name);
    }

    public nextRR(dataP, dataA) {
        this.removeNode(dataA.object.name);
    }

    public nextFR(dataP, dataA) {
        /*  const node = this.visNetworkData.nodes.get(dataA.object);
        node.borderWidth = 1;
        node.color = {background:'#f3ac5d', border:'#f3ac5d'};
        this.updateNode(node); */

        this.updateNode([{id: dataA.object, group: 'rule'}]);
        for (let i = 0; i < dataA.from.length; i++) {
            const edgesId = dataA.from[i] + "-" + dataA.object;
            this.removeEdge(edgesId);
            this.edgeStep--;
        }
    }

    public nextUFIR(dataP, dataA) {
        this.updateNode(dataP);
        if (dataA.from.length > 0) {
            this.removeEdge(dataA.from[0] + "-" + dataA.id);
            this.edgeStep--;
        }
    }

    public nextRFIR(dataP, dataA) {
        this.updateNode(dataP);
        if (dataA.from.length > 0) {
            this.removeEdge(dataA.from[0] + "-" + dataA.id);
            this.edgeStep--;
        }
    }

}
