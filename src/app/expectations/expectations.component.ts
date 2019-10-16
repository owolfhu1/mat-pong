import { Component, OnInit } from '@angular/core';
import {URL} from "../../constants";

@Component({
  selector: 'app-expectations',
  templateUrl: './expectations.component.html',
  styleUrls: ['./expectations.component.css']
})
export class ExpectationsComponent implements OnInit {
  names;
  playerOne;
  playerTwo;
  currentSeason = false;
  msg;

  constructor() { }

  ngOnInit() {
    fetch(URL + 'players/list', {mode: 'cors'})
      .then(res => res.json())
      .then(result => this.names = result);
  }

  round(number) {
    const roundUp = ['5', '6', '7', '8', '9'];
    number = number + '';
    const split = number.split('.');
    let result = split[0] * 1;
    if (split.length > 1) {
      const firstDecimal = split[1].substring(0, 1);
      if (roundUp.includes(firstDecimal)) {
        result++;
      }
    }
    return result;
  }

  getExpectation() {
    const one = this.playerOne;
    const two = this.playerTwo;
    if (one && two) {
      fetch(
        URL + `${this.currentSeason ? 'seasons' : 'players'}/expect?playerOne=${one}&playerTwo=${two}`,
        {mode: 'cors'}).then(res => res.json()
      ).then(result => {
        const multiplier = 21 / (result[0] > result[1] ? result[0] : result[1]);
        if (!result[0] || !result[1]) {
          this.msg = 'bad input';
        } else {
          this.msg = ` ${this.round(multiplier * result[0])} to ${this.round(multiplier * result[1])}`;
        }
      });
    }
  }

}
