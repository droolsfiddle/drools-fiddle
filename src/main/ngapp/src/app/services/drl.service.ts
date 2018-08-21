import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {EventsService} from './events.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ResolveStart, Router, RouterEvent} from '@angular/router';
import {FactsService} from "./facts.service";
import {filter} from 'rxjs/operators';
import {StepFunctionsService} from "./step-functions.service";

/* import  { Location } from '@angular/common'; */

/* This service will implement every DRL options  */

@Injectable({
    providedIn: 'root'
})
export class DRLService {
    // private _options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    DrlCodeSubject = new Subject<string>(); // We use a Subject to set the variable DrlCode Private

    hasCompiledSubject = new Subject<boolean>();
    public hasCompiled = false;

    hasLoopSubject = new Subject<boolean>();
    public hasLoop = false;

    public UrlText: string;
    UrlSubject = new Subject<string>();
    private dataObj = {data: '', json: '', nestingLimit: 0};
    private jsonResp: any;

    private nestingLimit: number = 5;
    nestingLimitSubject = new Subject<number>();


    /* public target = 'drl'; */
    private DrlCode: string = '//\n' +
        '// copy paste your drl\n' +
        '// Drools version : 7.10.0.Final\n' +
        '\n' +
        'import org.droolsfiddle.utilities.WSLogger;\n' +
        '\n' +
        'global WSLogger LOGGER;\n' +
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
        '        LOGGER.debug("This is a debug log");\n' +
        '        LOGGER.info("This is an info log");\n' +
        '        LOGGER.warn("This is a warn log");\n' +
        '        LOGGER.error("This is an error log");\n' +
        '    end\n' + '\n' + '\n' + '\n' + '\n' + '\n' + '\n' + '\n' + '\n' + '\n' + '\n' + '\n' + '\n' + '\n' + '\n' + '\n' + '\n';

    constructor(private httpClient: HttpClient,
                private factsService: FactsService,
                private router: Router,
                private stepFunctionService: StepFunctionsService) { // We use HttpClient for the post method

        this.router.events.pipe(filter(event => event instanceof RouterEvent)).pipe(filter(event => event instanceof ResolveStart)).subscribe((event) => {
            if (event['url']) {
                this.loadSave(event['url']);
                this.UrlText = window.location.origin + window.location.pathname + '#' + event['url'];
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

    emitHasLoopSubject() {
        this.hasLoopSubject.next(this.hasLoop);
    }

    emitHasCompiledSubject() {
        this.hasCompiledSubject.next(this.hasCompiled);
    }

    emitNestedLimitSubject() {
        this.nestingLimitSubject.next(this.nestingLimit);
    }

    setNestingLimit(value: number) {
        this.nestingLimit = value;
    }


    changeDrlCode(code) {  // Update DrlCode When the user past his DRL code.
        this.DrlCode = code;
        this.emitDrlCodeSubject();

    }

    compile() {

        this.dataObj = {
            data: btoa(String(this.DrlCode)),
            json: btoa(String(JSON.stringify(this.factsService.jsonData))),
            nestingLimit: this.nestingLimit
        };
        this.httpClient
            .post('/rest/drools/drlCompile', this.dataObj)
            .subscribe(
                (res) => {
                    /* this.target = 'facts';
                    this.eventService.tabsArray[0] = '';
                    this.eventService.tabsArray[1] = 'in active';
                    this.eventService.emitTabsSubject(); */
                    if (res['success']) {
                        console.log(res);
                        this.jsonResp = res;
                        this.factsService.myFormData = res['jsonSchema'];
                        this.factsService.emitMyFormDataSubject();
                        this.hasCompiled = true;
                        this.emitHasCompiledSubject();
                        this.hasLoop = res['hasLoop'];
                        this.emitHasLoopSubject();
                        $('.nav-tabs > .active').next('li').find('a').trigger('click');
                    }

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

    submit(event) {
        for (let key in event) {
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
            data: '',
            json: '',
            nestingLimit: 0
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
            json: '',
            nestingLimit: 0
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

    saveAndCompile() {
        this.dataObj = {
            data: btoa(String(this.DrlCode)),
            json: btoa(String(JSON.stringify(this.factsService.jsonData))),
            nestingLimit: this.nestingLimit
        };
        this.httpClient
            .post('/rest/drools/drlCompile', this.dataObj)
            .subscribe(
                (res) => {
                    this.hasCompiled = true;
                    this.emitHasCompiledSubject();
                    this.jsonResp = res;
                    this.factsService.myFormData = res['jsonSchema'];
                    this.factsService.emitMyFormDataSubject();
                    this.stepFunctionService.totalReset();
                    this.hasLoop = res['hasLoop'];
                    this.emitHasLoopSubject();
                    this.save();
                    console.log(res);
                },
                (error) => {
                    this.hasCompiled = false;
                    this.emitHasCompiledSubject();
                    console.log('Erreur ! : Compile failed ' + error);
                }
            );

    }

    loadSave(url: String) {
        this.httpClient
            .get('/rest/context' + url)
            .subscribe(
                (res) => {
                    /* this.router.navigate([res['data']['contextId']]); */
                    console.log(res);
                    this.changeDrlCode(res['drl']);
                    this.compile();
                    this.factsService.jsonData = JSON.parse(res['json']);
                    this.factsService.emitJsonDataSubject();
                },
                (error) => {
                    console.log('Erreur ! : failed to load session' + error);
                }
            );
    }
}
