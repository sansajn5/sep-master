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
    this.userIsValid = this.route.snapshot.params.id === '1';
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
        this.dummyService.getUrlForBank({
            "merchantId": this.merchantId,
            "userId": this.userIsValid,
             "merchantIdOrderId": this.referenceId,
             "amount": this.amount
        }).subscribe(data => {
          window.open(data.url + "/" + merchantId + "/" + this.clientId + "/" + this.amount, "_blank");

        })
      }
      if (payment.name == 'PAYPAL') {
        // TODO use paymentUrl
         window.open(payment.paymentUrl + `?userId=${this.userIsValid}&merchantId=${this.merchantId}&productId=${this.productId}&price=${this.amount}&referenceId=${this.referenceId}`);
       // window.open('http://localhost:4100/payment?customerId=1&sellerId=' + this.clientId +'&vendorId=' + merchantId + '&productId=1&price=' + this.amount)
      }
      if (payment.name == 'BITCOIN') {
       // http://localhost:4200/payment?organizationId=51&customerId=3&merchantId=92aa3e6b-2594-11ea-b565-0242ac150005&productId=5&price_amount=0.003&price_currency=BTC&receive_currency=BTC
        window.open('http://localhost:4300/payment?organizationId=' + merchantId +'&customerId='+ this.clientId + '&merchantId='+ merchantId +'&productId=5&price_amount=0.003&price_currency=BTC&receive_currency=BTC')
      }
      if (payment.name == 'SUBSCRIBE') {
        window.open(payment.paymentUrl + `?magazine=${this.magazine}&amount=${this.amount}&period=${this.period}&productId=${this.productId}&frequency=${this.frequency}&userId=${this.userIsValid}&merchantId=${this.merchantId}`);
      }
      console.log(payment.paymentUrl);
    }, err=> {
      alert(JSON.stringify(err));
    })
    
  }

}
