import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

/* This Service will manage the events */

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  /* tabsSubject = new Subject<any[]>();

  tabsArray: any[] = ['' , 'in active']; */

  constructor() { }

  /* emitTabsSubject() {
        this.tabsSubject.next(this.tabsArray.slice());
        console.log(this.tabsArray);
    } */
  /*
  updateScheme() {
    this.myFormData = this.text.jsonSchema;
  } */
}
