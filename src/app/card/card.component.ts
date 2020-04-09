import { Component, OnInit, Input,  EventEmitter, Output  } from '@angular/core';
import { trigger, keyframes, animate, transition, state, style } from "@angular/animations";
import * as kf from './keyframes';
import { User } from './user'
import * as userData  from './userData';
import { Subject } from 'rxjs'; 
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  animations: [
    trigger('cardAnimator', [
      transition('* => swiperight', animate(550, keyframes(kf.swiperight))),
      transition('* => swipeleft', animate(550, keyframes(kf.swipeleft)))
    ])
  ]

})  
export class CardComponent {

  public users: User[] = userData.data;
  public objLength = userData.data.length;
  public index = 0;

  @Input()
  parentSubject: Subject<any>;

  @Output() dataEvent = new EventEmitter();

  animationState: string;
  constructor(private router: Router) { }

  ngOnInit() {
    // this.users = this.userlist.data; 
    this.parentSubject.subscribe(event => {
      this.startAnimation(event)
    });
  }

  startAnimation(state:string) {
    this.users[this.index]['state'] = state;
    
    if (!this.animationState) {
        this.animationState = state; 
    } 
  }

  resetAnimationState(state) { 
    if(this.animationState){
      if(this.index <= this.objLength-1){
        this.index++;
      }
    }
    this.animationState = '';
  }

  getResults(data:boolean){
    if(data){
      let obj = JSON.stringify(this.users);
      localStorage.setItem('results',obj);
      this.router.navigate(['/home'], { queryParams: { page: 'getResults' }});
    }
    return false;
  }

  ngOnDestroy() {
    this.parentSubject.unsubscribe();
  }
}
