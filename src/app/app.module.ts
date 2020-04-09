import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {DemoMaterialModule} from '../material-module';
import {HttpClientModule} from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpModule } from '@angular/http';
import {MatIconModule} from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

import { AppComponent } from './app.component';
import { CardComponent } from './card/card.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment'; 
import { LoginComponent } from '../app/login/login.component';
import { HomeComponent } from '../app/home/home.component';
import { HelplineComponent } from '../app/helpline/helpline.component';
import { FeedbackComponent } from '../app/feedback/feedback.component';
import { AboutUsComponent } from '../app/about-us/about-us.component';
import { DashboardComponent } from '../app/dashboard/dashboard.component';
import { DialogComponent } from '../app/dialog/dialog.component';
import { WhoComponent } from '../app/who/who.component';
import { DisclaimerComponent } from '../app/disclaimer/disclaimer.component';

import {ParentService} from './services/index';

const routes: Routes = [
  { path: '', component:LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard',  component: DashboardComponent },
  { path: 'home',  component: HomeComponent },
  { path: 'helpline', component:HelplineComponent}
];

@NgModule({
  imports:      [ 
    BrowserModule,
     BrowserAnimationsModule,
     FormsModule,
     DemoMaterialModule,
     MatNativeDateModule,
     ReactiveFormsModule,
     HttpClientModule,
     HttpModule,
     MatTooltipModule,
     RouterModule.forRoot(routes),
     MatDialogModule,
     ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
     HammerModule ],
  declarations: [ AppComponent,  
    CardComponent, LoginComponent, HomeComponent,
     HelplineComponent, FeedbackComponent, AboutUsComponent, DashboardComponent, DialogComponent, WhoComponent, DisclaimerComponent ],
  bootstrap:    [ AppComponent ],
  exports: [RouterModule],
  providers:[ { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' }}, ParentService ],
  // schemas: [ CUSTOM_ELEMENTS_SCHEMA],
  entryComponents:[DialogComponent, WhoComponent]
})
export class AppModule { } 

// platformBrowserDynamic().bootstrapModule(AppModule);

// platformBrowserDynamic().bootstrapModule(AppModule)
// .then(() => {
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('ngsw-worker.js');
// }

// })
// .catch(err => console.log(err));