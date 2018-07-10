import { Injectable } from '@angular/core';
import {Subscription} from "rxjs/internal/Subscription";
import {DRLService} from "./drl.service";
import {EventsService} from "./events.service";
import {Subject} from "rxjs";
import {ExampleNetworkData} from "../models/network-data.model";

@Injectable({
  providedIn: 'root'
})
export class StepFunctionsService {

    public queue = [];

    private step = 0;
    private totalStep = 0;
    private edgeStep = 1;


    stepSubject = new Subject<number>(); // We use a Subject to subscribe to it in real time

    totalStepSubject = new Subject<number>(); // We use a Subject to subscribe to it in real time

    hasCompiledSubscription: Subscription;
    private hasCompiled;

    public visNetworkDataSubscription: Subscription;
    public visNetworkData: ExampleNetworkData;


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
    };
    
  constructor(private drlService: DRLService, private eventsService: EventsService) {
      this.hasCompiledSubscription = this.drlService.hasCompiledSubject.subscribe(
          (hasCompile: boolean) => {
              this.hasCompiled = hasCompile;
          }
      );
      this.drlService.emitHasCompiledSubject( );

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
      this.step = this.queue.length;
      this.edgeStep = 1;
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
    /* ------------------------ EVENTS  S ------------------- */

    public addFactInstance(data) {
        const event = {'action' : 'insert-fact', 'before' : {}, 'after' : data};
        this.queue.push(event);
        if (!this.eventsService.modelLiveButton['value']) {
            this.nextFI({}, data);
            this.stepUp();
        }
    }

    
    public updateFactInstance(data) {
        const node = this.visNetworkData.nodes.get(data.id);
        const event = {'action' : 'update-fact', 'before' : node, 'after' : data};
         this.queue.push(event);
        if (!this.eventsService.modelLiveButton['value']) {
            this.nextUFI(node, data);
            this.stepUp();
        }
        
    }

     public removeFactInstance(data) {
        const node = this.visNetworkData.nodes.get(data.id);
        const event = {'action' : 'delete-fact', 'before' : node, 'after' : data};
         this.queue.push(event);
        if (!this.eventsService.modelLiveButton['value']) {
            this.nextRFI(node, data);
            this.stepUp();
        }
    }

     public addFactType(data) {
        data.id = (Math.random() * 1e7).toString(32);
        const event = {'action' : 'insert-fact-type', 'before' : {}, 'after' : data};
         this.queue.push(event);
        if (!this.eventsService.modelLiveButton['value']) {
            this.nextFT({}, data);
            this.stepUp();
        }
    }

     public addRule(data) {
        const event = {'action' : 'insert-rule', 'before' : {}, 'after' : data};
         this.queue.push(event);
        if (!this.eventsService.modelLiveButton['value']) {
            this.nextR({}, data);
            this.stepUp();
        }
    }

     public fire(data) {
        const event = {'action' : 'fire', 'before' : {}, 'after' : data};
         this.queue.push(event);
        if (!this.eventsService.modelLiveButton['value']) {
            this.nextF({}, data);
            this.stepUp();
        }
    }

     public previousBegin() {
        while (this.step >= 0) {
            this.previousHandle[this.queue[this.step].action](this.queue[this.step]['before'], this.queue[this.step]['after']);
            this.step = this.step - 1;
            this.totalStep = this.queue.length;
            this.emitStepSubject();
            this.emitTotalStepSubject();
        }
    }

     public previous() {
        if (this.step >= 0) {
            this.previousHandle[this.queue[this.step].action](this.queue[this.step]['before'], this.queue[this.step]['after']);
            this.step = this.step - 1;
            this.totalStep = this.queue.length;
            this.emitStepSubject();
            this.emitTotalStepSubject();
        }
    }

     public next() {
        if (this.step <  this.queue.length - 1) {
            this.step = this.step + 1;
            this.nextHandle[this.queue[this.step].action](this.queue[this.step]['before'], this.queue[this.step]['after'])
            ((this.step + 1) + " / " +  this.queue.length);
        }
    }

     public nextEnd() {
        while (this.step <  this.queue.length - 1) {
            this.step = this.step + 1;
            this.nextHandle[this.queue[this.step].action](this.queue[this.step]['before'], this.queue[this.step]['after'])
            ((this.step + 1) + " / " +  this.queue.length);
        }
    }



     public nextFI(dataP, dataA) {
        const newId = dataA.id;
        const dataJson = JSON.stringify(dataA.object, null, 2);
        this.visNetworkData.nodes.add({id:newId, title:dataJson, group : "factInstance"});
        const edgesId = dataA.type + "-" + newId;
        this.visNetworkData.edges.add({id:edgesId, from: dataA.type, to: newId, dashes:true});
        if(dataA.from.length > 0) {
            const edgesId = dataA.from[0] + "-" + newId;
            this.visNetworkData.edges.add({id:edgesId, from: dataA.from[0], to: newId, arrows:'to', label: this.edgeStep++});
        } else {
            const edgesId = "0" + newId;
            this.visNetworkData.edges.add({id:edgesId, from: 0, to: newId, arrows:'to', label:this.edgeStep++});
        }
    }

     public nextUFI(dataP, dataA) {
        //const node = this.visNetworkData.nodes.get(dataA.id);
         const dataJson = JSON.stringify(dataA.object, null, 2);
         this.visNetworkData.nodes.update([{id: dataA.id, group : 'factInstance', title : dataJson}]);
        //node.borderWidth = 3;
        //node.color = {background:'#51c1db', border:'#de5152'};
         //this.visNetworkData.nodes.update(node);
        if(dataA.from.length > 0) {
            const edgesId = dataA.from[0] + "-" + dataA.id;
            this.visNetworkData.edges.add({id:edgesId, from: dataA.from[0], to: dataA.id, arrows:'to', label:this.edgeStep++});
        }
    }

     public nextRFI(dataP, dataA) {
        //const node = this.visNetworkData.nodes.get(dataA.id);
        const dataJson = "The fact instance has been deleted";
        this.visNetworkData.nodes.update([{id: dataA.id,/* group : 'factInstanceDeleted' */ title : dataJson}]);
         //node.color = {background:'black', border:'black'};
        //node.title = dataJson;
        //this.visNetworkData.nodes.update(node);
        if(dataA.from.length > 0) {
            const edgesId = dataA.from[0] + "-" + dataA.id;
            this.visNetworkData.edges.add({id:edgesId, from: dataA.from[0], to: dataA.id, arrows:'to', label:this.edgeStep++});
        }
    }

     public nextFT(dataP, dataA) {
        //const newId = dataA.id;
        //const newId = dataA.object.name;
        const dataJson = JSON.stringify(dataA.object.attributes, null, 2);
        this.visNetworkData.nodes.add({id:dataA.object.name, label:dataA.object.name, title:dataJson, group : "factType"});
    }

     public nextR(dataP, dataA) {
        const dataJson = JSON.stringify(dataA.object, null, 2);
        this.visNetworkData.nodes.add({id:dataA.object.name, label:dataA.object.name, title:dataJson, group : "rule"});
    }

     public nextF(dataP, dataA) {
        //const node = this.visNetworkData.nodes.get(dataA.object);
        //node.borderWidth = 3;
        //node.color = {background:'#f3ac5d', border:'#de5152'};
        //this.visNetworkData.nodes.update(node);
         this.visNetworkData.nodes.update([{id: dataA.object , group : 'fact'  }]);
        for (let i = 0; i < dataA.from.length; i++) {
            const edgesId = dataA.from[i] + "-" + dataA.object;
            this.visNetworkData.edges.add({id:edgesId, from: dataA.from[i], to: dataA.object, arrows:'to', color: 'purple', label:this.edgeStep++});
        }
    }

     public nextFIR(dataP, dataA) {
        this.visNetworkData.edges.remove(dataA.type + "-" + dataA.id);
        if(dataA.from.length > 0) {
            this.visNetworkData.edges.remove(dataA.from[0] + "-" + dataA.id);
        } else {
            this.visNetworkData.edges.remove("0-" + dataA.id);
        }
        this.edgeStep--;
        this.visNetworkData.nodes.remove(dataA.id);
    }

     public nextFTR(dataP, dataA) {
        this.visNetworkData.nodes.remove(dataA.object.name);
    }

     public nextRR(dataP, dataA) {
        this.visNetworkData.nodes.remove(dataA.object.name);
    }

     public nextFR(dataP, dataA) {
        /*  const node = this.visNetworkData.nodes.get(dataA.object);
        node.borderWidth = 1;
        node.color = {background:'#f3ac5d', border:'#f3ac5d'};
        this.visNetworkData.nodes.update(node); */
         this.visNetworkData.nodes.update([{id: dataA.object , group : 'rule'  }]);
        for (let i = 0; i < dataA.from.length; i++) {
            const edgesId = dataA.from[i] + "-" + dataA.object;
            this.visNetworkData.edges.remove(edgesId);
            this.edgeStep--;
        }
    }

     public nextUFIR(dataP, dataA) {
        this.visNetworkData.nodes.update(dataP);
        if(dataA.from.length > 0) {
            this.visNetworkData.edges.remove(dataA.from[0] + "-" + dataA.id);
            this.edgeStep--;
        }
    }

     public nextRFIR(dataP, dataA) {
        this.visNetworkData.nodes.update(dataP);
        if(dataA.from.length > 0) {
            this.visNetworkData.edges.remove(dataA.from[0] + "-" + dataA.id);
            this.edgeStep--;
        }
    }

}
