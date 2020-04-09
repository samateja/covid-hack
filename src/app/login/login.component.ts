import { Component, OnInit } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
// import { LocalStorage } from '@ngx-pwa/local-storage';
import { isoCodes } from '../dashboard/isocodes';
import { ParentService } from '../../app/services/index';

@Component({
    selector: 'login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit  {
  userForm: FormGroup;
  submitted = false;
  public isoData: any = isoCodes;
  displayCountries:boolean = false;
  locationData:any;
  lat;
  lng;
  zoom;
  origin;
  destination;
  enableHighAccuracy:boolean= true;
  userDeniedLocation:boolean =  false;
  options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    constructor(private router: Router, private formBuilder: FormBuilder,  private ParentProcessService: ParentService) { }

     redirectToHome(){
      this.submitted = true;

      if (this.userForm.invalid) {
          return;
       }

       var userInfo = {username:this.userForm.value.username, age:this.userForm.value.age};
       localStorage.setItem('userData', JSON.stringify(userInfo)); 
       
       if(this.userDeniedLocation){
           var country = this.userForm.value.country;
           var locationObj = {lat: '', lng:''};
           let obj = {'country':country, 'city':'', 'state':''};
           locationObj['place'] = obj;
           localStorage.setItem('locationObj', JSON.stringify(locationObj));
       }

       this.router.navigate(['/home'], { queryParams: { page: 'dashboard' }});
    }
    
    ngOnInit() {
      this.userForm = this.formBuilder.group({
          username: new FormControl('',[Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
          age: new FormControl('', [Validators.required, Validators.min(1),Validators.max(90)]),
          country:new FormControl(''),
      });
        
        this.userForm.controls;
            let userObj = localStorage.getItem('userData');
            if(userObj){
                this.router.navigate(['/home'], { queryParams: { page: 'dashboard' }});
            }

        this.getUserLocation();
    }

   get f() { return this.userForm.controls; }

   getUserLocation() {
    // get Users current position

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 16;
        // AIzaSyCuvMpg6lwx-M1DY7leEXQmivW__lFuIXo Dev-key
        // AIzaSyBs6t65l3GPKPi0H9WQkZI1nQ1g9PzQVvk prod-key
        let url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+this.lat+','+this.lng+
    '&key=AIzaSyCuvMpg6lwx-M1DY7leEXQmivW__lFuIXo';
        this.ParentProcessService.getMethod(url).subscribe(async (data) => { 
            var locationObj = {lat: this.lat, lng:this.lng};
            this.userDeniedLocation = false;
            let city, state, country;
            if(data.results.length >0 ){
              data.results[0].address_components.forEach((element:any) => {
                  if(element.types[0] == 'administrative_area_level_2')
                  {
                    city = element.long_name;
                  }
                  if(element.types[0] == 'administrative_area_level_1')
                  {
                    state = element.long_name;
                  }
                  if(element.types[0] == 'country')
                  {
                    country = element.long_name;
                  }
              });
              let obj = {'country':country, 'city':city, 'state':state};
              locationObj['place'] = obj;
              localStorage.setItem('locationObj', JSON.stringify(locationObj));
            } else {
              locationObj['place'] = 'error';
              localStorage.setItem('locationObj', JSON.stringify(locationObj));
            }
        }, (error:any)=>{
            console.log("error", error);
        });
        
      }, (error)=>{
         let err= this.locationError(error);
         console.warn(`ERROR(${err})`);
        this.displayCountries = true;
      });
    }
  }

  async getDirection() {

    if (typeof this.lat === "undefined" || typeof this.lng === "undefined" || typeof this.zoom === "undefined") {
      await this.getUserLocation();
    }
    this.origin = { lat: this.lat, lng: this.lng };
    
  } 


  locationError(error) {
    this.userDeniedLocation = true;
    switch(error.code) {
        case error.PERMISSION_DENIED:
            return "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            return "Location information is unavailable."
            break;
        case error.TIMEOUT:
            return "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            return "An unknown error occurred."
            break;
    }
}
}

    


