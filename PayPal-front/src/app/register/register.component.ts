import { Component, OnInit } from '@angular/core';
import { RegistrationService } from '../service/registration.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  // http://localhost:4201/register?userId=123&merchantId=456
  public data = {};
  public clientId;
  public secret;

  constructor(
    private registrationService: RegistrationService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.data = params;
    });
  }

  public register() {
    let body = JSON.parse(JSON.stringify(this.data))
    body['clientId'] = this.clientId;
    body['secret'] = this.secret;

    this.registrationService.createUser(body).subscribe(data => {
      this.clientId = '';
      this.secret = '';
      alert('You have successfully registered!');
    }, err => {
      alert(JSON.stringify(err));
    })
  }

}
