import {Component, OnInit, Input, SimpleChanges, OnChanges, AfterViewInit, ViewChild} from '@angular/core';
import {DRLService} from "../../../services/drl.service";
import {FactsService} from "../../../services/facts.service";
import * as _ from 'lodash';
import {Subscription} from "rxjs/internal/Subscription";

declare var JSONEditor;


@Component({
    selector: 'app-json-viewer',
    template: `
        <div #jsoneditor></div>
        <form class="form-inline">
            <button type="submit" class="btn btn-success" (click)="onSubmit()">
                <span class="glyphicon glyphicon-check"></span> Submit
            </button>

            <button type="submit" class="btn btn-success" style="margin-left: 30px " (click)="loadJson()">
                <span class="glyphicon glyphicon-repeat"></span> Restore facts values
            </button>

            <div class="form-group input-group pull-right" [hidden]="!hasLoop">
                <span class="input-group-addon" > Nesting Limit </span>
                <input type="text" class="form-control" id="pageNumber"
                       [(ngModel)]="nestingLimit" size="2" min="30" [ngModelOptions]="{standalone: true}"
                       type="number" step="10" style="width: 100px">
                <div class="input-group-btn">
                    <button class="btn btn-group" (click)="setNestingLimit()">set</button>
                </div>
            </div>
        </form>
    `,
    styleUrls: ['./json-schema.component.scss']
})

export class JSONViewerComponent implements OnInit, OnChanges, AfterViewInit {

    @ViewChild('jsoneditor') jsonEditor;

    @Input() data;
    @Input() options;
    @Input() schema;
    @Input() mode;

    templateDivRef: any;
    editorRef: any;

    nestingLimit: number = 30;
    nestingLimitSubscription: Subscription;

    hasLoopSubscription: Subscription;
    hasLoop = true;

    jsonDataSubscription: Subscription;
    jsonData = {};


    constructor(private drlService: DRLService, private factsService: FactsService) {
    }

    isEmpty(obj) {
        for (let prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false;
        }

        return JSON.stringify(obj) === JSON.stringify({});
    }

    setNestingLimit() {
        this.drlService.setNestingLimit(this.nestingLimit);
        this.drlService.emitNestedLimitSubject();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.editorRef && changes['schema']) {

            this.resetJsonEditor();
        }
    }

    loadJson() {
        if ((!this.isEmpty(this.data))) {    //(!this.isEmpty(this.data)) && (!_.isEqual(this.editorRef.getValue(), this.data))
            this.editorRef.setValue(
                this.jsonData
            );
            console.log(this.jsonData, 'changed');
        }
    }

    defaulFactConstructor() {


    }


    ngOnInit() {
        this.nestingLimitSubscription = this.drlService.nestingLimitSubject.subscribe(
            (nestingLimit: any) => {
                this.nestingLimit = nestingLimit;
            }
        );
        this.drlService.emitNestedLimitSubject();

        this.hasLoopSubscription = this.drlService.hasLoopSubject.subscribe(
            (hasLoop: any) => {
                this.hasLoop = hasLoop;
            }
        );
        this.drlService.emitHasLoopSubject();

        this.jsonDataSubscription = this.factsService.jsonDataSubject.subscribe(
            (jsonData: object) => {
                this.jsonData = jsonData;
            }
        );
        this.factsService.emitJsonDataSubject();
    }


    ngAfterViewInit() {
        this.templateDivRef = this.jsonEditor.nativeElement;
        this.createDefaultObjectViewer();
    }

    onSubmit() {
        this.drlService.submit(this.editorRef.getValue());
        this.factsService.jsonData = this.editorRef.getValue();
        this.factsService.emitJsonDataSubject();
    }

    createDefaultObjectViewer() {
        this.editorRef = new JSONEditor(this.templateDivRef, {
            theme: 'bootstrap3',
            iconlib: 'bootstrap3',
            //display_required_only: true,
            mode: this.mode,
            schema: this.schema
        }, {});
        /*this.editorRef.on("change",  () => {
            if (!_.isEqual(this.editorRef.getValue(), this.factsService.jsonData)) {
                this.factsService.jsonData = this.editorRef.getValue();
                this.factsService.emitJsonDataSubject();
            }
        }); */
    }

    resetJsonEditor() {
        this.editorRef.destroy();
        this.createDefaultObjectViewer();
        this.loadJson();
    }

    ngOnDestroy() {
        this.nestingLimitSubscription.unsubscribe();
        this.jsonDataSubscription.unsubscribe();
    }

}