import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentComponent } from './payment/payment.component';
import { PaymentFinishedComponent } from './payment-finished/payment-finished.component';
import { SubscriptionSuccessComponent } from './subscription-success/subscription-success.component';
import { SubscribeComponent } from './subscribe/subscribe.component';
import { SubscriptionFailedComponent } from './subscription-failed/subscription-failed.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: '', redirectTo: 'payment', pathMatch: 'full' },
  { path: 'payment', component: PaymentComponent },
  { path: 'payment/:mode', component: PaymentFinishedComponent },
  { path: 'subscribe', component: SubscribeComponent },
  { path: 'subscription/success/merchantId/:merchantId/userId/:userId', component: SubscriptionSuccessComponent },
  { path: 'subscription/failed', component: SubscriptionFailedComponent },
  { path: 'register', component: RegisterComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
