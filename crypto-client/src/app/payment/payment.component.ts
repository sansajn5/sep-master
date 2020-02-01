import { Component, AfterViewChecked, OnInit } from "@angular/core";
import { PaymentService } from '../services/payment.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

    private paymentData;

    constructor(
        private paymentService: PaymentService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {   
        this.createOrder();
    }

    private formatData() {
        this.route.queryParams.subscribe(params => {
            this.paymentData = params;
        });
    }

    public createOrder() {
        this.formatData();
        if (this.paymentData) {
            this.paymentService.createOrder(this.paymentData).subscribe(data => {
                window.location.href  = data.payment_url;
            }, err => {
    
            });
        }
    }

}

