import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DummyServiceService } from 'src/app/services/dummy-service.service';

const VALID_USER_ID = '';
const INVALID_USER_ID = '';

const merchantId = '92aa3e6b-2594-11ea-b565-0242ac150005';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  private userIsValid: boolean = false;
  private payments = [];
  public amount: string = '50';
  public clientId = "92aa3e6b-2594-11ea-b565-0242ac150005"

  constructor(
    private route: ActivatedRoute,
    private dummyService: DummyServiceService
  ) { }

  ngOnInit() {
    this.userIsValid = this.route.snapshot.params.id === '1';
    this.getPaymentMethods();
  }

  public onBack() {
    console.log('You know nothing Milice Kovacevic');
  }

  public getPaymentMethods() {
    this.dummyService.getPaymentMethods().subscribe(data => {
      this.payments = data.payments;
    })
  }

  public goTo(payment) {
    if (payment.name == 'BANK') {
      window.open(payment.paymentUrl + "/" + merchantId + "/" + this.clientId + "/" + this.amount, "_blank");
    }
    if (payment.name == 'PAY_PAL') {
      // TODO use paymentUrl
      // window.open(payment.paymentUrl)
      window.open('http://localhost:4100/payment?customerId=1&sellerId=' + this.clientId +'&vendorId=' + merchantId + '&productId=1&price=' + this.amount)
    }
    if (payment.name == 'BITCOIN') {
      http://localhost:4200/payment?organizationId=51&customerId=3&merchantId=92aa3e6b-2594-11ea-b565-0242ac150005&productId=5&price_amount=0.003&price_currency=BTC&receive_currency=BTC
      window.open('http://localhost:4300/payment?organizationId=' + merchantId +'&customerId='+ this.clientId + '&merchantId='+ merchantId +'&productId=5&price_amount=0.003&price_currency=BTC&receive_currency=BTC')
    }
    console.log(payment.paymentUrl);
  }

}
