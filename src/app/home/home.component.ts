import { Component ,  Input , ViewChild} from '@angular/core';
import { Subject} from 'rxjs';
import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { ParentService } from '../services/index';
import { NgNavigatorShareService } from 'ng-navigator-share';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { WhoComponent } from '../who/who.component';

import * as jsPDF from 'jspdf';

@Component({
    selector: 'home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css'] 
})
export class HomeComponent {
  @ViewChild('sidenav',{static:true}) public sidenav: MatSidenav;
  
  private ngNavigatorShareService: NgNavigatorShareService;

    parentSubject:Subject<string> = new Subject();
    renderResults:boolean = false;
    contentDisplay:boolean = false;
    hideHome:boolean = false;
    displayFeedBack:boolean = false;
    displayAboutUs:boolean = false;
    displayDashboard:boolean = false;
    diplayDislaimer:boolean = false;
    API_EndPoint: string;

    constructor(changeDetectorRef: ChangeDetectorRef,ngNavigatorShareService: NgNavigatorShareService,
      private ParentProcessService: ParentService, media: MediaMatcher, 
      private activatedRoute: ActivatedRoute, private router: Router, public dialog: MatDialog) {
      this.mobileQuery = media.matchMedia('(max-width: 600px)');
      this.API_EndPoint = 'https://api.icovids.com/api/feedback';
      this.ngNavigatorShareService = ngNavigatorShareService;
    }


    public toggle(): void {
      this.sidenav.toggle();
  }

  share() {
    this.ngNavigatorShareService.share({
      title: 'icovids',
      text: 'Hey, check out this covid  tool to take a self assessment test for covid!You can also find the testing centers and helpline info across the country',
      url: 'https://icovids.com'
    }).then( (response) => {
    })
    .catch( (error) => {
      console.log(error);
    });
  }

    
   cardAnimation(value:any) { 
      this.parentSubject.next(value);
    }
  
    mobileQuery: MediaQueryList;

    ngOnInit() {
      // Note: Below 'queryParams' can be replaced with 'params' depending on your requirements
      this.activatedRoute.queryParams.subscribe(params => {
          const userId = params['page'];
          this.parentSubject = new Subject();
          let results:any = localStorage.getItem('results');
            if(userId === 'getResults' && results){  
              if(results.length > 0){ 
                this.renderResults = true;
                this.generateResult(JSON.parse(results));
              } else {
                this.router.navigate(['/login']);
              }
            } else {
              this.renderResults = false;
          } 
          if(userId === "helpline"){
              this.hideHome = true;
              this.displayFeedBack = false;
              this.displayAboutUs = false;
              this.displayDashboard = false;
              this.diplayDislaimer = false;
          }else if(userId === 'feedback') { 
            this.hideHome = false;
            this.displayFeedBack = true;
            this.displayAboutUs = false;
            this.displayDashboard = false;
            this.diplayDislaimer = false;
          } else if (userId === 'aboutUs'){
            this.hideHome = false;
            this.displayFeedBack = true;
            this.displayAboutUs = true; // displayDashboard
            this.displayDashboard = false;
            this.diplayDislaimer = false;
          }  else if (userId === 'dashboard'){
            this.hideHome = false;
            this.displayFeedBack = true;
            this.displayAboutUs = false;
            this.displayDashboard = true;
            this.diplayDislaimer = false;
          } else if (userId === 'disclaimer'){
            this.hideHome = false;
            this.displayFeedBack = true;
            this.displayAboutUs = false;
            this.displayDashboard = false;
            this.diplayDislaimer = true;
          }else  {  
            this.hideHome = false;
            this.displayFeedBack = false;
            this.displayAboutUs = false;
            this.displayDashboard = false;
            this.diplayDislaimer = false;
          }
        });
    }

    navigateToDashboard(){
      this.router.navigate(['/home'], { queryParams: { page: 'dashboard' }});
      this.sidenav.toggle();
    }

    navigateToHelpline(){
      this.router.navigate(['/home'], { queryParams: { page: 'helpline' }});
      this.sidenav.toggle();
    }

    navigateToAboutUs (){ 
      this.router.navigate(['/home'], { queryParams: { page: 'aboutUs' }});
      this.sidenav.toggle();
    }

    navigateToTest(){
      let results:any = localStorage.getItem('results');
      if(results){
        localStorage.removeItem('results');
      }
      this.router.navigate(['/home']);
      this.sidenav.toggle();
    }

    navigateToFeedBack(){
      this.router.navigate(['/home'], { queryParams: { page: 'feedback' }});
      this.sidenav.toggle();
    }

    navigateToDisclaimer(){
      this.router.navigate(['/home'], { queryParams: { page: 'disclaimer' }});
      this.sidenav.toggle();
    }

    generateResult(results:any){
      let swipeRightCount:number = 0;
      let swipeLeftCount: number = 0;
      let totalResultsCount:number = 0;
      totalResultsCount = results.length;

      results.forEach((element:any) => {
        if(element.state === 'swiperight'){
          swipeRightCount++;
          element['answer'] = 'yes';
        } else {
          element['answer'] = 'no';
          swipeLeftCount++;
        }
      });
      if (totalResultsCount === swipeRightCount){
        // seems covid
        this.contentDisplay = true;
      } else  if (totalResultsCount === swipeLeftCount){
        this.contentDisplay = false;
        // no covid
      }
      // send data to server 
      let mongoObj = localStorage.getItem('userId');
      let userInfo = localStorage.getItem('userData');
      let locObj = localStorage.getItem('locationObj');
      let locationData:any;
      let mongoUserId:any;
      let userData:any;
      let jsonData:any = {};
      if(userInfo){
          userData = JSON.parse(userInfo);
      }
      if(locObj){
        locationData = JSON.parse(locObj);
      }
      if(mongoObj){
        mongoUserId = JSON.parse(mongoObj);
        jsonData['id'] = mongoUserId.id;
        jsonData['feedback'] = mongoUserId.feedback;
      } 
      jsonData['locationObj'] = locationData;
      jsonData['name'] = userData.username;
      jsonData['age'] = userData.age;
      
      jsonData['results'] = results;
      this.ParentProcessService.postMethod(this.API_EndPoint,jsonData).subscribe((data:any)=>{
          localStorage.setItem('userId', JSON.stringify(data));
      }, (error:any)=>{
          console.log("failed !");
      });

    }
  
    generatePdf(){
      let doc:any = new jsPDF();
      let results:any = JSON.parse(localStorage.getItem('results'));
      doc.text(20,20, "Summary");
      doc.line(20, 20, 45, 20);

      results.forEach((element:any,index:number) => {
        var state = element.state === 'swiperight'? 'YES': 'NO';
        var num =((index+1)*10);
        doc.setTextColor(0, 0, 255);
        doc.text(20, num +30, element.name);
        doc.setTextColor(100);
        doc.text(20, num+35, state );
      });

      doc.save('covid-19.pdf');
    }


    callWHO(): void{
      const dialogRef = this.dialog.open(WhoComponent, {
        width: 'auto'
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
      });
    }

}
