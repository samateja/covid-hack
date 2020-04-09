import { Component } from '@angular/core';
import { Injectable, OnInit } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/observable/throw';

import { ParentService } from '../services/index';
import {countryData} from './mock';
 
export interface PeriodicElement {
    phonenumber:string;
    place: string,
    openinghours: string,
    region: string,
    id: number,
    remarks: string,
    url: string,
    job: string
  }


@Component({
    selector: 'helpline',
    templateUrl: 'helpline.component.html',
    styleUrls: ['helpline.component.css']
}) 

@Injectable()
export class HelplineComponent {
    ELEMENT_DATA: PeriodicElement[] = [];
    spinner:boolean = false;
    countryWise:boolean = false;
    dataSource:any;
    displayedColumns: string[];
    panelOpenState = false;
    activateBackButton:boolean = false;
    private API_ENDPOINT: string;
    constructor(private http: Http, private ParentProcessService: ParentService) {
        this.API_ENDPOINT = 'https://api.icovids.com/api/dynamo/';
    }

    GetHelpline(url:string) {
        return this.ParentProcessService.getMethod(url);
    }

    generateTable(url:string, countryName:string){ 
        this.spinner = false;    
        if(url || countryName){
            this.ELEMENT_DATA = [];
            this.countryWise = true;
            let counrtyUrl = this.API_ENDPOINT+ countryName.toLowerCase();
            this.GetHelpline(counrtyUrl).subscribe(async (result) => {
                this.spinner = true; 
                if(result){
                    result.alldata.forEach((element:any, index:any)=>{
                        element.index = index+1;
                        this.ELEMENT_DATA.push(element);
                    });
                } else {
                   console.log("no data, Failed!!"); 
                }    
            },((error:any)=>{
                this.spinner = true; 
                if(error){
                    this.countryWise = false;
                    this.activateBackButton = true;
                }
            }));
        } else {
            this.spinner = true;
            this.countryWise = false;
            this.activateBackButton = false;
            countryData.forEach((element:any, index:any)=>{
                element.index = index+1;
                this.ELEMENT_DATA.push(element);
            }); 
        }

    }

    ngOnInit(): void {
        let sessionLoc = localStorage.getItem('locationObj');
        let countryName: any;
        if(sessionLoc){
            countryName = JSON.parse(sessionLoc);
            if(countryName.place === 'error'){
                // load all countries
                this.generateTable('', '');
            } else {
                // pass country and load all
                this.generateTable(this.API_ENDPOINT, (countryName.place.country).toLowerCase());
            }
        } else {
            this.generateTable('', '');
        }
    }

    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }



}
