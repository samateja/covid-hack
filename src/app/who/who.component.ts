import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";

@Component({
    templateUrl: 'who.component.html',
    styleUrls: ['who.component.css']
})
export class WhoComponent {

    constructor(
        public dialogRef: MatDialogRef<WhoComponent>) {}
    
      onNoClick(): void {
          this.dialogRef.close();
      }

}
