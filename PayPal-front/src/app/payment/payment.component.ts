import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
declare let paypal: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html'
})
export class PaymentComponent implements OnInit, AfterViewChecked  {
// http://localhost:4201/payment?userId=123&merchantId=456&productId=1&price=33.00&referenceId=12sdf1f53
  public scriptAdded = false;
  public body;

  paypalObject = {
    style: {
      color: 'blue',
      size: 'responsive'
    },
    env: 'sandbox', // 'sandbox' OR 'production'
    payment: (data) => {
      return this.httpClient.post(`http://localhost:8082/api/create-payment`, this.body).toPromise().then((res: any) => {
          return res.id;
      }).catch(err => {
      });
    },
    onAuthorize: (data) => {
      return this.httpClient.post(`http://localhost:8082/api/execute-payment`, {
        paymentID: data.paymentID,
        payerID:   data.payerID
      }).toPromise()
        .then((res) => {
          this.router.navigateByUrl('payment/success');
        }).catch(err => {
          this.router.navigateByUrl('payment/failed');
        });
    },
    onCancel: function(data) {
      localStorage.setItem('paymentId', data.paymentID);
    },
  };

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.body = params;
    });
  }

  ngAfterViewChecked() {
    if (!this.scriptAdded) {
      this.paypalScript().then(() => {
        paypal.Button.render(this.paypalObject, '#paypal-button');
      });
    }

    if (localStorage.getItem('paymentId')) {
      this.router.navigateByUrl('payment/canceled');
    }
  }

  private paypalScript() {
    return new Promise((resolve, reject) => {
      this.scriptAdded = true;
      const scriptElement = document.createElement('script');
      scriptElement.src = 'https://www.paypalobjects.com/api/checkout.js';
      document.body.appendChild(scriptElement);
      scriptElement.onload = resolve;
    });
  }
  

}
