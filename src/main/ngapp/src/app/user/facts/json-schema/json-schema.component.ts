import { Component, OnInit, Input, SimpleChanges, OnChanges, AfterViewInit, ViewChild } from '@angular/core';
import {DRLService} from "../../../services/drl.service";
import {FactsService} from "../../../services/facts.service";

declare var JSONEditor;

@Component({
    selector: 'app-json-viewer',
    template: `
        <div #jsoneditor></div>
        <button type="submit" class="btn btn-success" (click)="onSubmit()">
            <span class="glyphicon glyphicon-check"></span> Submit
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

    constructor(private drlService: DRLService, private factService : FactsService) {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!!changes['data'] && changes['data'].currentValue != null) {
            this.editorRef.set(this.data);
            console.log('Hello', this.editorRef.getValue());
        }
        if (this.editorRef){
            this.resetJsonEditor();
        }
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.templateDivRef = this.jsonEditor.nativeElement;
        this.createDefaultObjectViewer();
    }

    onSubmit(){
        console.log('Hello', this.editorRef.getValue());
        this.drlService.submit(this.editorRef.getValue());
        console.log("Schema : ", this.schema)
    }

    createDefaultObjectViewer() {
        this.editorRef = new JSONEditor(this.templateDivRef, { theme: 'bootstrap3', iconlib: 'bootstrap3', mode: this.mode, schema: this.schema }, {});
    }

    resetJsonEditor() {
        this.editorRef.destroy();
        this.editorRef = new JSONEditor(this.templateDivRef, { theme: 'bootstrap3', iconlib: 'bootstrap3', mode: this.mode, schema: this.schema }, {});
    }

}