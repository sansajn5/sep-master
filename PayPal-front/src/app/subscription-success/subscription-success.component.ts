import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubscriptionService } from '../service/subscription.service';

@Component({
  selector: 'app-subscription-success',
  templateUrl: './subscription-success.component.html',
  styleUrls: ['./subscription-success.component.css']
})
export class SubscriptionSuccessComponent implements OnInit {

  public subscriptionToken;
  public token;

  public merchantId;
  public userId;

  constructor(
    private route: ActivatedRoute,
    private subscriptionService: SubscriptionService
  ) { }

  ngOnInit() {
    this.merchantId = this.route.snapshot.params.merchantId;
    this.userId = this.route.snapshot.params.userId;

    this.subscriptionToken = this.route.snapshot.queryParams.token;

    this.subscriptionService.executeAgreement(this.subscriptionToken, this.merchantId, this.userId).subscribe(data => {
        window.location.href = data.url;
        alert('Subscribed!')
      }, err => {
        window.location.href = err.url;
      });
  }

}
