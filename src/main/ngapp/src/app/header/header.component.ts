import {Component, OnDestroy, OnInit} from '@angular/core';
import {DRLService} from '../services/drl.service';
import {EventsService} from '../services/events.service';
import {Subscription} from 'rxjs';

/*  This component is the Header, it displays the navbar on the top.
 The app uses here the Bootstrap 3.3.7 framework */

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  model: any = {
    onColor: 'success',
    offColor: 'danger',
    onText: 'Live',
    offText: 'Off',
    disabled: false,
    size: '',
    value: true
  };
    fireDisableSubscription: Subscription;
  fireDisable = true;

  /* dataTarget: string; */

  constructor(private drlService: DRLService, private eventService: EventsService) { }

  ngOnInit() {
      this.fireDisableSubscription = this.drlService.hasCompiledSubject.subscribe(
          (hasCompile: boolean) => {
              this.fireDisable = hasCompile;
          }
      );
      this.drlService.emitHasCompiledSubject();
  }

  compileDrl() {
      this.drlService.compile();
      console.log(this.fireDisable);
      /* $('.nav-tabs > .active').next('li').find('a').trigger('click'); (Ou prev) */
      /* this.dataTarget = this.drlService.target;
      this.eventService.emitTabsSubject();
       console.log(this.dataTarget); */
  }

  fireDrl() {

    this.drlService.fire();
  }

  saveDrl() {
    this.drlService.save();
  }
  ngOnDestroy() {
        this.fireDisableSubscription.unsubscribe();
    }

}
