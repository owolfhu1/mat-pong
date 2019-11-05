import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HASH, URL } from '../../constants';
import { MatSnackBar } from "@angular/material/snack-bar";
import {el} from "@angular/platform-browser/testing/src/browser_util";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  @Output('success') success = new EventEmitter<string>();

  constructor(private _snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  login() {
    fetch(URL + `players/login?username=${this.username}&password=${HASH(this.password)}`, {mode: 'cors'})
      .then(res => res.text()).then(result => {
        if (result && typeof result === 'string') {
          this._snackBar.open(`Welcome ${result}`, 'close');
          this.success.emit(result);
        } else if (typeof result === 'string') {
          this._snackBar.open(`You have entered an incorrect username/password.`, 'ok');
        } else {
          this._snackBar.open(`Something went wrong.`, 'ok');
        }
      });
  }
}
