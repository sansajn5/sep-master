import { Component, AfterViewChecked, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-payment-finished',
    templateUrl: './payment-finished.component.html',
    styleUrls: ['./payment-finished.component.css']
})
export class PaymentFinishedComponent implements OnInit {

    successFlag = false;
    failFlag = false;

    constructor(
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        const mode = this.route.snapshot.params.mode;
        switch(mode) {
            case 'success':
                this.successFlag = true;
                break;
            case 'fail':
                this.failFlag = true;
                break;
            default:
                break; 
        }
    }
}