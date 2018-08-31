import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {VisualisationComponent} from './visualisation/visualisation.component';
import {LogsComponent} from './logs/logs.component';
import {RulesComponent} from './user/rules/rules.component';
import {FactsComponent} from './user/facts/facts.component';
import {DRLService} from './services/drl.service';
import {EventsService} from './services/events.service';
import {FactsService} from './services/facts.service';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {UserComponent} from './user/user/user.component';
import {HttpClientModule} from '@angular/common/http';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import * as $ from 'jquery';
import {NgxToggleModule} from 'ngx-toggle';
import {PopoverModule} from 'ngx-popover';
import {AceEditorModule} from 'ng2-ace-editor';
import {AngularFontAwesomeModule} from 'angular-font-awesome';
import {StepFunctionsService} from "./services/step-functions.service";
import {SocketService} from "./services/socket.service";
import {HashLocationStrategy} from '@angular/common';
import {LoggerModule, NgxLoggerLevel} from "ngx-logger";
import {FormsModule} from "@angular/forms";
import {ClipboardModule} from "ngx-clipboard";
import {CopyButtonComponent} from './header/copy-button/copy-button.component';
import {DataTableModule} from "angular-6-datatable";
import {JSONViewerComponent} from "./user/facts/json-schema/json-schema.component";
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";
import {MultiselectComponent} from './logs/multiselect/multiselect.component';
import {VisModule} from "ng2-vis";


const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: ':id', component: HomeComponent},
    {path: '**', redirectTo: ''}
];


@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        VisualisationComponent,
        LogsComponent,
        RulesComponent,
        FactsComponent,
        HomeComponent,
        UserComponent,
        CopyButtonComponent,
        JSONViewerComponent,
        MultiselectComponent

    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(appRoutes, {useHash: true}), // The router module helps you to control the path of your page.
        AceEditorModule, // This is the module for Ace, the text editor in the Rules part.
        HttpClientModule, // This is the module that allows us an interaction with the backend, we can get and post thanks to this.
        VisModule, // This is the module for Vis, Vis allows us to vew the network connections in the Visualisation part.
        NgxToggleModule, // This is the module that allows us to do the live button in the header
        PopoverModule, // This is the module that allows to pop the information legend in the visualisation part.
        AngularFontAwesomeModule,
        LoggerModule.forRoot({/* serverLoggingUrl: '/api/logs',*/ level: NgxLoggerLevel.TRACE}),
        FormsModule,
        ClipboardModule,
        DataTableModule,
        NgMultiSelectDropDownModule.forRoot()
    ],
    providers: [
        DRLService,
        EventsService,
        FactsService,
        Location,
        {
            provide: LocationStrategy,
            useClass: HashLocationStrategy
        },
        StepFunctionsService,
        SocketService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
