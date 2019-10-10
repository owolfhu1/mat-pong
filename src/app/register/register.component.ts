import { Component, OnInit } from '@angular/core';
import { URL } from '../../constants';
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  value = '';

  constructor(private _snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  register() {
    if (/^[a-zA-Z]+$/.test(this.value)) {
      fetch(URL + `players/register?username=${this.value}`, {mode: 'cors'})
        .then(res => res.text()).then(result => {
          this._snackBar.open(result, 'ok');
        }
      );
      this.value = '';
    } else {
      this._snackBar.open('please enter only letters', 'ok');
    }
  }
}
