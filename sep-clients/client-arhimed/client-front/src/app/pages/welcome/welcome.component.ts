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

  private userIsValid: string;
  private payments = [];
  public amount: string = '50.00';
  public clientId = "92aa3e6b-2594-11ea-b565-0242ac150005"

  public period = 12;
  public frequency = 'MONTH';
  public productId = '123456789';
  public magazine = 'Magazine Today Physic';
  public referenceId = '123';
  public merchantId = '17ec969e-b845-41f7-824a-2a1877406e78';

  constructor(
    private route: ActivatedRoute,
    private dummyService: DummyServiceService
  ) { }

  ngOnInit() {
    this.userIsValid = '123';
    this.getPaymentMethods();
  }

  public onBack() {
    console.log('You know nothing Milice Kovacevic');
  }

  public getPaymentMethods() {
    this.dummyService.getPaymentMethods().subscribe(data => {
      this.payments = data.payments;
    }, err => {
      alert(JSON.stringify(err));
    })
  }

  public goTo(payment) {
    const body = {
      productId: this.productId,
      price: this.amount
    }
    this.dummyService.createTransaction(body).subscribe(data => {
      this.referenceId = data._id;
      console.log(this.referenceId);
      
      if (payment.name == 'BANK') {
        console.log(payment.paymentUrl)
        this.dummyService.getUrlForBank({
            "merchantId": this.merchantId,
            "userId": this.userIsValid,
             "merchantIdOrderId": this.referenceId,
             "amount": this.amount,
             "url": payment.paymentUrl,
        }).subscribe(data => {
          console.log(data)
          const paymentUrl = data.redirectUrl;
          window.open(paymentUrl , "_blank");
        })
      }
      if (payment.name == 'PAYPAL') {
        // TODO use paymentUrl
        // http://localhost:4204/payment?transactionId=5e35478324b58830c376c444&amount=50%2F92aa3e6b-2594-11ea-b565-0242ac150005%2F92aa3e6b-2594-11ea-b565-0242ac150005%2F50.00
         window.open(payment.paymentUrl + `?userId=${this.userIsValid}&merchantId=${this.merchantId}&productId=${this.productId}&price=${this.amount}&referenceId=${this.referenceId}`);
       // window.open('http://localhost:4100/payment?customerId=1&sellerId=' + this.clientId +'&vendorId=' + merchantId + '&productId=1&price=' + this.amount)
      }
      if (payment.name == 'BITCOIN') {
       // http://localhost:4200/payment?organizationId=51&customerId=3&merchantId=92aa3e6b-2594-11ea-b565-0242ac150005&productId=5&price_amount=0.003&price_currency=BTC&receive_currency=BTC
        window.open('http://localhost:4202/payment?organizationId=' + merchantId +'&customerId='+ this.clientId + '&merchantId='+ merchantId +'&productId=5&price_amount=0.003&price_currency=BTC&receive_currency=BTC')
      }
      if (payment.name == 'PAY_PAL_SUBSCRIBE') {
        window.open(payment.paymentUrl + `?magazine=${this.magazine}&amount=${this.amount}&period=${this.period}&productId=${this.productId}&frequency=${this.frequency}&userId=${this.userIsValid}&merchantId=${this.merchantId}`);
      }
      console.log(payment.paymentUrl);
    }, err=> {
      alert(JSON.stringify(err));
    })
    
  }

}
