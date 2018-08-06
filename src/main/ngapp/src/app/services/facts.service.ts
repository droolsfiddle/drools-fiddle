import {Injectable} from '@angular/core';
import {Subject} from "rxjs/index";

/* This Service will manage the facts */

declare var JSONEditor;

@Injectable({
    providedIn: 'root'
})
export class FactsService {

    //myFormData = {"title":"Facts","type":"object","properties":{"defaultpkg.Fact":{"title":"Fact","type":"object","properties":{"value":{"title":"value","type":"integer","properties":{}}}}}};
    myFormData = {"title": "Facts", "type": "object", "properties": {}};

    myFormDataSubject = new Subject<object>(); // We use a Subject to set the variable DrlCode Private

    jsonData = {};
    jsonDataSubject = new Subject<object>();


    constructor() {

    }

    emitMyFormDataSubject() {
        this.myFormDataSubject.next(this.myFormData);
    }

    emitJsonDataSubject() {
        this.jsonDataSubject.next(this.jsonData);
    }


}
