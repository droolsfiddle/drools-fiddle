import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {EventsService} from './events.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';

/* import  { Location } from '@angular/common'; */

/* This service will implement every DRL options  */

@Injectable({
  providedIn: 'root'
})
export class DRLService {
  // private _options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  DrlCodeSubject = new Subject<string>(); // We use a Subject to set the variable DrlCode Private
    hasCompiledSubject = new Subject<boolean>();

  private dataObj = { data: '' };

  private jsonResp: any;

  public hasCompiled = false;

  /* public target = 'drl'; */

  private DrlCode: string = '//\n' +  // The default text that will be displayed in Ace Editor
    '// copy paste your drl\n' +
    '//\n' +
    '\n' +
    'declare Fact\n' +
    '    value : int\n' +
    'end\n' +
    '\n' +
    '\n' +
    'rule "Rule"\n' +
    '    when\n' +
    '        f : Fact(value == 42)\n' +
    '    then\n' +
    '        modify( f ) {setValue( 41 )}\n' +
    '    end';

  constructor( private httpClient: HttpClient, private eventService: EventsService, private router: Router) { // We use HttpClient for the post method
  }

  emitDrlCodeSubject() {
    this.DrlCodeSubject.next(this.DrlCode.slice());
  }

    emitHasCompiledSubject() {
        this.hasCompiledSubject.next(this.hasCompiled);
    }

  /* postText() {
      this.dataObj = { data: btoa(String(this.DrlCode)) };
      console.log(this.dataObj);
      this.httpClient
      .post('/rest/drools/drlCompile', this.dataObj)
      .subscribe(
          (res) => {
              /* this.target = 'facts';
              this.eventService.tabsArray[0] = '';
              this.eventService.tabsArray[1] = 'in active';
              this.eventService.emitTabsSubject();
              this.hasCompiled = true;
              this.emitHasCompiledSubject();
              this.jsonResp =  res;
          console.log(res);
        },
        (error) => {
              /* this.target = 'drl';
            this.eventService.tabsArray[0] = 'in active';
            this.eventService.tabsArray[1] = '';
            this.eventService.emitTabsSubject();
            this.hasCompiled = false;
            this.emitHasCompiledSubject();
          console.log('Erreur ! : ' + error);
        }
      );   /*this.dataObj = {data: "Ci8vCi8vIGNvcHkgcGFzdGUgeW91ciBkcmwKLy8KCmRlY2xhcmUgRmFjdAogICAgdmFsdWUgOiBpbnQKZW5kCgoKcnVsZSAiUnVsZSIKICAgIHdoZW4KICAgICAgICBmIDogRmFjdCh2YWx1ZSA9PSA0MikKICAgIHRoZW4KICAgICAgICBtb2RpZnkoIGYgKSB7c2V0VmFsdWUoIDQxICl9CiAgICBlbmQ="};
      console.log(this.dataObj);
      this.httpClient
          .post('/rest/drools/drlCompile', this.dataObj)
          .subscribe(
              (res) => {
                  console.log(res);
              },
              (error) => {
                  console.log('Erreur ! : ' + JSON.stringify(error));
              }
          );
  } */

  changeDrlCode(code) {  // Update DrlCode When the user past his DRL code.
    this.DrlCode = code;
    this.emitDrlCodeSubject();
    console.log("new code", code, this.DrlCode);

  }

  compile() {

      this.dataObj = { data: btoa(String(this.DrlCode)) };
      console.log(this.dataObj);
      this.httpClient
          .post('/rest/drools/drlCompile', this.dataObj)
          .subscribe(
              (res) => {
                  /* this.target = 'facts';
                  this.eventService.tabsArray[0] = '';
                  this.eventService.tabsArray[1] = 'in active';
                  this.eventService.emitTabsSubject(); */
                  this.hasCompiled = true;
                  /* this.emitHasCompiledSubject(); */
                  this.jsonResp =  res;
                  console.log(res);
              },
              (error) => {
                  /* this.target = 'drl';
                this.eventService.tabsArray[0] = 'in active';
                this.eventService.tabsArray[1] = '';
                this.eventService.emitTabsSubject(); */
                  this.hasCompiled = false;
                  this.emitHasCompiledSubject();
                  console.log('Erreur ! : ' + error);
              }
          );

    /* this.eventService.updateScheme(); */

    console.log("Ca marche", this.jsonResp);
    return null;
  }

  fire() {
      this.dataObj = {
          data : '',
      };

      this.httpClient
          .post('/rest/drools/drlFire', this.dataObj)
          .subscribe(
              (res) => {
                  console.log(res);
              },
              (error) => {
                  console.log('Erreur ! : ' + error);
              }
          );

    return null;
  }

  save() {
      this.dataObj = {
          data : '',
      };
      this.httpClient
          .post('/rest/context', this.dataObj)
          .subscribe(
              (res) => {
                  /* this.router.navigate([res['data']['contextId']]); */
                  console.log(res);
              },
              (error) => {
                  console.log('Erreur ! : ' + error);
              }
          );

    return null;
  }
}
