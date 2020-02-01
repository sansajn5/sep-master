import { OnInit, Component } from '@angular/core';
import { PaymentService } from '../services/payment.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

    private paymentData;

    public pan;
    public cardHolderName;
    public expiryMonth;
    public securityCode;
    public expiryYear;

    public successFlag = false;

    constructor(
        private paymentService: PaymentService,
        private router: Router,
        private route: ActivatedRoute
    ) {}
    
    ngOnInit(): void {
        this.formatData();
    }

    private formatData() {
        this.route.queryParams.subscribe(params => {
            this.paymentData = params;
        });
    }

    validation() {
        if (!this.pan || !this.cardHolderName || !this.expiryMonth || !this.securityCode || !this.expiryYear) {
            alert('Must fill all fields!')
            return false;
        } else {
            return true;
        }
    }

    executePayment() {
        if (this.validation()) {
            if (this.paymentData.transactionId) {
                const body = {
                    transactionId: this.paymentData.transactionId,
                    pan: this.pan,
                    cardHolderName: this.cardHolderName,
                    expiry: this.expiryMonth + '/' + this.expiryYear,
                    securityCode: this.securityCode
                }
                this.paymentService.postPayment(body).subscribe(res => {
                    this.successFlag = true;
                }, err => {
                    console.log(err);
                    alert(err.error.message);
                })
            } else {
                alert('Invalid data!');
            }
            
        };
    }

}