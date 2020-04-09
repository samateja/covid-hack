import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";

@Component({
    templateUrl: 'dialog.component.html',
    styleUrls: ['dialog.component.css']
})
export class DialogComponent {
    @ViewChild('dot1') dot1: ElementRef;
    @ViewChild('dot2') dot2: ElementRef;
    @ViewChild('dot3') dot3: ElementRef;
    @ViewChild('dot4') dot4: ElementRef;
    @ViewChild('dot5') dot5: ElementRef;
    @ViewChild('dot6') dot6: ElementRef;
    @ViewChild('dot7') dot7: ElementRef;
  
    constructor(
      public dialogRef: MatDialogRef<DialogComponent>) {}
  
    onNoClick(): void {
        this.dialogRef.close();
    }
  
    ngAfterViewInit(): void {
      //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
      //Add 'implements AfterViewInit' to the class.
      this.generateSlider();
      
    }

    skipNow(){
      console.log("stopped!");
      for (var i = 1; i < 99999; i++) {
        window.clearInterval(i);
        window.clearTimeout(i);
       }
    }
  
    generateSlider(){
      let splashScreen:any = localStorage.getItem('splashScreen');
      if(!splashScreen){
          setTimeout(() => {
            this.dot2.nativeElement.click();
            setTimeout(() => {
              this.dot3.nativeElement.click();
              setTimeout(() => {
                this.dot4.nativeElement.click();
                setTimeout(() => {
                  this.dot6.nativeElement.click();
                  setTimeout(() => {
                    this.dot5.nativeElement.click();
                    setTimeout(() => {
                      this.dot7.nativeElement.click();
                    }, 280000);
                  }, 24000);
                }, 20000);
              }, 16000);
            }, 12000);
          }, 4000);
  
      } 
    }
}
