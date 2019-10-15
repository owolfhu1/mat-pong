import { Component, OnInit } from '@angular/core';
import { URL } from "../../constants";

@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.css']
})
export class LookupComponent implements OnInit {
  displayedColumns = ['date', 'playerOne', 'playerTwo', 'edit'];
  dataSource = [];
  rawData = [];


  ngOnInit() {
    fetch(URL + 'players/list', {mode: 'cors'})
      .then(res => res.json())
      .then(result => this.names = result);
  }

  getAll() {
    fetch(URL + 'games/all', {mode: 'cors'}).then(res => res.json())
      .then(result => {
        console.log(result);
        this.rawData = result;
        this.setFromAndTo();
        this.takeGames();
      });
  }

  getPlayerOne() {
    fetch(URL + 'games/player?player=' + this.playerOne, {mode: 'cors'}).then(res => res.json())
      .then(result => {
        this.rawData = result;
        this.setFromAndTo();
        this.takeGames();
      });
  }

  getVs() {
    fetch(URL + `games/vs?playerOne=${this.playerOne}&playerTwo=${this.playerTwo}`, {mode: 'cors'})
      .then(res => res.json())
      .then(result => {
        this.rawData = result;
        this.setFromAndTo();
        this.takeGames();
      });
  }

  setFromAndTo() {
    if (this.rawData && this.rawData.length) {
      this.fromDate = this.fromDate ? this.fromDate : new Date(this.rawData[0].time).toISOString();
      this.toDate = this.toDate ? this.toDate : new Date(this.rawData[this.rawData.length -1].time).toISOString();
    }
  }

  takeGames() {
    this.dataSource = [];
    if (!this.fromDate && !this.toDate) {
      this.dataSource = this.rawData;
    } else {
      const fromDate = this.fromDate ? new Date(this.fromDate).getTime() : null;
      const toDate = this.toDate ? new Date(this.toDate).getTime() + 86400000 : null;
      console.log(this.fromDate);
      this.rawData.forEach(x => {
        const time = x.time;
        if (
          (!fromDate || fromDate && time > fromDate) &&
          (!toDate || toDate && time < toDate)
        ) {
          this.dataSource.push(x);
        }
      });
    }
  }

  formatTime(time) {
    return new Date(time).toDateString();
  }

  names = [];
  playerOne;
  playerTwo;
  fromDate;
  toDate;

  reset() {
    this.playerOne = null;
    this.playerTwo = null;
    this.fromDate = null;
    this.toDate = null;
    this.dataSource = [];
  }
}
