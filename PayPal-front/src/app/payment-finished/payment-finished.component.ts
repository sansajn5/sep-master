import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-payment-finished',
  templateUrl: './payment-finished.component.html'
})
export class PaymentFinishedComponent implements OnInit {

  public mode;
  
  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient
  ) { }

  ngOnInit() {
    this.mode = this.route.snapshot.params.mode;
    if (this.mode === 'canceled') {
      const paymentId = localStorage.getItem('paymentId');
      localStorage.clear();
      this.httpClient.post(`http://localhost:8082/api/cancel-payment`, {
        paymentID: paymentId
      }).subscribe(data => {
        alert('The payment was cancelled!')
      })
    }
  }

}
