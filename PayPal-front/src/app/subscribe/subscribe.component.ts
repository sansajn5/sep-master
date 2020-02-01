import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SubscriptionService } from '../service/subscription.service';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.css']
})
export class SubscribeComponent implements OnInit {

  // http://localhost:4201/subscribe?magazine=Hello&amount=111.00&period=12&productId=1&frequency=MONTH&userId=123&merchantId=456

  public data = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private subscriptionSevice: SubscriptionService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.data = params;
    });
  }

  public subscribe() {
    this.subscriptionSevice.createSubscription(this.data).subscribe(data => {
      window.location.href = data.approval_url;
    }, err => {
      alert(JSON.stringify(err));
    })

  }

}
