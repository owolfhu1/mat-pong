import { Component, OnInit } from '@angular/core';
import { HASH, URL } from '../../constants';
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  username = '';
  password = '';

  constructor(private _snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  register() {
    if (/^[a-zA-Z]+$/.test(this.username)) {
      fetch(URL + `players/register?username=${this.username}&password=${HASH(this.password)}`, {mode: 'cors'})
        .then(res => res.text()).then(result => {
          this._snackBar.open(result, 'ok');
        }
      );
    } else {
      this._snackBar.open('please enter only letters', 'ok');
    }
  }
}
