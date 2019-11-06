import { Component, Input, OnInit } from '@angular/core';
import { URL } from "../../constants";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css']
})
export class RecordComponent implements OnInit {
  @Input() username;
  names;
  playerOne;
  scoreOne;
  playerTwo;
  scoreTwo;

  constructor(private _snackBar: MatSnackBar) { }

  ngOnInit() {
    fetch(URL + 'players/list', {mode: 'cors'})
      .then(res => res.json())
      .then(result => {
        this.names = result;
        this.playerOne = this.username;
      });
  }

  submit() {
    if (
      (!this.scoreOne && this.scoreOne !== 0) ||
      (!this.scoreTwo && this.scoreTwo !== 0) ||
      !this.playerOne ||
      !this.playerTwo
    ) {
      this._snackBar.open('You must fill out all fields.', 'ok');
    } else {
      const time = new Date().getTime();
      fetch(URL + 'games/add' +
        `?playerOne=${this.playerOne}&playerTwo=${this.playerTwo}&scoreOne=${this.scoreOne}&scoreTwo=${this.scoreTwo}&time=${time}`,
        {mode: 'cors'}).then(res => res.text()).then(result => {
        this._snackBar.open(result, 'ok');
        if (result.indexOf(':') === 13) {
          this.playerOne = this.username;
          this.scoreOne = null;
          this.playerTwo = null;
          this.scoreTwo = null;
        }
      });
    }
  }

  clear() {
    this.playerOne = null;
    this.scoreOne = null;
    this.playerTwo = null;
    this.scoreTwo = null;
  }
}
