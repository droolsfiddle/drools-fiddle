import {Component, OnInit, Input, SimpleChanges, OnChanges, AfterViewInit, ViewChild} from '@angular/core';
import {DRLService} from "../../../services/drl.service";
import {FactsService} from "../../../services/facts.service";
import * as _ from 'lodash';

declare var JSONEditor;


@Component({
    selector: 'app-json-viewer',
    template: `
        <div #jsoneditor></div>
        <button type="submit" class="btn btn-success" (click)="onSubmit()">
            <span class="glyphicon glyphicon-check"></span> Submit
        </button>
        <button type="submit" class="btn btn-success" (click)="loadJson()">
            <span class="glyphicon glyphicon-check"></span> Load Json
        </button>
    `
})

export class JSONViewerComponent implements OnInit, OnChanges, AfterViewInit {

    @ViewChild('jsoneditor') jsonEditor;

    @Input() data;
    @Input() options;
    @Input() schema;
    @Input() mode;

    templateDivRef: any;
    editorRef: any;

    constructor(private drlService: DRLService, private factsService: FactsService) {
    }

    isEmpty(obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false;
        }

        return JSON.stringify(obj) === JSON.stringify({});
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.editorRef && changes['schema']) {

            this.resetJsonEditor();
        }
    }

    loadJson() {
        if ((!this.isEmpty(this.data))) {    //(!this.isEmpty(this.data)) && (!_.isEqual(this.editorRef.getValue(), this.data))
            this.editorRef.setValue(
                this.factsService.jsonData
            );
        }
    }


    ngOnInit() {
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
    }

}