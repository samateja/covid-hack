import { Component } from '@angular/core';
import { ParentService } from '../services/index';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgNavigatorShareService } from 'ng-navigator-share';

@Component({
    selector: 'feedback',
    templateUrl: 'feedback.component.html',
    styleUrls: ['feedback.component.css']
})
export class FeedbackComponent {
    feedBackForm: FormGroup;
    submitted = false;
    statusMessage : boolean = false;
    message:any;
    API_EndPoint: string;
    private ngNavigatorShareService: NgNavigatorShareService;
    constructor(private router: Router, private ParentProcessService: ParentService, private formBuilder: FormBuilder, ngNavigatorShareService: NgNavigatorShareService,) { 
        this.API_EndPoint = 'https://api.icovids.com/api/feedback';
        this.ngNavigatorShareService = ngNavigatorShareService;
    }

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.feedBackForm = this.formBuilder.group({
            feedBackname: new FormControl('', [Validators.required, Validators.min(2),Validators.max(3000)]),
        });
          
         this.feedBackForm.controls;
    }

    share() {
        this.ngNavigatorShareService.share({
          title: 'icovids',
          text: 'Hey, check out this covid  tool to take a self assessment test for covid!You can also find the testing centers and helpline info across the country',
          url: 'https://icovids.com'
        }).then( (response) => {
          console.log(response);
        })
        .catch( (error) => {
          console.log(error);
        });
      }

    submitFeedBack(){
        this.submitted = true; 
        if (this.feedBackForm.invalid) {
            return;
         }
      let mongoObj = localStorage.getItem('userId');
      let locObj = localStorage.getItem('locationObj');
      let userInfo = localStorage.getItem('userData');
      let mongoUserId:any;
      let locationData:any;
      let userData:any;
      let jsonData:any = {};
      if(userInfo){
          userData = JSON.parse(userInfo);
      }
      if(mongoObj){
        mongoUserId = JSON.parse(mongoObj);
        jsonData['id'] = mongoUserId.id;
      } 
      if(locObj){
        locationData = JSON.parse(locObj);
      }
      jsonData['locationObj'] = locationData;
      jsonData['feedback'] = this.feedBackForm.value.feedBackname;
      jsonData['name'] = userData.username;
      jsonData['age'] = userData.age;
      jsonData['results'] = [];
      this.ParentProcessService.postMethod(this.API_EndPoint,jsonData).subscribe((data:any)=>{
        this.submitted = false;
         this.ngOnInit();
          this.statusMessage = true;
          this.message = "Thank you very much for sharing your feedback!";
          localStorage.setItem('userId', JSON.stringify(data));
      }, (error:any)=>{
          console.log("failed !");
          this.submitted = false;
          this.ngOnInit();
          this.statusMessage = true;
          this.message = "something went wrong, Try again later!!";
      });

    }

    get f() { return this.feedBackForm.controls; }

}
