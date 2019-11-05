import { Component, Input, OnInit } from '@angular/core';
import { HASH, URL } from "../../constants";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-password-changer',
  templateUrl: './password-changer.component.html',
  styleUrls: ['./password-changer.component.css']
})
export class PasswordChangerComponent implements OnInit {

  old = '';
  new = '';
  newTwo = '';
  @Input() username;

  constructor(private _snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  change() {
    fetch(URL + `players/change?username=${this.username}&oldp=${HASH(this.old)}&newp=${HASH(this.new)}`, {mode: 'cors'})
      .then(res => res.text()).then(result => {
      this._snackBar.open(result, 'ok');
    });
  }

}
