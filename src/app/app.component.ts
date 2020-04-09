import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ParentService } from '../app/services/index';
import { DialogComponent } from '../app/dialog/dialog.component';
import { HostListener } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

export interface DialogData {
  url: string | null;
  href?: string;
  clickAction?: Function;
  caption?: string;
  title?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @HostListener('window:popstate', ['$event'])
  onPopState(event:any) {
    console.log('Back button pressed');
    this.router.navigate(['/home'], { queryParams: { page: 'dahboard' }});
  }

   slides = [{
     'image':'https://gsr.dev/material2-carousel/assets/demo.png'},
     {'image':'https://gsr.dev/material2-carousel/assets/demo.png'},
     {'image':'https://gsr.dev/material2-carousel/assets/demo.png'}]


  constructor(public dialog: MatDialog,  private router: Router,  private ParentProcessService: ParentService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    let splashScreen:any = localStorage.getItem('splashScreen');
    if(!splashScreen){
      this.openDialog();
    } 
  }
  
  openDialog(): void {
    
    const dialogRef = this.dialog.open(DialogComponent, {
      width: 'auto',
      data:{'urls': this.slides}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      localStorage.setItem('splashScreen', JSON.stringify({'splash':true}));
    });
  }

}





