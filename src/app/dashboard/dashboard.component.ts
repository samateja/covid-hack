import { Component } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { ParentService } from '../services/index';
import { isoCodes } from './isocodes';

@Component({
    selector: 'dashboard',
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.css']
})
export class DashboardComponent {
    API_EndPoint:string;
    iso: any = isoCodes;
    confirmedCount:number = 0;
    recoveredCount:number = 0;
    deathsCount:number = 0;
    mapIcon:string = '';
    mapStyles:string = '';

constructor( private router: Router, private ParentProcessService: ParentService){
    this.API_EndPoint = 'https://covidapi.info/api/v1/';

}

navigateToHelpline(){
    this.router.navigate(['/home'], { queryParams: { page: 'helpline' }});
  }

  navigateToTest(){
    let results:any = localStorage.getItem('results');
    if(results){
      localStorage.removeItem('results');
    }
    this.router.navigate(['/home']);
  }

  navigateToFeedBack(){
    this.router.navigate(['/home'], { queryParams: { page: 'feedback' }});
  }

  navigateToAboutUs (){
    this.router.navigate(['/home'], { queryParams: { page: 'aboutUs' }});
  }

  ngOnInit(): void {
      //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
      //Add 'implements OnInit' to the class.
      this.getCovidCount();
  }


  getCovidCount(){
    let locObj = localStorage.getItem('locationObj');
    let locationData:any;
    let isoCodeInfo:string;

    if(locObj){
      locationData = JSON.parse(locObj);
      this.iso.forEach((element:any) => {
          if(element.name === locationData.place.country && locationData.place.country !== 'error'){
                isoCodeInfo = element.alpha3;
                this.mapIcon = element.alpha2;
                this.mapStyles = 'flag-icon flag-icon-'+this.mapIcon.toLowerCase()+' mat-flags';
            }
          });
          this.API_EndPoint = this.API_EndPoint+ "country/"+ isoCodeInfo +'/latest';
        } else {
        this.API_EndPoint = this.API_EndPoint+ 'global/count';
        this.mapStyles = '';
    }

    this.ParentProcessService.getMethod(this.API_EndPoint).subscribe((data:any)=>{
        if(data){
            let info:any = Object.keys(data.result);
            if (this.mapStyles !== ''){
                if(info){
                    this.confirmedCount = data.result[info].confirmed;
                    this.recoveredCount = data.result[info].recovered;
                    this.deathsCount = data.result[info].deaths;
                }
            } else {
                if(info){
                    info.forEach((element:any) => {
                        this.confirmedCount += data.result[element].confirmed;
                        this.recoveredCount += data.result[element].recovered;
                        this.deathsCount += data.result[element].deaths;
                    });

                }
            }

        }
        
        // localStorage.setItem('userId', JSON.stringify(data));
    }, (error:any)=>{
        console.log("failed !"); 
    });
  }

}
