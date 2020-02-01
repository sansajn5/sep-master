import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PaymentComponent } from './payment/payment.component';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { PaymentFinishedComponent } from './payment-finished/payment-finished.component';
import { HttpClientModule } from '@angular/common/http';
import { PaymentService } from './services/payment.service';

@NgModule({
  declarations: [
    AppComponent,
    PaymentComponent,
    PaymentFinishedComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot([]),
    HttpClientModule
  ],
  providers: [PaymentService],
  bootstrap: [AppComponent]
})
export class AppModule { }
