import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {EventsService} from './events.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ResolveStart, Router, RouterEvent} from '@angular/router';
import {FactsService} from "./facts.service";
import { filter } from 'rxjs/operators';

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

  public UrlText : string;
  UrlSubject = new Subject<string>();

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

  constructor( private httpClient: HttpClient, private factsService: FactsService, private router: Router) { // We use HttpClient for the post method

      this.router.events.pipe(filter(event => event instanceof RouterEvent)).pipe(filter(event => event instanceof ResolveStart)).subscribe((event) => {
          console.log(event);
          if(event['url']) {
              this.loadSave(event['url']);
              this.UrlText = window.location.origin + window.location.pathname + '#' + event['url'];
              console.log("URL", this.UrlText);
              this.emitUrlSubject();
          }
      });
  }

  emitDrlCodeSubject() {
    this.DrlCodeSubject.next(this.DrlCode.slice());
  }

  emitUrlSubject() {
        this.UrlSubject.next(this.UrlText.slice());
    }

    emitHasCompiledSubject() {
        this.hasCompiledSubject.next(this.hasCompiled);
    }


  changeDrlCode(code) {  // Update DrlCode When the user past his DRL code.
    this.DrlCode = code;
    this.emitDrlCodeSubject();

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
                  this.emitHasCompiledSubject();
                  this.jsonResp =  res;
                  this.factsService.myFormData = res['jsonSchema'] ;
                  this.factsService.emitMyFormDataSubject();
                  $('.nav-tabs > .active').next('li').find('a').trigger('click');
                  console.log(res);
              },
              (error) => {
                  /* this.target = 'drl';
                this.eventService.tabsArray[0] = 'in active';
                this.eventService.tabsArray[1] = '';
                this.eventService.emitTabsSubject(); */
                  this.hasCompiled = false;
                  this.emitHasCompiledSubject();
                  console.log('Erreur ! : Compile failed ' + error);
              }
          );
  }

  submit(event){
      /* for(let key in event){
          console.log(key);
          console.log(event[key]);
          event[key].forEach((item, index) =>{
              console.log(item);
              let msg = {"data": btoa(JSON.stringify(item))};
              this.httpClient
                  .post('/rest/facts/insert/'+"defaultpkg." + this.factsService.myFormData.schema.Facts.items[index]['title'], msg)
                  .subscribe(
                      (res) => {
                          console.log(event);
                      },
                      (error) => {
                          console.log('Erreur ! : ' + error);
                      }
                  );
          }) */
      for (let key in event) {
          console.log(key);
          console.log(event[key]);
          let msg = {
              "data": btoa(JSON.stringify(event[key]))
          }
          this.httpClient
              .post('/rest/facts/insert/' + key, msg)
              .subscribe(
                  (res) => {
                      console.log(event);
                  },
                  (error) => {
                      console.log('Erreur ! : ' + error);
                  }
              );
      }

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
                  console.log('Erreur ! : Fire failed ' + error);
              }
          );

    return null;
  }

  save() {

          this.dataObj = {
              data: '',
          };
          this.httpClient
              .post('/rest/context', this.dataObj)
              .subscribe(
                  (res) => {
                      /* this.router.navigate([res['data']['contextId']]); */
                      console.log(res);
                      this.router.navigate(['/' + res['contextId']]);
                  },
                  (error) => {
                      console.log('Erreur ! : save failed' + error);
                  }
              );
  }

  saveAndCompile(){
      this.dataObj = { data: btoa(String(this.DrlCode)) };
      console.log(this.dataObj);
          this.httpClient
              .post('/rest/drools/drlCompile', this.dataObj)
              .subscribe(
                  (res) => {
                      this.hasCompiled = true;
                      this.emitHasCompiledSubject();
                      this.jsonResp =  res;
                      this.factsService.myFormData = res['jsonSchema'] ;
                      this.factsService.emitMyFormDataSubject();
                      this.save()
                      console.log(res);
                  },
                  (error) => {
                      this.hasCompiled = false;
                      this.emitHasCompiledSubject();
                      console.log('Erreur ! : Compile failed ' + error);
                  }
              );

  }

  loadSave(url : String) {
      this.httpClient
          .get('/rest/context' + url)
          .subscribe(
              (res) => {
                  /* this.router.navigate([res['data']['contextId']]); */
                  console.log(res);
                  this.changeDrlCode(res['drl']);
              },
              (error) => {
                  console.log('Erreur ! : failed to load session' + error);
              }
          );
  }
}
